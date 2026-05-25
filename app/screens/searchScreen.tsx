import { api } from '@/src/lib/api';
import { Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
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
} from 'react-native';

interface SearchUser {
  id: number;
  name: string;
  username: string | null;
  avatar: string | null;
  isFollowing: boolean;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
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
      const data = await api.get<SearchUser[]>(
        `/users/search?q=${encodeURIComponent(text)}`,
      );
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (userId: number, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await api.delete(`/users/${userId}/follow`);
      } else {
        await api.post(`/users/${userId}/follow`, {});
      }
      setResults((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isFollowing: !isFollowing } : u,
        ),
      );
    } catch (err) {
      console.log('Follow error:', err);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
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
                onPress={() => toggleFollow(user.id, user.isFollowing)}
                className={`px-4 py-2 rounded-xl ${
                  user.isFollowing ? 'bg-gray-700' : 'bg-[#39FF14]'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    user.isFollowing ? 'text-white' : 'text-black'
                  }`}
                >
                  {user.isFollowing ? 'Seguindo' : 'Seguir'}
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
