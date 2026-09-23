import { supabase } from "@/src/lib/supabase";
import { colors, displayFont, radii } from "@/src/theme/strivo";
import { Search, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SearchUser {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  is_following: boolean;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (text: string) => {
    setSearchQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user.id ?? "";
      const { data, error } = await supabase.rpc("search_users", {
        q: text,
        current_user_id: currentUserId,
      });
      if (error) throw error;
      setResults(data ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (userId: string, isFollowing: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    try {
      if (isFollowing) {
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", session.user.id)
          .eq("following_id", userId);
      } else {
        await supabase.from("follows").insert({
          follower_id: session.user.id,
          following_id: userId,
        });
      }
      setResults((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_following: !isFollowing } : u))
      );
    } catch (err) {
      console.log("Follow error:", err);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Buscar</Text>

      <View style={styles.searchField}>
        <Search size={16} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar usuários..."
          placeholderTextColor={colors.textDim}
          value={searchQuery}
          onChangeText={searchUsers}
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <X size={16} color={colors.textDim} />
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length < 2 ? (
        <View style={styles.center}>
          <Search size={56} color={colors.divider} />
          <Text style={styles.centerText}>Digite ao menos 2 caracteres</Text>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(u) => u.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item: user }) => (
            <View style={styles.userRow}>
              <Image
                source={{ uri: user.avatar ?? `https://i.pravatar.cc/150?u=${user.id}` }}
                style={styles.userAvatar}
              />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
                {user.username ? <Text style={styles.userHandle}>@{user.username}</Text> : null}
              </View>
              <TouchableOpacity
                onPress={() => toggleFollow(user.id, user.is_following)}
                style={[styles.followButton, user.is_following && styles.followButtonActive]}
              >
                <Text style={[styles.followButtonText, user.is_following && styles.followButtonTextActive]}>
                  {user.is_following ? "Seguindo" : "Seguir"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.center}>
          <Text style={styles.centerText}>Nenhum usuário encontrado</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 19, color: colors.textStrong, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 14, ...displayFont },
  searchField: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 18, marginBottom: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: 14, paddingVertical: 11 },
  searchInput: { flex: 1, fontSize: 13.5, color: colors.text, fontWeight: "500" },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 80 },
  centerText: { color: colors.textDim, marginTop: 12 },
  userRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingVertical: 9 },
  userAvatar: { width: 44, height: 44, borderRadius: 22 },
  userName: { fontSize: 13.5, fontWeight: "700", color: colors.textStrong },
  userHandle: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  followButton: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: radii.sm, backgroundColor: colors.accent },
  followButtonActive: { backgroundColor: "rgba(255,255,255,0.08)" },
  followButtonText: { fontSize: 12, fontWeight: "700", color: colors.bg },
  followButtonTextActive: { color: colors.text },
});
