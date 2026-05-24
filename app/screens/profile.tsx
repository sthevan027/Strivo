import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/lib/api";
import ShareProfile from "@/src/components/share-profile";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronDown,
  Clapperboard,
  Grid3X3,
  Heart,
  Menu,
  MessageCircle,
  Repeat2,
  Send,
  SquareKanban,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Post {
  id: number;
  type: "post" | "video";
  thumbnail: string;
  image?: string;
  caption?: string;
  likes?: number;
  username?: string;
  avatar?: string;
}

interface MediaItem {
  id: number;
  path: string;
  kind: "photo" | "video";
  bucket: string;
}

interface FeedPost {
  id: number;
  caption: string | null;
  createdAt: string;
  author: { id: number; name: string; avatar: string | null };
  media: MediaItem[];
}

const FALLBACK_IMAGE = "https://picsum.photos/500";

const ProfileScreen = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<
    "posts" | "klips" | "republicados"
  >("posts");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [profileData, setProfileData] = useState({
    username: "",
    name: "",
    avatar: "",
  });

  const fetchPosts = async () => {
    try {
      const res = await api.get<{ items: FeedPost[]; nextCursor?: string }>(
        "/posts/feed?limit=50",
      );
      const mine = res.items.filter((p) => p.author.id === user?.id);
      const formatted: Post[] = mine.map((item) => ({
        id: item.id,
        type: item.media[0]?.kind === "video" ? "video" : "post",
        thumbnail: `https://picsum.photos/seed/${item.id}/300`,
        image: `https://picsum.photos/seed/${item.id}/500`,
        caption: item.caption ?? "",
        likes: 0,
        username: item.author.name,
        avatar: item.author.avatar ?? "https://i.pravatar.cc/150",
      }));
      setPosts(formatted);
    } catch (err) {
      console.log("ERRO POSTS:", err);
    }
  };

  const fetchProfile = async () => {
    if (user) {
      setProfileData({
        username: user.username ?? "",
        name: user.name,
        avatar: user.avatar ?? "",
      });
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchProfile();
  }, [user]);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsPostModalVisible(true);
  };

  const getCurrentContent = () => {
    if (activeTab === "posts") return posts;
    return [];
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 bg-black">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View className="flex-row justify-between px-6 py-3">
            <TouchableOpacity className="flex-row items-center">
              <SquareKanban color="#fff" />
              <ChevronDown color="#fff" size={18} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Menu size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* PERFIL */}
          <View className="items-center py-6">
            <LinearGradient
              colors={["#16a34a", "#4ade80"]}
              style={{ padding: 4, borderRadius: 999 }}
            >
              <Image
                source={{ uri: profileData.avatar || FALLBACK_IMAGE }}
                style={{ width: 120, height: 120, borderRadius: 999 }}
              />
            </LinearGradient>
            <Text className="text-white text-2xl font-bold mt-4">
              {profileData.name || "Nome"}
            </Text>
            <Text className="text-gray-400">
              @{profileData.username || "usuario"}
            </Text>
          </View>

          {/* TABS */}
          <View className="flex-row border-b border-gray-800">
            <TouchableOpacity
              onPress={() => setActiveTab("posts")}
              className="flex-1 items-center py-3"
            >
              <Grid3X3 color="#22c55e" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center py-3">
              <Clapperboard color="#999" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center py-3">
              <Repeat2 color="#999" />
            </TouchableOpacity>
          </View>

          {/* POSTS */}
          <View className="flex-row flex-wrap">
            {posts.length === 0 && (
              <Text style={{ color: "#fff", padding: 20 }}>
                Nenhum post encontrado
              </Text>
            )}
            {getCurrentContent().map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handlePostClick(item)}
                style={{ width: "33.3%", aspectRatio: 1 }}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={{ width: "100%", height: "100%" }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* MODAL */}
        <Modal visible={isPostModalVisible} animationType="slide">
          <SafeAreaView className="flex-1 bg-black">
            <View className="flex-row items-center justify-between px-4 py-3">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: selectedPost?.avatar || FALLBACK_IMAGE }}
                  style={{ width: 40, height: 40, borderRadius: 999 }}
                />
                <Text className="text-white ml-3">
                  {selectedPost?.username}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsPostModalVisible(false)}>
                <X color="#fff" size={28} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Image
                source={{ uri: selectedPost?.image || FALLBACK_IMAGE }}
                style={{ width, height: width }}
              />
              <View className="flex-row px-4 py-3">
                <Heart color="#fff" size={28} />
                <MessageCircle
                  color="#fff"
                  size={28}
                  style={{ marginLeft: 12 }}
                />
                <Send color="#fff" size={28} style={{ marginLeft: 12 }} />
              </View>
              <Text className="text-white px-4 font-bold">
                {selectedPost?.likes} curtidas
              </Text>
              <Text className="text-white px-4 mt-2">
                <Text style={{ fontWeight: "bold" }}>
                  {selectedPost?.username}
                </Text>{" "}
                {selectedPost?.caption}
              </Text>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        <ShareProfile
          profileUrl="https://teste.com"
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
