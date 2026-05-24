import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/lib/api";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

interface FeedResponse {
  items: FeedPost[];
  nextCursor?: string;
}

export default function HomeScreen() {
  const { logout } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  async function loadFeed(reset = false) {
    try {
      const cursorParam = reset || !cursor ? "" : `&cursor=${cursor}`;
      const res = await api.get<FeedResponse>(
        `/posts/feed?limit=20${cursorParam}`,
      );
      if (reset) {
        setPosts(res.items);
      } else {
        setPosts((prev) => [...prev, ...res.items]);
      }
      setCursor(res.nextCursor);
      setHasMore(!!res.nextCursor);
    } catch (err) {
      console.log("Erro feed:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadFeed(true);
  }, []);

  function onRefresh() {
    setRefreshing(true);
    setCursor(undefined);
    loadFeed(true);
  }

  function onEndReached() {
    if (hasMore && !loading) loadFeed();
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color="#4CAF50" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Strivo</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutBtn}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4CAF50"
          />
        }
        onEndReached={onEndReached}
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
                source={{
                  uri: item.author.avatar ?? "https://i.pravatar.cc/150",
                }}
                style={styles.avatar}
              />
              <Text style={styles.authorName}>{item.author.name}</Text>
            </View>
            {item.media[0] && (
              <Image
                source={{ uri: `https://picsum.photos/seed/${item.id}/500` }}
                style={styles.postImage}
                resizeMode="cover"
              />
            )}
            {item.caption ? (
              <Text style={styles.caption}>{item.caption}</Text>
            ) : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F0F" },
  center: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  headerTitle: { color: "#4CAF50", fontSize: 22, fontWeight: "bold" },
  logoutBtn: { color: "#777", fontSize: 14 },
  emptyText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  emptySubText: { color: "#666", fontSize: 13, marginTop: 4 },
  postCard: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  authorName: { color: "#fff", fontWeight: "bold" },
  postImage: { width: "100%", aspectRatio: 1 },
  caption: {
    color: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
});
