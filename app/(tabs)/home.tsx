import { api } from '@/src/lib/api';
import { useRouter } from 'expo-router';
import { Radio } from 'lucide-react-native';
import { useEffect, useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ── tipos ──────────────────────────────────────────────────────────────────

interface MediaItem {
  id: number;
  path: string;
  kind: 'photo' | 'video';
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

interface TopStreamer {
  rank: number;
  id: number;
  name: string;
  username: string | null;
  avatar: string | null;
  postCount: number;
  followerCount: number;
}

interface HomeData {
  topStreamers: TopStreamer[];
  featuredLives: never[];
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
      <Text style={styles.streamerStat}>{streamer.followerCount} seg.</Text>
    </View>
  );
}

function HomeHeader({
  homeData,
  router,
}: {
  homeData: HomeData | null;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <View>
      {/* logo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Strivo</Text>
      </View>

      {/* Top Streamers */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Top Streamers</Text>
          <TouchableOpacity onPress={() => router.push('/screens/ranking')}>
            <Text style={styles.sectionLink}>Ver ranking</Text>
          </TouchableOpacity>
        </View>

        {!homeData ? (
          <ActivityIndicator color="#39FF14" style={{ marginVertical: 16 }} />
        ) : homeData.topStreamers.length === 0 ? (
          <Text style={styles.emptyNote}>Nenhum streamer ainda.</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
          >
            {homeData.topStreamers.map((s) => (
              <TopStreamerCard key={s.id} streamer={s} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Lives em Destaque */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Lives em Destaque</Text>
          <View style={styles.liveBadge}>
            <Radio size={10} color="#ff3b30" />
            <Text style={styles.liveBadgeText}>AO VIVO</Text>
          </View>
        </View>

        {!homeData || homeData.featuredLives.length === 0 ? (
          <View style={styles.livesEmpty}>
            <Text style={styles.livesEmptyText}>Nenhuma live ao vivo agora</Text>
            <Text style={styles.livesEmptyHint}>Volte mais tarde!</Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.sectionTitle, { paddingHorizontal: 16, marginBottom: 4 }]}>
        Feed
      </Text>
    </View>
  );
}

// ── tela principal ─────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  async function loadHome() {
    api
      .get<HomeData>('/home')
      .then(setHomeData)
      .catch(console.log);
  }

  async function loadFeed(reset = false) {
    try {
      const cursorParam = reset || !cursor ? '' : `&cursor=${cursor}`;
      const res = await api.get<FeedResponse>(`/posts/feed?limit=20${cursorParam}`);
      if (reset) {
        setPosts(res.items);
      } else {
        setPosts((prev) => [...prev, ...res.items]);
      }
      setCursor(res.nextCursor);
      setHasMore(!!res.nextCursor);
    } catch (err) {
      console.log('Erro feed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadHome();
    loadFeed(true);
  }, []);

  function onRefresh() {
    setRefreshing(true);
    setCursor(undefined);
    loadHome();
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
        ListHeaderComponent={<HomeHeader homeData={homeData} router={router} />}
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
                source={{ uri: item.author.avatar ?? 'https://i.pravatar.cc/150' }}
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
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  center: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: { color: '#39FF14', fontSize: 22, fontWeight: 'bold' },

  // seções
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    paddingBottom: 12,
    marginTop: 4,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 2,
  },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  sectionLink: { color: '#39FF14', fontSize: 12 },
  emptyNote: { color: '#555', fontSize: 13, paddingHorizontal: 16, marginTop: 8 },

  // top streamers
  streamerCard: { alignItems: 'center', marginHorizontal: 8, width: 72 },
  streamerAvatarWrap: { position: 'relative' },
  streamerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#39FF14',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#39FF14',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  rankBadgeText: { color: '#000', fontSize: 9, fontWeight: 'bold' },
  streamerName: { color: '#fff', fontSize: 11, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  streamerStat: { color: '#666', fontSize: 10, marginTop: 2 },

  // lives
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveBadgeText: { color: '#ff3b30', fontSize: 10, fontWeight: 'bold' },
  livesEmpty: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
  },
  livesEmptyText: { color: '#555', fontSize: 13, fontWeight: '600' },
  livesEmptyHint: { color: '#333', fontSize: 11, marginTop: 4 },

  // feed
  emptyText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptySubText: { color: '#666', fontSize: 13, marginTop: 4 },
  postCard: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  authorName: { color: '#fff', fontWeight: 'bold' },
  postImage: { width: '100%', aspectRatio: 1 },
  caption: { color: '#ddd', paddingHorizontal: 12, paddingVertical: 8, fontSize: 14 },
});
