import { supabase } from "@/src/lib/supabase";
import { Search, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
        prev.map((u) =>
          u.id === userId ? { ...u, is_following: !isFollowing } : u
        )
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
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View className="px-4 py-3 border-b border-gray-800 mt-4">
        <View className="flex-row items-center bg-gray-900 rounded-full px-4 py-2">
          <Search size={20} color="#39FF14" />
          <TextInput
            className="flex-1 ml-3 text-white"
            placeholder="Pesquisar usuários..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={searchUsers}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView>
        {searchQuery.length < 2 ? (
          <View className="items-center justify-center py-20">
            <Search size={64} color="#333" />
            <Text className="text-gray-500 mt-4">Digite ao menos 2 caracteres</Text>
          </View>
        ) : loading ? (
          <ActivityIndicator size="large" color="#39FF14" style={{ marginTop: 40 }} />
        ) : results.length > 0 ? (
          results.map((user) => (
            <View
              key={user.id}
              className="flex-row items-center justify-between px-4 py-3 border-b border-gray-900"
            >
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: user.avatar ?? `https://i.pravatar.cc/150?u=${user.id}`,
                  }}
                  className="w-12 h-12 rounded-full border-2 border-[#39FF14]"
                />
                <View className="ml-3">
                  <Text className="text-white font-semibold">{user.name}</Text>
                  {user.username ? (
                    <Text className="text-gray-400 text-sm">@{user.username}</Text>
                  ) : null}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => toggleFollow(user.id, user.is_following)}
                className={`px-4 py-2 rounded-xl ${
                  user.is_following ? "bg-gray-700" : "bg-[#39FF14]"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    user.is_following ? "text-white" : "text-black"
                  }`}
                >
                  {user.is_following ? "Seguindo" : "Seguir"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500">Nenhum usuário encontrado</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
