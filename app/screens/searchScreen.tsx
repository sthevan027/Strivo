// SearchScreen.tsx
import { Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface SearchResult {
  id: number;
  type: 'account' | 'hashtag';
  name: string;
  username?: string;
  avatar?: string;
  followers?: string;
  posts?: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Dados mockados
  const mockResults: SearchResult[] = [
    {
      id: 1,
      type: 'account',
      name: 'João Gamer',
      username: '@joaogamer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
      followers: '15.2k',
    },
    {
      id: 2,
      type: 'account',
      name: 'Mari Streams',
      username: '@maristreams',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mari',
      followers: '8.5k',
    },
    {
      id: 3,
      type: 'hashtag',
      name: '#gaming',
      posts: '1.2M posts',
    },
    {
      id: 4,
      type: 'account',
      name: 'Pedro Live',
      username: '@pedrolive',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
      followers: '23.8k',
    },
    {
      id: 5,
      type: 'hashtag',
      name: '#streamer',
      posts: '856k posts',
    },
    {
      id: 6,
      type: 'account',
      name: 'Ana Play',
      username: '@anaplay',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      followers: '12.3k',
    },
    {
      id: 7,
      type: 'hashtag',
      name: '#gameplay',
      posts: '654k posts',
    },
    {
      id: 8,
      type: 'account',
      name: 'GR6 Explode',
      username: '@gr6explode',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gr6',
      followers: '45.7k',
    },
  ];

  // Filtrar resultados baseado na busca
  const filteredResults = searchQuery.trim()
    ? mockResults.filter(
        (result) =>
          result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (result.username?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setIsSearching(text.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Search Bar */}
      <View className="px-4 py-3 bg-black border-b border-gray-800 mt-4">
        <View className="flex-row items-center bg-gray-900 rounded-full px-4 py-2">
          <Search size={20} color="#39FF14" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder="Pesquisar contas..."
            placeholderTextColor="#39FF14"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="ml-2">
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <ScrollView className="flex-1 bg-black">
        {!isSearching ? (
          // Estado inicial - sem pesquisa
          <View className="flex-1 items-center justify-center px-6 py-20">
            <Search size={64} color="#fff" strokeWidth={1.5} />
            <Text className="text-white/80 text-lg mt-4 text-center">
              Pesquise por contas e hashtags
            </Text>
            <Text className="text-white/50 text-sm mt-2 text-center">
              Encontre pessoas e tópicos que você gosta
            </Text>
          </View>
        ) : filteredResults.length > 0 ? (
          // Resultados encontrados
          <View className="py-2">
            {filteredResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                className="flex-row items-center px-4 py-3 active:bg-gray-900"
              >
                {result.type === 'account' ? (
                  <>
                    <Image
                      source={{ uri: result.avatar }}
                      className="w-12 h-12 rounded-full border-2 border-[#00FF40]"
                    />
                    <View className="flex-1 ml-3">
                      <Text className="text-white font-semibold text-base">
                        {result.name}
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        {result.username} • {result.followers} seguidores
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="w-12 h-12 rounded-full bg-gray-800 items-center justify-center">
                      <Text className="text-[#00FF40] text-xl font-bold">#</Text>
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="text-white font-semibold text-base">
                        {result.name}
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        {result.posts}
                      </Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Nenhum resultado encontrado
          <View className="flex-1 items-center justify-center px-6 py-20">
            <Search size={64} color="#374151" strokeWidth={1.5} />
            <Text className="text-gray-400 text-lg mt-4 text-center">
              Nenhum resultado encontrado
            </Text>
            <Text className="text-gray-600 text-sm mt-2 text-center">
              Tente pesquisar por outro termo
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}