import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import { Radio } from "lucide-react-native";
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

function TopStreamerCard({ streamer }: { streamer: TopStreamer }) {
  const label = streamer.username ?? streamer.name;
  return (
    <View style={styles.streamerCard}>
      <View style={styles.streamerAvatarWrap}>
        <Image
          source={{ uri: streamer.avatar ?? `https://i.pravatar.cc/150?u=${streamer.id}` }}
          style={styles.streamerAvatar}
        />
        <View style={styles.rankBadge}>
          <Text style={styles.rankBadgeText}>#{streamer.rank}</Text>
        </View>
      </View>
      <Text style={styles.streamerName} numberOfLines={1}>{label}</Text>
      <Text style={styles.streamerStat}>{streamer.follower_count} seg.</Text>
    </View>
  );
}

function HomeHeader({
  topStreamers,
  router,
}: {
  topStreamers: TopStreamer[] | null;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Strivo</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Top Streamers</Text>
          <TouchableOpacity onPress={() => router.push("/screens/ranking")}>
            <Text style={styles.sectionLink}>Ver ranking</Text>
          </TouchableOpacity>
        </View>

        {!topStreamers ? (
          <ActivityIndicator color="#39FF14" style={{ marginVertical: 16 }} />
        ) : topStreamers.length === 0 ? (
          <Text style={styles.emptyNote}>Nenhum streamer ainda.</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
          >
            {topStreamers.map((s) => (
              <TopStreamerCard key={s.id} streamer={s} />
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Lives em Destaque</Text>
          <View style={styles.liveBadge}>
            <Radio size={10} color="#ff3b30" />
            <Text style={styles.liveBadgeText}>AO VIVO</Text>
          </View>
        </View>
        <View style={styles.livesEmpty}>
          <Text style={styles.livesEmptyText}>Nenhuma live ao vivo agora</Text>
          <Text style={styles.livesEmptyHint}>Volte mais tarde!</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { paddingHorizontal: 16, marginBottom: 4 }]}>
        Feed
      </Text>
    </View>
  );
}

// ── tela principal ─────────────────────────────────────────────────────────

const LIMIT = 20;

export default function HomeScreen() {
  const router = useRouter();
  const [topStreamers, setTopStreamers] = useState<TopStreamer[] | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
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
        ListHeaderComponent={<HomeHeader topStreamers={topStreamers} router={router} />}
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
                source={{ uri: item.author.avatar ?? "https://i.pravatar.cc/150" }}
                style={styles.avatar}
              />
              <Text style={styles.authorName}>{item.author.name}</Text>
            </View>
            {item.media[0] ? (
              <Image
                source={{ uri: `https://picsum.photos/seed/${item.id}/500` }}
                style={styles.postImage}
                resizeMode="cover"
              />
            ) : null}
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
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#1a1a1a" },
  headerTitle: { color: "#39FF14", fontSize: 22, fontWeight: "bold" },
  section: { borderBottomWidth: 1, borderBottomColor: "#1a1a1a", paddingBottom: 12, marginTop: 4 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, marginBottom: 2 },
  sectionTitle: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  sectionLink: { color: "#39FF14", fontSize: 12 },
  emptyNote: { color: "#555", fontSize: 13, paddingHorizontal: 16, marginTop: 8 },
  streamerCard: { alignItems: "center", marginHorizontal: 8, width: 72 },
  streamerAvatarWrap: { position: "relative" },
  streamerAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: "#39FF14" },
  rankBadge: { position: "absolute", bottom: -4, right: -4, backgroundColor: "#39FF14", borderRadius: 8, paddingHorizontal: 4, paddingVertical: 1 },
  rankBadgeText: { color: "#000", fontSize: 9, fontWeight: "bold" },
  streamerName: { color: "#fff", fontSize: 11, fontWeight: "600", marginTop: 6, textAlign: "center" },
  streamerStat: { color: "#666", fontSize: 10, marginTop: 2 },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  liveBadgeText: { color: "#ff3b30", fontSize: 10, fontWeight: "bold" },
  livesEmpty: { marginHorizontal: 16, marginTop: 8, backgroundColor: "#1a1a1a", borderRadius: 12, paddingVertical: 20, alignItems: "center" },
  livesEmptyText: { color: "#555", fontSize: 13, fontWeight: "600" },
  livesEmptyHint: { color: "#333", fontSize: 11, marginTop: 4 },
  emptyText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  emptySubText: { color: "#666", fontSize: 13, marginTop: 4 },
  postCard: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#1a1a1a" },
  postHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  authorName: { color: "#fff", fontWeight: "bold" },
  postImage: { width: "100%", aspectRatio: 1 },
  caption: { color: "#ddd", paddingHorizontal: 12, paddingVertical: 8, fontSize: 14 },
});
