// SearchScreen.tsx
import { Search, X } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import { supabase } from '@/src/lib/supabase'

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [userId, setUserId] = useState<string | null>(null)
  const [following, setFollowing] = useState<string[]>([])

  // 🔥 pegar usuário logado
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUserId(data.user?.id || null)
    }

    getUser()
  }, [])

  // 🔥 buscar quem eu sigo
  const fetchFollowing = async () => {
    if (!userId) return

    const { data } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId)

    setFollowing(data?.map(f => f.following_id) || [])
  }

  useEffect(() => {
    if (userId) fetchFollowing()
  }, [userId])

  // 🔥 FOLLOW / UNFOLLOW
  const toggleFollow = async (targetId: string) => {
    if (!userId) return

    const isFollowing = following.includes(targetId)

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', userId)
        .eq('following_id', targetId)

      setFollowing(prev => prev.filter(id => id !== targetId))
    } else {
      await supabase.from('follows').insert({
        follower_id: userId,
        following_id: targetId,
      })

      setFollowing(prev => [...prev, targetId])
    }
  }

  // 🔍 BUSCA
  const searchUsers = async (text: string) => {
    setSearchQuery(text)
    setIsSearching(text.length > 0)

    if (text.length < 2) {
      setResults([])
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome, avatar_url')
      .ilike('nome', `%${text}%`)
      .limit(20)

    if (error) {
      console.log('Erro busca:', error)
      setResults([])
    } else {
      setResults(data || [])
    }

    setLoading(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsSearching(false)
    setResults([])
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* 🔍 SEARCH */}
      <View className="px-4 py-3 border-b border-gray-800 mt-4">
        <View className="flex-row items-center bg-gray-900 rounded-full px-4 py-2">
          <Search size={20} color="#39FF14" />

          <TextInput
            className="flex-1 ml-3 text-white"
            placeholder="Pesquisar usuários..."
            placeholderTextColor="#39FF14"
            value={searchQuery}
            onChangeText={searchUsers}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* RESULTADOS */}
      <ScrollView>

        {!isSearching ? (
          <View className="items-center justify-center py-20">
            <Search size={64} color="#fff" />
            <Text className="text-white mt-4">
              Pesquise por usuários
            </Text>
          </View>
        ) : loading ? (
          <ActivityIndicator size="large" color="#00FF40" style={{ marginTop: 40 }} />
        ) : results.length > 0 ? (
          results.map((user) => {
            const isFollowing = following.includes(user.id)

            return (
              <View
                key={user.id}
                className="flex-row items-center justify-between px-4 py-3"
              >
                {/* USER */}
                <View className="flex-row items-center">
                  <Image
                    source={{
                      uri:
                        user.avatar_url ||
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
                    }}
                    className="w-12 h-12 rounded-full border-2 border-[#00FF40]"
                  />

                  <View className="ml-3">
                    <Text className="text-white font-semibold">
                      {user.nome}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      @{user.id.slice(0, 8)}
                    </Text>
                  </View>
                </View>

                {/* BOTÃO */}
                {userId !== user.id && (
                  <TouchableOpacity
                    onPress={() => toggleFollow(user.id)}
                    className={`px-4 py-2 rounded-xl ${
                      isFollowing ? 'bg-gray-700' : 'bg-[#00FF40]'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isFollowing ? 'text-white' : 'text-black'
                      }`}
                    >
                      {isFollowing ? 'Seguindo' : 'Seguir'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          })
        ) : (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400">
              Nenhum usuário encontrado
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}