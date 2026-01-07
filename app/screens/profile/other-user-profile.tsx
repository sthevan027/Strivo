import { useRouter } from 'expo-router';
import { ArrowLeft, Clapperboard, Grid3X3, Heart, MessageCircle, MoreVertical, Play, Repeat2, Send, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Post {
  id: string;
  type: 'post' | 'video';
  thumbnail: string;
  image?: string;
  caption?: string;
  likes?: number;
  comments?: number;
  views?: number;
}

const UserProfileScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'klips' | 'republicados'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [isKlipModalVisible, setIsKlipModalVisible] = useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  
  const [posts] = useState<Post[]>([
    { id: '1', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=1', image: 'https://picsum.photos/1080/1080?random=1', caption: 'Primeiro post incrível! 🚀', likes: 245, comments: 12 },
    { id: '2', type: 'video', thumbnail: 'https://picsum.photos/400/400?random=2' },
    { id: '3', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=3', image: 'https://picsum.photos/1080/1080?random=3', caption: 'Que dia lindo! ☀️', likes: 189, comments: 8 },
    { id: '4', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=4', image: 'https://picsum.photos/1080/1080?random=4', caption: 'Trabalhando duro 💪', likes: 320, comments: 15 },
    { id: '5', type: 'video', thumbnail: 'https://picsum.photos/400/400?random=5' },
    { id: '6', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=6', image: 'https://picsum.photos/1080/1080?random=6', caption: 'Momento especial ✨', likes: 412, comments: 23 },
  ]);
  
  const [klips] = useState<Post[]>([
    { id: 'k1', type: 'video', thumbnail: 'https://picsum.photos/400/600?random=11', views: 110200 },
    { id: 'k2', type: 'video', thumbnail: 'https://picsum.photos/400/600?random=12', views: 266000 },
    { id: 'k3', type: 'video', thumbnail: 'https://picsum.photos/400/600?random=13', views: 314000 },
  ]);
  
  const [republicados] = useState<Post[]>([
    { id: 'r1', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=21', image: 'https://picsum.photos/1080/1080?random=21', caption: 'Repostado! 🔄', likes: 89, comments: 4 },
    { id: 'r2', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=22', image: 'https://picsum.photos/1080/1080?random=22', caption: 'Compartilhando 📢', likes: 134, comments: 7 },
  ]);

  const profileData = {
    username: 'maria_silva',
    name: 'Maria Silva',
    bio: 'Fotógrafa | Criadora de Conteúdo ✨',
    followers: '856K',
    following: '234',
    posts: '342',
    avatar: 'https://i.pravatar.cc/400?img=5',
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    if (post.type === 'post') {
      setIsPostModalVisible(true);
    } else {
      setIsKlipModalVisible(true);
    }
  };

  const formatViews = (views?: number) => {
    if (!views) return '0';
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'posts':
        return posts;
      case 'klips':
        return klips;
      case 'republicados':
        return republicados;
      default:
        return [];
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
      <View className="flex-1 bg-black">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header com seta e opções */}
          <View className="bg-black px-6 py-3 rounded-lg mb-4 flex flex-row w-full justify-between items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color="#fff" size={28} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsOptionsModalVisible(true)}>
              <MoreVertical color="#fff" size={28} />
            </TouchableOpacity>
          </View>

          {/* Avatar e Info */}
          <View className="items-center pt-0 pb-6">
            <View className="mb-4">
              <Image
                source={{ uri: profileData.avatar }}
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 9999,
                }}
              />
            </View>

            <Text className="text-[#ffffff] text-3xl font-bold mb-1">{profileData.name}</Text>
            <Text className="text-gray-400 text-base mb-3">{profileData.username}</Text>
            <Text className="text-gray-300 text-center px-6 mb-4">{profileData.bio}</Text>
          </View>

          {/* Stats */}
          <View className="flex-row justify-around px-6 mb-6">
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">{profileData.followers}</Text>
              <Text className="text-gray-400 text-sm">Seguidores</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">{profileData.following}</Text>
              <Text className="text-gray-400 text-sm">Seguindo</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">{profileData.posts}</Text>
              <Text className="text-gray-400 text-sm">Posts</Text>
            </View>
          </View>

          {/* Botão de Seguir */}
          <View className="flex-row justify-center px-6 mb-2">
            <TouchableOpacity
              onPress={() => setIsFollowing(!isFollowing)}
              className={`flex-1 rounded-xl py-3 ${isFollowing ? 'bg-[#25292e] border-2 border-gray-700' : 'bg-[#00FF40]'}`}
            >
              <Text className={`text-center font-semibold text-base ${isFollowing ? 'text-white' : 'text-black'}`}>
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Tabs */}
          <View className="flex-row border-b border-gray-800 mt-4">
            <TouchableOpacity
              onPress={() => setActiveTab('posts')}
              className={`flex-1 flex-row py-4 items-center justify-center ${
                activeTab === 'posts' ? 'border-b-2 border-[#00FF40]' : ''
              }`}
            >
              <Grid3X3 size={32} color={activeTab === 'posts' ? '#22c55e' : '#9ca3af'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('klips')}
              className={`flex-1 py-4 flex-row items-center justify-center ${
                activeTab === 'klips' ? 'border-b-2 border-[#00FF40]' : ''
              }`}
            >
              <Clapperboard size={32} color={activeTab === 'klips' ? '#22c55e' : '#9ca3af'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('republicados')}
              className={`flex-1 py-4 flex-row items-center justify-center ${
                activeTab === 'republicados' ? 'border-b-2 border-[#00FF40]' : ''
              }`}
            >
              <Repeat2 size={32} color={activeTab === 'republicados' ? '#22c55e' : '#9ca3af'} />
            </TouchableOpacity>
          </View>

          {/* Content Grid */}
          <View className="px-0 pb-6">
            {getCurrentContent().length > 0 ? (
              <View className="flex-row flex-wrap">
                {getCurrentContent().map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handlePostClick(item)}
                    className="w-1/3 p-0.5"
                    activeOpacity={0.7}
                    style={activeTab === 'klips' ? { aspectRatio: 9/16 } : { aspectRatio: 1 }}
                  >
                    <View className="relative w-full h-full">
                      <Image
                        source={{ uri: item.thumbnail }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      
                      {activeTab === 'klips' && item.views && (
                        <>
                          <View className="absolute bottom-2 left-2">
                            <Play size={20} color="#fff" fill="#fff" />
                          </View>
                          <View className="absolute bottom-2 right-2">
                            <Text className="text-white font-bold text-xs drop-shadow-lg" style={{ textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                              {formatViews(item.views)}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text className="text-gray-400 text-center py-12">Nenhum conteúdo disponível</Text>
            )}
          </View>
        </ScrollView>

        {/* Modal de Opções */}
        <Modal
          visible={isOptionsModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsOptionsModalVisible(false)}
        >
          <TouchableOpacity 
            className="flex-1 bg-black/70"
            activeOpacity={1}
            onPress={() => setIsOptionsModalVisible(false)}
          >
            <SafeAreaView className="flex-1 justify-end">
              <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                <View className="bg-[#1a1a1a] rounded-t-3xl">
                  <View className="items-center py-3 border-b border-gray-800">
                    <View className="w-12 h-1 bg-gray-600 rounded-full" />
                  </View>
                  
                  <TouchableOpacity 
                    className="flex-row items-center px-6 py-4 border-b border-gray-800"
                    onPress={() => {
                      setIsOptionsModalVisible(false);
                      // Lógica para denunciar
                    }}
                  >
                    <Text className="text-red-500 text-base font-semibold">Denunciar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="flex-row items-center px-6 py-4 border-b border-gray-800"
                    onPress={() => {
                      setIsOptionsModalVisible(false);
                      // Lógica para bloquear
                    }}
                  >
                    <Text className="text-red-500 text-base font-semibold">Bloquear</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="flex-row items-center px-6 py-5"
                    onPress={() => setIsOptionsModalVisible(false)}
                  >
                    <Text className="text-white text-base">Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </SafeAreaView>
          </TouchableOpacity>
        </Modal>

        {/* Modal de Post */}
        <Modal
          visible={isPostModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setIsPostModalVisible(false)}
        >
          <View className="flex-1 bg-black">
            <SafeAreaView className="flex-1">
              <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
                <View className="flex-row items-center flex-1">
                  <Image source={{ uri: profileData.avatar }} className="w-10 h-10 rounded-full" />
                  <Text className="text-white font-semibold ml-3">{profileData.username}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsPostModalVisible(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: selectedPost?.image }}
                  style={{ width, height: width }}
                  resizeMode="cover"
                />

                <View className="flex-row items-center justify-between px-4 py-3">
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity>
                      <Heart size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <MessageCircle size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Send size={28} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text className="text-white font-semibold px-4 mb-2">
                  {selectedPost?.likes} curtidas
                </Text>

                <View className="px-4 mb-4">
                  <Text className="text-white">
                    <Text className="font-semibold">{profileData.username}</Text>
                    <Text className="text-gray-300"> {selectedPost?.caption}</Text>
                  </Text>
                </View>

                <TouchableOpacity className="px-4 mb-2">
                  <Text className="text-gray-400">Ver todos os {selectedPost?.comments} comentários</Text>
                </TouchableOpacity>

                <Text className="text-gray-500 text-xs px-4 mb-6">há 3 horas</Text>
              </ScrollView>

              <View className="border-t border-gray-800 px-4 py-3 flex-row items-center">
                <Image source={{ uri: profileData.avatar }} className="w-8 h-8 rounded-full mr-3" />
                <TextInput
                  placeholder="Adicione um comentário..."
                  placeholderTextColor="#666"
                  className="flex-1 text-white"
                />
                <TouchableOpacity>
                  <Text className="text-[#00FF40] font-semibold">Publicar</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </Modal>

        {/* Modal de Klip */}
        <Modal
          visible={isKlipModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setIsKlipModalVisible(false)}
        >
          <View className="flex-1 bg-black">
            <SafeAreaView className="flex-1">
              <View className="absolute top-12 left-4 right-4 z-10 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image source={{ uri: profileData.avatar }} className="w-10 h-10 rounded-full mr-3" />
                  <Text className="text-white font-semibold">{profileData.username}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setIsKlipModalVisible(false)}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 20,
                    width: 36,
                    height: 36,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <Image
                source={{ uri: selectedPost?.thumbnail }}
                className="w-full h-full"
                resizeMode="cover"
              />

              <View className="absolute right-4 bottom-32 gap-6">
                <TouchableOpacity className="items-center">
                  <Heart size={32} color="#fff" />
                  <Text className="text-white text-xs mt-1">124K</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                  <MessageCircle size={32} color="#fff" />
                  <Text className="text-white text-xs mt-1">2.3K</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                  <Send size={32} color="#fff" />
                  <Text className="text-white text-xs mt-1">Share</Text>
                </TouchableOpacity>
              </View>

              <View className="absolute bottom-20 left-4 right-20">
                <Text className="text-white font-semibold mb-2">{profileData.username}</Text>
                <Text className="text-white">Vídeo incrível! 🎥 #klip #strivo</Text>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default UserProfileScreen;