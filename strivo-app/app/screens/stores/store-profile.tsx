import { useAuth } from "@/src/contexts/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { colors, displayFont, radii } from "@/src/theme/strivo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Grid3X3, MoreHorizontal } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface StoreRow {
  id: number;
  owner_id: string;
  name: string;
  category: string;
  description: string | null;
  contact: string | null;
  avatar: string | null;
}

interface StorePost {
  id: number;
  thumbnail: string;
}

export default function StoreProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [store, setStore] = useState<StoreRow | null>(null);
  const [posts, setPosts] = useState<StorePost[]>([]);
  const [followers, setFollowers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from("stores").select("*").eq("id", id).single();
      if (!error) setStore(data);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!store) return;
    (async () => {
      const [postsRes, followersRes] = await Promise.all([
        supabase
          .from("posts")
          .select("id")
          .eq("author_id", store.owner_id)
          .order("created_at", { ascending: false })
          .limit(30),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", store.owner_id),
      ]);
      setPosts((postsRes.data ?? []).map((p: any) => ({ id: p.id, thumbnail: `https://picsum.photos/seed/${p.id}/300` })));
      setFollowers(followersRes.count ?? 0);
    })();
  }, [store]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  if (!store) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyText}>Store não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const isOwner = user?.id === store.owner_id;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.handle} numberOfLines={1}>{store.name}</Text>
        <MoreHorizontal size={18} color={colors.text} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={styles.header}>
          <Image source={{ uri: store.avatar ?? "https://picsum.photos/200" }} style={styles.avatar} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{followers}</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioBlock}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{store.name}</Text>
            <View style={styles.storeBadge}>
              <Text style={styles.storeBadgeText}>STORE</Text>
            </View>
          </View>
          <Text style={styles.category}>{store.category}</Text>
          {store.description ? <Text style={styles.bio}>{store.description}</Text> : null}
        </View>

        <View style={styles.actionsRow}>
          {isOwner ? (
            <TouchableOpacity style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>Editar store</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.primaryAction}>
                <Text style={styles.primaryActionText}>Seguir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryAction}>
                <Text style={styles.secondaryActionText}>Mensagem</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.tabsRow}>
          <View style={[styles.tab, styles.tabActive]}>
            <Grid3X3 size={19} color={colors.text} strokeWidth={1.8} />
          </View>
        </View>

        <View style={styles.grid}>
          {posts.length === 0 ? (
            <Text style={styles.emptyGridText}>Essa store ainda não postou nada.</Text>
          ) : (
            posts.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <Image source={{ uri: p.thumbnail }} style={styles.gridImage} />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  emptyText: { color: colors.textDim },

  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18 },
  handle: { flex: 1, textAlign: "center", fontSize: 15, color: colors.textStrong, marginHorizontal: 12, ...displayFont },

  header: { flexDirection: "row", alignItems: "center", gap: 24, paddingHorizontal: 18 },
  avatar: { width: 82, height: 82, borderRadius: 41 },
  statsRow: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 16, fontWeight: "700", color: colors.textStrong },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  bioBlock: { paddingHorizontal: 18, marginTop: 14 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 14.5, fontWeight: "700", color: colors.textStrong },
  storeBadge: { borderWidth: 1, borderColor: colors.accent, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 },
  storeBadgeText: { fontSize: 10, fontWeight: "700", color: colors.accent },
  category: { fontSize: 12.5, fontWeight: "600", color: colors.accent, marginTop: 2 },
  bio: { fontSize: 13.5, lineHeight: 19, color: colors.prose, marginTop: 6 },

  actionsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 18, marginTop: 14 },
  primaryAction: { flex: 1, alignItems: "center", backgroundColor: colors.accent, borderRadius: radii.sm, paddingVertical: 9 },
  primaryActionText: { fontSize: 13, fontWeight: "700", color: colors.bg },
  secondaryAction: { flex: 1, alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, paddingVertical: 9 },
  secondaryActionText: { fontSize: 13, fontWeight: "700", color: colors.text },

  tabsRow: { flexDirection: "row", marginTop: 18, borderTopWidth: 1, borderTopColor: colors.divider },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabActive: { borderBottomWidth: 1.5, borderBottomColor: colors.text },

  grid: { flexDirection: "row", flexWrap: "wrap", paddingTop: 2 },
  gridItem: { width: "33.33%", aspectRatio: 1, padding: 1 },
  gridImage: { width: "100%", height: "100%" },
  emptyGridText: { color: colors.textDim, padding: 24 },
});
