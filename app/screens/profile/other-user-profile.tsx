import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, MoreVertical } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { supabase } from '../../../src/lib/supabase'

export default function UserProfileScreen() {
  const router = useRouter()
  const { userId } = useLocalSearchParams()

  const [profile, setProfile] = useState<any>(null)
  const [myId, setMyId] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [posts, setPosts] = useState<any[]>([])

  // 🔥 carregar dados
  const loadData = async () => {
    const { data } = await supabase.auth.getUser()
    const me = data?.user?.id
    if (!me) return

    setMyId(me)

    // 👤 perfil
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(userProfile)

    // 🔁 seguidores
    if (me !== userId) {
      const { data: follow } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', me)
        .eq('following_id', userId)
        .single()

      setIsFollowing(!!follow)
    }

    // 🔥 POSTS DO USUÁRIO
    const { data: userPosts } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    setPosts(userPosts || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  // 🔁 seguir
  const handleFollow = async () => {
    if (!myId) return

    if (isFollowing) {
      await supabase
        .from('followers')
        .delete()
        .eq('follower_id', myId)
        .eq('following_id', userId)

      setIsFollowing(false)
    } else {
      await supabase.from('followers').insert({
        follower_id: myId,
        following_id: userId,
      })

      setIsFollowing(true)
    }
  }

  if (!profile) return null

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>

        {/* HEADER */}
        <View className="flex-row justify-between px-6 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#fff" size={28} />
          </TouchableOpacity>

          <TouchableOpacity>
            <MoreVertical color="#fff" size={28} />
          </TouchableOpacity>
        </View>

        {/* PERFIL */}
        <View className="items-center">
          <Image
            source={{
              uri:
                profile.avatar_url ||
                'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
            }}
            style={{ width: 120, height: 120, borderRadius: 999 }}
          />

          <Text className="text-white text-2xl font-bold mt-3">
            {profile.nome}
          </Text>

          <Text className="text-gray-400">
            @{profile.username || 'user'}
          </Text>
        </View>

        {/* BOTÃO SEGUIR */}
        {myId !== userId && (
          <View className="px-6 mt-4">
            <TouchableOpacity
              onPress={handleFollow}
              className={`py-3 rounded-xl ${
                isFollowing ? 'bg-zinc-800' : 'bg-green-500'
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  isFollowing ? 'text-white' : 'text-black'
                }`}
              >
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STATS DINÂMICOS */}
        <View className="flex-row justify-around mt-6">
          <View className="items-center">
            <Text className="text-white font-bold text-lg">
              {posts.length}
            </Text>
            <Text className="text-gray-400 text-sm">Posts</Text>
          </View>

          <View className="items-center">
            <Text className="text-white font-bold text-lg">--</Text>
            <Text className="text-gray-400 text-sm">Seguidores</Text>
          </View>

          <View className="items-center">
            <Text className="text-white font-bold text-lg">--</Text>
            <Text className="text-gray-400 text-sm">Seguindo</Text>
          </View>
        </View>

        {/* 🔥 GRID DE POSTS */}
        <View className="flex-row flex-wrap mt-6">
          {posts.length === 0 ? (
            <Text className="text-gray-500 text-center w-full mt-10">
              Nenhum post ainda
            </Text>
          ) : (
            posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={{
                  width: '33.33%',
                  aspectRatio: 1,
                  padding: 1,
                }}
              >
                <Image
                  source={{ uri: post.media_url }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}