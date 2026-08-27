import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Plus, Search, Send } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── tipos ──────────────────────────────────────────────────────────────────

interface MediaItem {
  id: number;
  path: string;
  kind: "photo" | "video";
  mime_type?: string;
}

interface FeedPost {
  id: number;
  caption: string | null;
  created_at: string;
  author: { id: string; name: string; avatar: string | null };
  media: MediaItem[];
}

interface TopStreamer {
  rank: number;
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  post_count: number;
  follower_count: number;
}

// ── sub-componentes ────────────────────────────────────────────────────────

function HomeHeader({
  topStreamers,
  router,
  userAvatar,
}: {
  topStreamers: TopStreamer[] | null;
  router: ReturnType<typeof useRouter>;
  userAvatar?: string | null;
}) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>strivo</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push("/screens/ranking")}>
            <Search color="#F5F5F5" size={24} strokeWidth={2.2} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/screens/create-post")}>
            <Plus color="#F5F5F5" size={25} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.storiesSection}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Stories</Text>
        </View>

        {!topStreamers ? (
          <ActivityIndicator color="#39FF14" style={{ marginVertical: 16 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesList}
          >
            <TouchableOpacity style={styles.storyItem} onPress={() => router.push("/screens/story-screen")}>
              <View style={styles.storyAvatarWrap}>
                <Image source={{ uri: userAvatar ?? "https://i.pravatar.cc/150?u=me" }} style={styles.storyAvatar} />
                <View style={styles.addStory}><Plus color="#000" size={13} strokeWidth={3} /></View>
              </View>
              <Text style={styles.storyName} numberOfLines={1}>Seu story</Text>
            </TouchableOpacity>
            {topStreamers.map((s) => (
              <TouchableOpacity key={s.id} style={styles.storyItem} onPress={() => router.push("/screens/profile/other-user-profile")}>
                <View style={styles.storyAvatarWrap}>
                  <Image source={{ uri: s.avatar ?? `https://i.pravatar.cc/150?u=${s.id}` }} style={styles.storyAvatar} />
                </View>
                <Text style={styles.storyName} numberOfLines={1}>{s.username ?? s.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// ── tela principal ─────────────────────────────────────────────────────────

const LIMIT = 20;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [topStreamers, setTopStreamers] = useState<TopStreamer[] | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastPost, setLastPost] = useState<{ created_at: string; id: number } | null>(null);

  async function loadTopStreamers() {
    const { data } = await supabase.rpc("get_ranking", { p_limit: 5 });
    setTopStreamers(
      (data ?? []).map((r: Omit<TopStreamer, "rank">, i: number) => ({ ...r, rank: i + 1 }))
    );
  }

  async function loadFeed(reset = false) {
    try {
      const cursor = reset ? null : lastPost;
      const { data, error } = await supabase.rpc("get_feed", {
        p_limit: LIMIT + 1,
        p_cursor_at: cursor?.created_at ?? null,
        p_cursor_id: cursor?.id ?? null,
      });
      if (error) throw error;
      const rows: FeedPost[] = data ?? [];
      const hasNext = rows.length > LIMIT;
      const items = hasNext ? rows.slice(0, LIMIT) : rows;
      if (reset) {
        setPosts(items);
      } else {
        setPosts((prev) => [...prev, ...items]);
      }
      setHasMore(hasNext);
      if (items.length > 0) {
        const last = items[items.length - 1];
        setLastPost({ created_at: last.created_at, id: last.id });
      }
    } catch (err) {
      console.log("Erro feed:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadTopStreamers();
    loadFeed(true);
  }, []);

  function onRefresh() {
    setRefreshing(true);
    setLastPost(null);
    loadTopStreamers();
    loadFeed(true);
  }

  function mediaUrl(media: MediaItem) {
    return supabase.storage.from("posts").getPublicUrl(media.path).data.publicUrl;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color="#39FF14" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={<HomeHeader topStreamers={topStreamers} router={router} userAvatar={user?.avatar} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#39FF14" />
        }
        onEndReached={() => { if (hasMore && !loading) loadFeed(); }}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhum post ainda.</Text>
            <Text style={styles.emptySubText}>Seja o primeiro a publicar!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: item.author.avatar ?? `https://i.pravatar.cc/150?u=${item.author.id}` }}
                style={styles.avatar}
              />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{item.author.name}</Text>
                <Text style={styles.postLocation}>Strivo</Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MoreHorizontal color="#F5F5F5" size={21} />
              </TouchableOpacity>
            </View>
            {item.media[0] ? (
              <Image
                source={{ uri: mediaUrl(item.media[0]) }}
                style={styles.postImage}
                resizeMode="cover"
              />
            ) : null}
            <View style={styles.postActions}>
              <View style={styles.actionGroup}>
                <TouchableOpacity onPress={() => setLikedPosts((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}>
                  <Heart color={likedPosts[item.id] ? "#FF4D67" : "#F5F5F5"} fill={likedPosts[item.id] ? "#FF4D67" : "transparent"} size={25} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}}>
                  <MessageCircle color="#F5F5F5" size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}}>
                  <Send color="#F5F5F5" size={23} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setSavedPosts((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}>
                <Bookmark color="#F5F5F5" fill={savedPosts[item.id] ? "#F5F5F5" : "transparent"} size={24} />
              </TouchableOpacity>
            </View>
            {likedPosts[item.id] ? <Text style={styles.likes}>Curtido por você</Text> : null}
            {item.caption ? (
              <Text style={styles.caption}>{item.caption}</Text>
            ) : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// ── estilos ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F0F" },
  center: { flex: 1, backgroundColor: "#0F0F0F", justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#1a1a1a" },
  headerTitle: { color: "#F5F5F5", fontSize: 24, fontWeight: "800", letterSpacing: -0.8 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 20 },
  storiesSection: { borderBottomWidth: 1, borderBottomColor: "#1a1a1a", paddingBottom: 12, marginTop: 4 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, marginBottom: 2 },
  sectionTitle: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  storiesList: { paddingHorizontal: 12, paddingVertical: 8 },
  storyItem: { alignItems: "center", marginHorizontal: 6, width: 70 },
  storyAvatarWrap: { padding: 2, borderRadius: 34, borderWidth: 2, borderColor: "#39FF14", position: "relative" },
  storyAvatar: { width: 58, height: 58, borderRadius: 29 },
  addStory: { position: "absolute", right: -2, bottom: -1, backgroundColor: "#39FF14", borderRadius: 9, width: 18, height: 18, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#0F0F0F" },
  storyName: { color: "#ddd", fontSize: 11, marginTop: 6, textAlign: "center" },
  emptyText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  emptySubText: { color: "#666", fontSize: 13, marginTop: 4 },
  postCard: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: "#1a1a1a", paddingBottom: 10 },
  postHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 11 },
  avatar: { width: 38, height: 38, borderRadius: 19, marginRight: 10, borderWidth: 1, borderColor: "#39FF14" },
  authorInfo: { flex: 1 },
  authorName: { color: "#fff", fontWeight: "bold" },
  postLocation: { color: "#777", fontSize: 11, marginTop: 2 },
  moreButton: { padding: 4 },
  postImage: { width: "100%", aspectRatio: 1, backgroundColor: "#181818" },
  postActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, paddingTop: 12 },
  actionGroup: { flexDirection: "row", alignItems: "center", gap: 18 },
  likes: { color: "#F5F5F5", fontWeight: "700", fontSize: 13, paddingHorizontal: 14, paddingTop: 8 },
  caption: { color: "#ddd", paddingHorizontal: 14, paddingTop: 7, fontSize: 14, lineHeight: 19 },
});
