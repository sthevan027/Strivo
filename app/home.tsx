import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Bell,
  Bookmark,
  Heart,
  Home,
  MessageCircle,
  MessageSquareMoreIcon,
  Plus,
  Search,
  Share2
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { supabase } from '@/src/lib/supabase';

export default function Feed() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());

  const [currentUser, setCurrentUser] = useState<any>(null);

  // 🔥 PEGAR USUÁRIO
  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setCurrentUser(data.user);
      return data.user;
    }
    return null;
  };

  // 🔥 PEGAR IDS DO FEED
  const getFeedUserIds = async (user: any) => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

    if (error) {
      console.log('Erro follows:', error);
      return [user.id];
    }

    const followingIds = data?.map(f => f.following_id) || [];

    // 🔥 você + quem você segue
    return [user.id, ...followingIds];
  };

  // 🔥 USERS (STORIES)
  const fetchUsers = async (user: any) => {
    const ids = await getFeedUserIds(user);

    if (ids.length === 0) {
      setUsers([]);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('id, nome, avatar_url')
      .in('id', ids);

    const sorted = data?.sort((a, b) =>
      a.id === user.id ? -1 : b.id === user.id ? 1 : 0
    );

    setUsers(sorted || []);
  };

  // 🔥 POSTS
  const fetchPosts = async (user: any) => {
    setLoading(true);

    const ids = await getFeedUserIds(user);

    if (ids.length === 0) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .in('user_id', ids)
      .order('created_at', { ascending: false });

    if (!postsData) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, nome, avatar_url')
      .in('id', ids);

    const finalPosts = postsData.map(post => ({
      ...post,
      profiles: profilesData?.find(p => p.id === post.user_id) || null
    }));

    setPosts(finalPosts);
    setLoading(false);
  };

  // 🔥 CARREGAMENTO CORRETO
  const loadFeed = async () => {
    const user = await loadUser();
    if (!user) return;

    await fetchUsers(user);
    await fetchPosts(user);
  };

  useFocusEffect(
    useCallback(() => {
      loadFeed();
    }, [])
  );

  useEffect(() => {
    const channel = supabase
      .channel('posts-feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        () => loadFeed()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const toggleLike = (postId: any) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  const toggleSave = (postId: any) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  // 🔥 HEADER
  const renderHeader = () => (
    <View>
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className="text-[#00FF40] text-3xl font-bold">Strivo</Text>

        <View className="flex-row gap-4">
          <TouchableOpacity>
            <Plus size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
            <Bell size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/screens/chat/message-screen')}>
            <MessageSquareMoreIcon size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={users}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(`/screens/profile/other-user-profile?userId=${item.id}`)
            }
            style={{ alignItems: 'center', marginHorizontal: 6 }}
          >
            <LinearGradient
              colors={['#16a34a', '#4ade80']}
              style={{ padding: 2, borderRadius: 999 }}
            >
              <Image
                source={{
                  uri:
                    item.avatar_url ||
                    'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
                }}
                style={{ width: 70, height: 70, borderRadius: 999 }}
              />
            </LinearGradient>

            <Text style={{ color: '#fff', fontSize: 11, marginTop: 4 }}>
              {item.nome || 'user'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderPost = ({ item: post }: any) => {
    const user = post.profiles || {};

    return (
      <View className="mb-4">
        <View className="flex-row items-center px-3 py-2">
          <Image
            source={{
              uri:
                user.avatar_url ||
                'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
            }}
            className="w-10 h-10 rounded-full"
          />

          <Text className="text-white ml-3 font-bold">
            {user.nome || 'Usuário'}
          </Text>
        </View>

        {post.media_url && (
          <Image
            source={{ uri: post.media_url }}
            style={{ width: '100%', height: 300 }}
          />
        )}

        <View className="flex-row justify-between px-3 py-3">
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => toggleLike(post.id)}>
              <Heart
                size={26}
                color={likedPosts.has(post.id) ? '#00FF40' : '#fff'}
                fill={likedPosts.has(post.id) ? '#00FF40' : 'transparent'}
              />
            </TouchableOpacity>

            <MessageCircle size={26} color="#fff" />
            <Share2 size={24} color="#fff" />
          </View>

          <TouchableOpacity onPress={() => toggleSave(post.id)}>
            <Bookmark
              size={26}
              color={savedPosts.has(post.id) ? '#00FF40' : '#fff'}
              fill={savedPosts.has(post.id) ? '#00FF40' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        {post.content && (
          <Text className="text-white px-3 pb-2">
            {post.content}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {loading ? (
        <ActivityIndicator size="large" color="#00FF40" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          ListHeaderComponent={renderHeader}
        />
      )}

      {/* NAVBAR */}
      <View className="flex-row justify-around items-center py-3 border-t border-zinc-800">
        <TouchableOpacity onPress={() => router.push('/')}>
          <Home size={26} color="#00FF40" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/searchScreen')}>
          <Search size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/chat/message-screen')}>
          <MessageSquareMoreIcon size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}