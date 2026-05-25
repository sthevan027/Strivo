import { api } from '@/src/lib/api';
import { useRouter } from 'expo-router';
import { ArrowLeft, Crown } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface RankUser {
  rank: number;
  id: number;
  name: string;
  username: string | null;
  avatar: string | null;
  postCount: number;
  followerCount: number;
}

const CROWN_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

function PodiumCard({ user }: { user: RankUser }) {
  const crownColor = CROWN_COLORS[user.rank - 1] ?? '#555';
  const isFirst = user.rank === 1;

  return (
    <View
      className="items-center mx-2"
      style={{ marginTop: isFirst ? 0 : 20 }}
    >
      <Crown size={20} color={crownColor} style={{ marginBottom: 4 }} />
      <Image
        source={{ uri: user.avatar ?? `https://i.pravatar.cc/150?u=${user.id}` }}
        style={{
          width: isFirst ? 80 : 64,
          height: isFirst ? 80 : 64,
          borderRadius: isFirst ? 40 : 32,
          borderWidth: 3,
          borderColor: crownColor,
        }}
      />
      <Text className="text-white font-bold mt-2 text-center text-sm" numberOfLines={1}>
        {user.username ?? user.name}
      </Text>
      <Text className="text-gray-400 text-xs mt-0.5">
        {user.followerCount} seguidores
      </Text>
      <View
        style={{ backgroundColor: crownColor }}
        className="rounded-full px-2 py-0.5 mt-1"
      >
        <Text className="text-black text-xs font-bold">#{user.rank}</Text>
      </View>
    </View>
  );
}

export default function RankingScreen() {
  const router = useRouter();
  const [ranking, setRanking] = useState<RankUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<RankUser[]>('/ranking?limit=20')
      .then(setRanking)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  // reorder podium: 2nd | 1st | 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean) as RankUser[];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#39FF14" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Ranking</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#39FF14" />
        </View>
      ) : ranking.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Nenhum streamer ainda.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Podium Top 3 */}
          {top3.length > 0 && (
            <View className="bg-[#0f0f0f] mx-4 mt-6 rounded-2xl py-6">
              <Text className="text-center text-gray-400 text-xs uppercase tracking-widest mb-4">
                Top Streamers
              </Text>
              <View className="flex-row justify-center items-end px-4">
                {podiumOrder.map((u) => (
                  <PodiumCard key={u.id} user={u} />
                ))}
              </View>
            </View>
          )}

          {/* Lista restante */}
          {rest.length > 0 && (
            <View className="mx-4 mt-4 mb-8">
              {rest.map((user) => (
                <View
                  key={user.id}
                  className="flex-row items-center py-3 border-b border-gray-900"
                >
                  <Text className="text-gray-500 w-8 text-center font-bold">
                    {user.rank}
                  </Text>
                  <Image
                    source={{
                      uri: user.avatar ?? `https://i.pravatar.cc/150?u=${user.id}`,
                    }}
                    className="w-10 h-10 rounded-full border border-gray-700 ml-2"
                  />
                  <View className="ml-3 flex-1">
                    <Text className="text-white font-semibold">{user.name}</Text>
                    {user.username ? (
                      <Text className="text-gray-400 text-xs">@{user.username}</Text>
                    ) : null}
                  </View>
                  <Text className="text-[#39FF14] text-xs font-bold">
                    {user.followerCount} seg.
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
