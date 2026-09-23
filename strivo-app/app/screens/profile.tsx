import ShareProfile from "@/src/components/share-profile";
import { RingAvatar } from "@/src/components/strivo/RingAvatar";
import { useAuth } from "@/src/contexts/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { colors, displayFont, radii } from "@/src/theme/strivo";
import { useRouter } from "expo-router";
import {
  Grid3X3,
  Heart,
  MessageCircle,
  PlaySquare,
  Send,
  Settings,
  Share2,
  Store,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Post {
  id: number;
  thumbnail: string;
  image: string;
  caption?: string;
  username?: string;
  avatar?: string;
}

const FALLBACK_IMAGE = "https://picsum.photos/500";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`id, caption, created_at, post_media(order, media(id, path, kind))`)
        .eq("author_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) { console.log("ERRO POSTS:", error); return; }
      setPosts(
        (data ?? []).map((item: any) => ({
          id: item.id,
          thumbnail: `https://picsum.photos/seed/${item.id}/300`,
          image: `https://picsum.photos/seed/${item.id}/500`,
          caption: item.caption ?? "",
          username: user.name,
          avatar: user.avatar ?? "https://i.pravatar.cc/150",
        }))
      );
    })();

    (async () => {
      const [followersRes, followingRes] = await Promise.all([
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", user.id),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", user.id),
      ]);
      setFollowers(followersRes.count ?? 0);
      setFollowing(followingRes.count ?? 0);
    })();
  }, [user]);

  function handlePostPress(post: Post) {
    setSelectedPost(post);
    setIsPostModalVisible(true);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.topBar}>
          <Text style={styles.handle}>@{user?.username ?? "usuario"}</Text>
          <TouchableOpacity onPress={() => router.push("/screens/configuration")}>
            <Settings size={19} color={colors.text} strokeWidth={1.9} />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <RingAvatar uri={user?.avatar ?? FALLBACK_IMAGE} size={82} ring="active" />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{followers}</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{following}</Text>
              <Text style={styles.statLabel}>Seguindo</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioBlock}>
          <Text style={styles.name}>{user?.name ?? "Seu nome"}</Text>
          {user?.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.primaryAction} onPress={() => router.push("/screens/edit-profile")}>
            <Text style={styles.primaryActionText}>Editar perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryAction} onPress={() => setShareVisible(true)}>
            <Share2 size={15} color={colors.text} strokeWidth={1.9} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryAction} onPress={() => router.push("/screens/stores/add-store")}>
            <Store size={15} color={colors.text} strokeWidth={1.9} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabsRow}>
          <View style={[styles.tab, styles.tabActive]}>
            <Grid3X3 size={19} color={colors.text} strokeWidth={1.8} />
          </View>
          <View style={styles.tab}>
            <PlaySquare size={19} color={colors.textDim} strokeWidth={1.8} />
          </View>
        </View>

        <View style={styles.grid}>
          {posts.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum post ainda</Text>
          ) : (
            posts.map((item) => (
              <TouchableOpacity key={item.id} style={styles.gridItem} onPress={() => handlePostPress(item)}>
                <Image source={{ uri: item.thumbnail }} style={styles.gridImage} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <Modal visible={isPostModalVisible} animationType="slide">
        <SafeAreaView style={styles.container} edges={["top"]}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Image source={{ uri: selectedPost?.avatar || FALLBACK_IMAGE }} style={styles.modalAvatar} />
              <Text style={styles.modalUsername}>{selectedPost?.username}</Text>
            </View>
            <TouchableOpacity onPress={() => setIsPostModalVisible(false)}>
              <X color={colors.text} size={24} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Image source={{ uri: selectedPost?.image || FALLBACK_IMAGE }} style={{ width, height: width }} />
            <View style={styles.modalActions}>
              <Heart color={colors.text} size={24} strokeWidth={1.8} />
              <MessageCircle color={colors.text} size={24} strokeWidth={1.8} style={{ marginLeft: 14 }} />
              <Send color={colors.text} size={24} strokeWidth={1.8} style={{ marginLeft: 14 }} />
            </View>
            {selectedPost?.caption ? (
              <Text style={styles.modalCaption}>
                <Text style={{ fontWeight: "700" }}>{selectedPost?.username} </Text>
                {selectedPost.caption}
              </Text>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <ShareProfile
        profileUrl={`https://strivo.app/perfil/${user?.username ?? ""}`}
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 14, paddingBottom: 4 },
  handle: { fontSize: 15, color: colors.textStrong, ...displayFont },

  header: { flexDirection: "row", alignItems: "center", gap: 24, paddingHorizontal: 18, marginTop: 12 },
  statsRow: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 16, fontWeight: "700", color: colors.textStrong },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  bioBlock: { paddingHorizontal: 18, marginTop: 14 },
  name: { fontSize: 14.5, fontWeight: "700", color: colors.textStrong },
  bio: { fontSize: 13.5, lineHeight: 19, color: colors.prose, marginTop: 6 },

  actionsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 18, marginTop: 14 },
  primaryAction: { flex: 1, alignItems: "center", backgroundColor: colors.accent, borderRadius: radii.sm, paddingVertical: 9 },
  primaryActionText: { fontSize: 13, fontWeight: "700", color: colors.bg },
  secondaryAction: { width: 40, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm },

  tabsRow: { flexDirection: "row", marginTop: 18, borderTopWidth: 1, borderTopColor: colors.divider },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabActive: { borderBottomWidth: 1.5, borderBottomColor: colors.text },

  grid: { flexDirection: "row", flexWrap: "wrap", paddingTop: 2 },
  gridItem: { width: "33.33%", aspectRatio: 1, padding: 1 },
  gridImage: { width: "100%", height: "100%" },
  emptyText: { color: colors.textDim, padding: 24 },

  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  modalHeaderLeft: { flexDirection: "row", alignItems: "center" },
  modalAvatar: { width: 36, height: 36, borderRadius: 18 },
  modalUsername: { color: colors.text, marginLeft: 12, fontWeight: "600" },
  modalActions: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12 },
  modalCaption: { color: colors.text, paddingHorizontal: 16, marginTop: 4, lineHeight: 19 },
});
