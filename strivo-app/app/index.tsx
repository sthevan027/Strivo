// App.tsx
import CreateModal from '@/src/components/create-post';
import FeedOptions from '@/src/components/feed-options';
import ShareModal from '@/src/components/share-modal';
import { recentContacts } from '@/src/utils/contact-mock';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, Bookmark, Heart, MessageCircle, MessageSquareMoreIcon, Plus, Share2 } from 'lucide-react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCreateVisible, setModalCreateVisible] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const router = useRouter();
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
        <Text className="text-[#00FF40] text-3xl font-bold">Strivo</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => setModalCreateVisible(true)}>
            <Plus size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.push('/screens/notifications')}>
            <Bell size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity className="relative" onPress={() => navigation.push('/screens/chat/message-screen')}>
            <MessageSquareMoreIcon size={28} color="#fff" />
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
              {story.isUser ? (
                <LinearGradient
                  colors={['#16a34a', '#4ade80', '#d3ef86', '#16a32d']}
                  locations={[0, 0.3, 0.7, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    padding: 3,
                    borderRadius: 9999,
                    shadowColor: '#22c55e',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 15,
                    elevation: 10,
                  }}
                >
                  <View style={{ 
                    backgroundColor: 'black', 
                    borderRadius: 9999, 
                    padding: 3 
                  }}>
                    <View className="relative">
                      <Image
                        source={{ uri: story.avatar }}
                        className="w-20 h-20 rounded-full"
                        style={{ borderWidth: 2, borderColor: 'black' }}
                      />

                    </View>
                  </View>
                </LinearGradient>
              ) : (
                <View className="border-2 border-gray-700 rounded-full p-0.5">
                  <Image
                    source={{ uri: story.avatar }}
                    className="w-20 h-20 rounded-full"
                  />
                </View>
              )}
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
                <LinearGradient
                  colors={['#16a34a', '#4ade80', '#d3ef86', '#16a32d']}
                  locations={[0, 0.3, 0.7, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    padding: 2,
                    borderRadius: 9999,
                    shadowColor: '#22c55e',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 10,
                    elevation: 8,
                  }}
                >
                  <View style={{ 
                    backgroundColor: 'black', 
                    borderRadius: 9999, 
                    padding: 2 
                  }}>
                    <Image
                      source={{ uri: post.userAvatar }}
                      className="w-10 h-10 rounded-full"
                      style={{ borderWidth: 2, borderColor: 'black' }}
                    />
                  </View>
                </LinearGradient>
                
                <TouchableOpacity onPress={() => navigation.push('/screens/profile/other-user-profile')} className="ml-3 flex-1">
                  <Text className="text-white font-semibold text-sm">
                    {post.username}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-gray-400 text-xs" numberOfLines={1}>
                      Rafael Figueiredo
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                className='flex items-start justify-start text-start'
              >
               <Text className='text-white text-4xl mt-[-6px]'>...</Text>
              </TouchableOpacity>
            </View>

            {/* Post Image */}
            <Image
              source={{ uri: post.image }}
              style={{
                width: '100%',
                aspectRatio: 4/5,
              }}
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
                    color={likedPosts.has(post.id) ? '#00FF40' : '#fff'} 
                    fill={likedPosts.has(post.id) ? '#00FF40' : 'transparent'}
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

                <TouchableOpacity onPress={() => setShowShare(true)} className="flex-row items-center">
                  <Share2 size={24} color="#fff" />
                  <Text className="text-white text-sm ml-1 font-medium">
                    {post.shares}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => toggleSave(post.id)}>
                <Bookmark 
                  size={26} 
                  color={savedPosts.has(post.id) ? '#00FF40' : '#fff'} 
                  fill={savedPosts.has(post.id) ? '#00FF40' : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <FeedOptions visible={modalVisible} onClose={() => setModalVisible(false)} />
        <CreateModal visible={modalCreateVisible} onClose={() => setModalCreateVisible(false)} />
      </ScrollView>
      <ShareModal
      visible={showShare}
      onClose={() => setShowShare(false)}
      recentContacts={recentContacts}
    />
    </SafeAreaView>
  );
}