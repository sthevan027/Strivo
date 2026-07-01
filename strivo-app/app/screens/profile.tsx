import { useAuth } from "@/src/contexts/AuthContext";
import { supabase } from "@/src/lib/supabase";
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

const FALLBACK_IMAGE = "https://picsum.photos/500";

const ProfileScreen = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "klips" | "republicados">("posts");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPosts = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("posts")
      .select(`id, caption, created_at, post_media(order, media(id, path, kind))`)
      .eq("author_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) { console.log("ERRO POSTS:", error); return; }
    const formatted: Post[] = (data ?? []).map((item: any) => ({
      id: item.id,
      type: item.post_media?.[0]?.media?.kind === "video" ? "video" : "post",
      thumbnail: `https://picsum.photos/seed/${item.id}/300`,
      image: `https://picsum.photos/seed/${item.id}/500`,
      caption: item.caption ?? "",
      likes: 0,
      username: user.name,
      avatar: user.avatar ?? "https://i.pravatar.cc/150",
    }));
    setPosts(formatted);
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsPostModalVisible(true);
  };

  const getCurrentContent = () => (activeTab === "posts" ? posts : []);

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
                source={{ uri: user?.avatar || FALLBACK_IMAGE }}
                style={{ width: 120, height: 120, borderRadius: 999 }}
              />
            </LinearGradient>
            <Text className="text-white text-2xl font-bold mt-4">
              {user?.name || "Nome"}
            </Text>
            <Text className="text-gray-400">@{user?.username || "usuario"}</Text>
          </View>

          {/* TABS */}
          <View className="flex-row border-b border-gray-800">
            <TouchableOpacity onPress={() => setActiveTab("posts")} className="flex-1 items-center py-3">
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
              <Text style={{ color: "#fff", padding: 20 }}>Nenhum post encontrado</Text>
            )}
            {getCurrentContent().map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handlePostClick(item)}
                style={{ width: "33.3%", aspectRatio: 1 }}
              >
                <Image source={{ uri: item.thumbnail }} style={{ width: "100%", height: "100%" }} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* MODAL POST */}
        <Modal visible={isPostModalVisible} animationType="slide">
          <SafeAreaView className="flex-1 bg-black">
            <View className="flex-row items-center justify-between px-4 py-3">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: selectedPost?.avatar || FALLBACK_IMAGE }}
                  style={{ width: 40, height: 40, borderRadius: 999 }}
                />
                <Text className="text-white ml-3">{selectedPost?.username}</Text>
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
                <MessageCircle color="#fff" size={28} style={{ marginLeft: 12 }} />
                <Send color="#fff" size={28} style={{ marginLeft: 12 }} />
              </View>
              <Text className="text-white px-4 font-bold">{selectedPost?.likes} curtidas</Text>
              <Text className="text-white px-4 mt-2">
                <Text style={{ fontWeight: "bold" }}>{selectedPost?.username}</Text>{" "}
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
