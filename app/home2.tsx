// App.tsx
import { useRouter } from 'expo-router';
import { Bookmark, Heart, MessageCircle, Plus, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Story {
  id: number;
  username: string;
  avatar: string;
  isUser?: boolean;
}

interface Post {
  id: number;
  username: string;
  userAvatar: string;
  music: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
}

export default function Feed() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [followingUsers, setFollowingUsers] = useState<Set<number>>(new Set());
  const navigation = useRouter();
  const stories: Story[] = [
    { 
      id: 1, 
      username: 'Seu story', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User', 
      isUser: true 
    },
    { id: 2, username: 'joaogamer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' },
    { id: 3, username: 'maristreams', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mari' },
    { id: 4, username: 'pedrolive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro' },
    { id: 5, username: 'anaplay', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana' },
  ];

  const posts: Post[] = [
    {
      id: 1,
      username: 'gr6explodeoriginal',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gr6',
      music: 'MC Ryan SP, MC IG, MC Don Juan',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=1200&fit=crop',
      likes: 1543,
      comments: 82,
      shares: 45,
    },
    {
      id: 2,
      username: 'streamerbr',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=streamer',
      music: 'Trap do Momento - Beat Pesado',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=1200&fit=crop',
      likes: 2891,
      comments: 156,
      shares: 78,
    },
    {
      id: 3,
      username: 'gamerproyt',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer',
      music: 'Lo-Fi Gaming Beats',
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=1200&fit=crop',
      likes: 3245,
      comments: 203,
      shares: 91,
    },
  ];

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleSave = (postId: number) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleFollow = (postId: number) => {
    setFollowingUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-black">
        <Text className="text-[#7FFF00] text-3xl font-bold">Strivo</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Heart size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity className="relative" onPress={() => navigation.push('/screens/chat/message-screen')}>
            <MessageCircle size={28} color="#fff" />
            <View className="absolute -top-1 -right-1 bg-red-600 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories */}
      <View className="bg-black border-b border-gray-800">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-2 py-3"
        >
          {stories.map((story) => (
            <TouchableOpacity key={story.id} className="items-center mx-2">
              <View className={`relative ${story.isUser ? 'border-2 border-[#7FFF00]' : 'border-2 border-gray-700'} rounded-full p-0.5`}>
                <Image
                  source={{ uri: story.avatar }}
                  className="w-16 h-16 rounded-full"
                />
                {story.isUser && (
                  <View className="absolute bottom-0 right-0 bg-[#7FFF00] rounded-full w-5 h-5 items-center justify-center">
                    <Plus size={16} color="#000" strokeWidth={3} />
                  </View>
                )}
              </View>
              <Text className="text-white text-xs mt-1 max-w-[70px]" numberOfLines={1}>
                {story.username}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Feed */}
      <ScrollView className="flex-1 bg-black">
        {posts.map((post) => (
          <View key={post.id} className="mb-1">
            {/* Post Header */}
            <View className="flex-row items-center justify-between px-3 py-2">
              <View className="flex-row items-center flex-1">
                <Image
                  source={{ uri: post.userAvatar }}
                  className="w-10 h-10 rounded-full border-2 border-[#7FFF00]"
                />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold text-sm">
                    {post.username}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-gray-400 text-xs" numberOfLines={1}>
                      🎵 {post.music}
                    </Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                onPress={() => toggleFollow(post.id)}
                className={`px-4 py-1.5 rounded-md ${
                  followingUsers.has(post.id) ? 'bg-gray-700' : 'bg-[#7FFF00]'
                }`}
              >
                <Text className={`font-semibold text-sm ${
                  followingUsers.has(post.id) ? 'text-white' : 'text-black'
                }`}>
                  {followingUsers.has(post.id) ? 'Seguindo' : 'Seguir'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Post Image */}
            <Image
              source={{ uri: post.image }}
              className="w-full"
              style={{ height: SCREEN_HEIGHT * 0.6 }}
              resizeMode="cover"
            />

            {/* Post Actions */}
            <View className="flex-row items-center justify-between px-3 py-3">
              <View className="flex-row items-center gap-4">
                <TouchableOpacity 
                  onPress={() => toggleLike(post.id)}
                  className="flex-row items-center"
                >
                  <Heart 
                    size={26} 
                    color={likedPosts.has(post.id) ? '#7FFF00' : '#fff'} 
                    fill={likedPosts.has(post.id) ? '#7FFF00' : 'transparent'}
                  />
                  <Text className="text-white text-sm ml-1 font-medium">
                    {likedPosts.has(post.id) ? post.likes + 1 : post.likes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center">
                  <MessageCircle size={26} color="#fff" />
                  <Text className="text-white text-sm ml-1 font-medium">
                    {post.comments}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center">
                  <Share2 size={24} color="#fff" />
                  <Text className="text-white text-sm ml-1 font-medium">
                    {post.shares}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => toggleSave(post.id)}>
                <Bookmark 
                  size={26} 
                  color={savedPosts.has(post.id) ? '#7FFF00' : '#fff'} 
                  fill={savedPosts.has(post.id) ? '#7FFF00' : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}