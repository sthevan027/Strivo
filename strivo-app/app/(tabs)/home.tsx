import { RingAvatar } from "@/src/components/strivo/RingAvatar";
import { useAuth } from "@/src/contexts/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { colors, displayFont, radii } from "@/src/theme/strivo";
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

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "BOM DIA";
  if (hour < 18) return "BOA TARDE";
  return "BOA NOITE";
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

// ── sub-componentes ────────────────────────────────────────────────────────

function FeedHeader({
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
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.eyebrow}>{greeting()}</Text>
          <Text style={styles.greetingTitle}>O que rolou hoje</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/screens/profile")} style={styles.headerAvatarWrap}>
          <RingAvatar uri={userAvatar} size={38} ring="none" />
          <View style={styles.onlineDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.headerActionsRow}>
        <TouchableOpacity onPress={() => router.push("/screens/searchScreen")} style={styles.iconButton}>
          <Search color={colors.text} size={20} strokeWidth={2.2} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/screens/create/create-post")} style={styles.iconButton}>
          <Plus color={colors.text} size={21} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <View style={styles.storiesSection}>
        <Text style={styles.sectionLabel}>Stories</Text>

        {!topStreamers ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: 16 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesList}
          >
            <TouchableOpacity style={styles.storyItem} onPress={() => router.push("/screens/story-screen")}>
              <View>
                <RingAvatar uri={userAvatar} size={48} ring="none" />
                <View style={styles.addStoryBadge}>
                  <Plus color={colors.bg} size={13} strokeWidth={3} />
                </View>
              </View>
              <Text style={styles.storyName} numberOfLines={1}>Seu story</Text>
            </TouchableOpacity>
            {topStreamers.map((s) => (
              <TouchableOpacity key={s.id} style={styles.storyItem} onPress={() => router.push("/screens/profile/other-user-profile")}>
                <RingAvatar uri={s.avatar} size={48} ring="active" />
                <Text style={styles.storyName} numberOfLines={1}>{s.username ?? s.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.divider} />
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
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={<FeedHeader topStreamers={topStreamers} router={router} userAvatar={user?.avatar} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        onEndReached={() => { if (hasMore && !loading) loadFeed(); }}
        onEndReachedThreshold={0.3}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhum post ainda.</Text>
            <Text style={styles.emptySubText}>Seja o primeiro a publicar!</Text>
          </View>
        }
        renderItem={({ item }) => {
          const hasMedia = item.media.length > 0;
          const liked = !!likedPosts[item.id];
          const saved = !!savedPosts[item.id];

          return (
            <View style={hasMedia ? styles.mediaCard : styles.textCard}>
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: item.author.avatar ?? `https://i.pravatar.cc/150?u=${item.author.id}` }}
                  style={styles.avatar}
                />
                <Text style={styles.authorName} numberOfLines={1}>{item.author.name}</Text>
                <Text style={styles.postTime}>{timeAgo(item.created_at)}</Text>
              </View>

              {hasMedia ? (
                <Image
                  source={{ uri: mediaUrl(item.media[0]) }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              ) : item.caption ? (
                <Text style={styles.captionLarge}>{item.caption}</Text>
              ) : null}

              {hasMedia && item.caption ? (
                <Text style={styles.caption}>{item.caption}</Text>
              ) : null}

              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => setLikedPosts((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                >
                  <Heart color={liked ? colors.danger : colors.textMuted} fill={liked ? colors.danger : "transparent"} size={17} strokeWidth={1.8} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem} onPress={() => {}}>
                  <MessageCircle color={colors.textMuted} size={17} strokeWidth={1.8} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem} onPress={() => {}}>
                  <Send color={colors.textMuted} size={17} strokeWidth={1.8} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => setSavedPosts((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                >
                  <Bookmark color={colors.textMuted} fill={saved ? colors.textMuted : "transparent"} size={17} strokeWidth={1.8} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem}>
                  <MoreHorizontal color={colors.textMuted} size={17} strokeWidth={1.8} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

// ── estilos ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: "center", alignItems: "center" },

  greetingRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 18, paddingBottom: 4 },
  eyebrow: { fontSize: 12.5, fontWeight: "600", color: colors.accentSoft, letterSpacing: 0.4 },
  greetingTitle: { fontSize: 21, marginTop: 3, color: colors.textStrong, ...displayFont },
  headerAvatarWrap: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  onlineDot: { position: "absolute", top: 3, right: 3, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.accent, borderWidth: 2, borderColor: colors.bg },

  headerActionsRow: { flexDirection: "row", justifyContent: "flex-end", gap: 14, paddingHorizontal: 18, marginTop: -30, marginBottom: 4 },
  iconButton: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },

  storiesSection: { paddingVertical: 16 },
  sectionLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5, color: colors.textMuted, textTransform: "uppercase", paddingHorizontal: 18, marginBottom: 10 },
  storiesList: { paddingHorizontal: 18, gap: 16, flexDirection: "row" },
  storyItem: { alignItems: "center", width: 56 },
  addStoryBadge: { position: "absolute", right: -2, bottom: -1, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.accent, borderWidth: 2.5, borderColor: colors.bg, alignItems: "center", justifyContent: "center" },
  storyName: { fontSize: 11, fontWeight: "600", color: colors.textMuted, marginTop: 6, textAlign: "center" },

  divider: { height: 1, backgroundColor: colors.divider, marginHorizontal: 18, marginBottom: 14 },

  emptyText: { color: colors.textStrong, fontSize: 16, fontWeight: "bold" },
  emptySubText: { color: colors.textDim, fontSize: 13, marginTop: 4 },

  mediaCard: { backgroundColor: colors.surface, borderRadius: radii.xl, marginHorizontal: 14, marginBottom: 12, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 10 } },
  textCard: { backgroundColor: colors.surface, borderRadius: radii.xl, marginHorizontal: 14, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 10 } },

  postHeader: { flexDirection: "row", alignItems: "center", gap: 9, padding: 14, paddingBottom: 10 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  authorName: { flex: 1, fontWeight: "700", fontSize: 13.5, letterSpacing: -0.1, color: colors.textStrong },
  postTime: { fontSize: 11.5, color: colors.textDim },

  postImage: { width: "100%", aspectRatio: 1, backgroundColor: colors.divider },
  captionLarge: { fontSize: 14, lineHeight: 19, color: colors.prose, paddingHorizontal: 14, paddingBottom: 4 },
  caption: { fontSize: 14, lineHeight: 19, color: colors.prose, padding: 14, paddingTop: 10 },

  postActions: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingBottom: 12, paddingTop: 2 },
  actionItem: { padding: 8, marginHorizontal: -2 },
});
