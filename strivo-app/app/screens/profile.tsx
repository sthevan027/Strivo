import ShareProfile from '@/src/components/share-profile';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronDown, Clapperboard, Grid3X3, Heart, Menu, MessageCircle, Play, Plus, Repeat2, Send, SquareKanban, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Tipos
interface ProfileData {
  username: string;
  name: string;
  bio: string;
  website: string;
  followers: string;
  following: string;
  posts: string;
  avatar: string;
}

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

const ProfileScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'klips' | 'republicados'>('posts');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasStory, setHasStory] = useState(true);
  const [storyProgress] = useState(new Animated.Value(0));
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [isKlipModalVisible, setIsKlipModalVisible] = useState(false);
  
  // Dados mockados de posts
  const [posts] = useState<Post[]>([
    { id: '1', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=1', image: 'https://picsum.photos/1080/1080?random=1', caption: 'Primeiro post incrível! 🚀', likes: 245, comments: 12 },
    { id: '2', type: 'video', thumbnail: 'https://picsum.photos/400/400?random=2' },
    { id: '3', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=3', image: 'https://picsum.photos/1080/1080?random=3', caption: 'Que dia lindo! ☀️', likes: 189, comments: 8 },
    { id: '4', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=4', image: 'https://picsum.photos/1080/1080?random=4', caption: 'Trabalhando duro 💪', likes: 320, comments: 15 },
    { id: '5', type: 'video', thumbnail: 'https://picsum.photos/400/400?random=5' },
    { id: '6', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=6', image: 'https://picsum.photos/1080/1080?random=6', caption: 'Momento especial ✨', likes: 412, comments: 23 },
    { id: '7', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=7', image: 'https://picsum.photos/1080/1080?random=7', caption: 'Nova conquista! 🏆', likes: 567, comments: 34 },
    { id: '8', type: 'video', thumbnail: 'https://picsum.photos/400/400?random=8' },
    { id: '9', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=9', image: 'https://picsum.photos/1080/1080?random=9', caption: 'Gratidão 🙏', likes: 201, comments: 9 },
  ]);
  
  const [klips] = useState<Post[]>([
    { id: 'k1', type: 'video', thumbnail: 'https://picsum.photos/400/600?random=11', views: 110200 },
    { id: 'k2', type: 'video', thumbnail: 'https://picsum.photos/400/600?random=12', views: 266000 },
    { id: 'k3', type: 'video', thumbnail: 'https://picsum.photos/400/600?random=13', views: 314000 },
    { id: 'k4', type: 'video', thumbnail: 'https://picsum.photos/400/600?random=14', views: 89500 },
    { id: 'k5', type: 'video', thumbnail: 'https://picsum.photos/400/600?random=15', views: 523000 },
    { id: 'k6', type: 'video', thumbnail: 'https://picsum.photos/400/600?random=16', views: 178000 },
  ]);
  
  const [republicados] = useState<Post[]>([
    { id: 'r1', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=21', image: 'https://picsum.photos/1080/1080?random=21', caption: 'Repostado! 🔄', likes: 89, comments: 4 },
    { id: 'r2', type: 'post', thumbnail: 'https://picsum.photos/400/400?random=22', image: 'https://picsum.photos/1080/1080?random=22', caption: 'Compartilhando 📢', likes: 134, comments: 7 },
    { id: 'r3', type: 'video', thumbnail: 'https://picsum.photos/400/400?random=23' },
  ]);

  const [profileData, setProfileData] = useState<ProfileData>({
    username: 'rafafiguei',
    name: 'Rafa Figueiredo',
    bio: 'Criador de Conteúdo na Strivo',
    website: 'www.strivo.com',
    followers: '1,8M',
    following: '103',
    posts: '529',
    avatar: 'https://avatars.githubusercontent.com/u/60237326?v=4',
  });

  const [editForm, setEditForm] = useState<ProfileData>(profileData);

  const handleSave = () => {
    setProfileData(editForm);
    setIsEditModalVisible(false);
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

  // Animação do Story
  useEffect(() => {
    if (isStoryModalVisible) {
      storyProgress.setValue(0);
      Animated.timing(storyProgress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setIsStoryModalVisible(false);
        }
      });
    }
  }, [isStoryModalVisible]);

  const progressWidth = storyProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
   <SafeAreaView edges={['top']}
    className="flex-1 bg-black">
    <View className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-black px-6 py-3 rounded-lg mb-4 flex flex-row w-full justify-between items-end">
          <TouchableOpacity onPress={() => router.push('/screens/profile/metrics')} className='flex flex-row items-start'>
            <Text className='text-white text-3xl font-bold '><SquareKanban color="#fff" className='text-white'/> </Text>
            <ChevronDown color="#fff" size={18} style={{marginTop:6}}/> 
            <View className='bg-red-500 rounded-full p-1 mt-3'/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/screens/configuration')}>
            <Menu size={32} color="#fff"/>
          </TouchableOpacity>
        </View>

        {/* Header com Avatar e Story */}
        <View className="items-center pt-0 pb-6">
          <TouchableOpacity 
            onPress={() => setIsStoryModalVisible(true)}
            className="mb-4"
            activeOpacity={0.7}
          >
            {hasStory ? (
              <LinearGradient
                colors={['#16a34a', '#4ade80', '#d3ef86', '#16a32d']}
                locations={[0, 0.3, 0.7, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 4,
                  borderRadius: 9999,
                  shadowColor: '#22c55e',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 15,
                  elevation: 10,
                }}
              >
                <View style={{ backgroundColor: 'black', borderRadius: 9999, padding: 4 }}>
                  <Image
                    source={{ uri: profileData.avatar }}
                    style={{
                      width: 128,
                      height: 128,
                      borderRadius: 9999,
                      borderWidth: 2,
                      borderColor: 'black',
                    }}
                  />
                </View>
              </LinearGradient>
            ) : (
              <View className="relative">
                <Image source={{ uri: profileData.avatar }} className="w-32 h-32 rounded-full" />
                <View className="absolute bottom-0 right-0 bg-[#00FF40] rounded-full p-2 border-4 border-black">
                  <Plus size={20} color="white" />
                </View>
              </View>
            )}
          </TouchableOpacity>

          <Text className="text-[#ffffff] text-3xl font-bold mb-1">{profileData.name}</Text>
          <Text className="text-gray-400 text-base">{profileData.username}</Text>
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

        {/* Botões de Ação */}
        <View className="flex-row justify-center gap-4 px-6 mb-2">
          <TouchableOpacity
            onPress={() => setIsEditModalVisible(true)}
            className="flex-1 border-2 bg-[#25292e] rounded-xl py-3"
          >
            <Text className="text-[#00FF40] text-center font-semibold text-base">Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} className="flex-1 border-2 bg-[#25292e] rounded-xl py-3">
            <Text className="text-[#00FF40] text-center font-semibold text-base">Compartilhar Perfil</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tabs */}
        <View className="flex-row border-b border-gray-800">
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
            className={`flex-1 py-4 flex-1 flex-row py-4 items-center justify-center ${
              activeTab === 'klips' ? 'border-b-2 border-[#00FF40]' : ''
            }`}
          >
            <Clapperboard size={32} color={activeTab === 'klips' ? '#22c55e' : '#9ca3af'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('republicados')}
            className={`flex-1 py-4 flex-1 flex-row py-4 items-center justify-center ${
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
                    
                    {/* Overlay para Klips */}
                    {activeTab === 'klips' && item.views && (
                      <>
                        {/* Ícone de Play */}
                        <View className="absolute bottom-2 left-2">
                          <Play size={20} color="#fff" fill="#fff" />
                        </View>
                        
                        {/* Views */}
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

      {/* Modal de Edição */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View className="flex-1 bg-black">
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
            enableOnAndroid={true}
          >
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="items-center pt-8 pb-6 mt-6">
                <Text className="text-white text-2xl font-bold mb-6">Editar Perfil</Text>
                <Image source={{ uri: editForm.avatar }} className="w-32 h-32 rounded-full mb-4" />
                <Text className="text-[#fff] text-2xl font-bold">{editForm.username}</Text>
                <Text className="text-gray-400 text-base">{editForm.name}</Text>
              </View>

              <View className="px-6">
                <View className="mb-6">
                  <Text className="text-gray-400 text-sm mb-2">Nome</Text>
                  <TextInput
                    value={editForm.name}
                    onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                    className="bg-[#25292e] text-white rounded-lg px-4 py-3"
                    placeholderTextColor="#666"
                  />
                </View>

                <View className="mb-6">
                  <Text className="text-gray-400 text-sm mb-2">Nome de usuário</Text>
                  <TextInput
                    value={editForm.username}
                    onChangeText={(text) => setEditForm({ ...editForm, username: text })}
                    className="bg-[#25292e] text-white rounded-lg px-4 py-3"
                    placeholderTextColor="#666"
                  />
                </View>

                <View className="mb-6">
                  <Text className="text-gray-400 text-sm mb-2">Biografia</Text>
                  <TextInput
                    value={editForm.bio}
                    onChangeText={(text) => setEditForm({ ...editForm, bio: text })}
                    className="bg-[#25292e] text-white rounded-lg px-4 py-3"
                    placeholderTextColor="#666"
                    multiline
                  />
                </View>

                <TouchableOpacity onPress={handleSave} className="bg-[#00FF40] rounded-lg py-4 mb-4">
                  <Text className="text-white text-center font-semibold text-base">Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setEditForm(profileData);
                    setIsEditModalVisible(false);
                  }}
                  className="mb-8"
                >
                  <Text className="text-gray-400 text-center text-base">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      </Modal>

      {/* Modal do Story */}
      <Modal
        visible={isStoryModalVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setIsStoryModalVisible(false)}
      >
        <View className="flex-1 bg-black">
          <View className="absolute top-12 left-4 right-4 z-10">
            <View className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <Animated.View className="h-full bg-white rounded-full" style={{ width: progressWidth }} />
            </View>
          </View>

          <View className="absolute top-16 left-4 right-4 z-10 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <LinearGradient
                colors={['#16a34a', '#4ade80', '#d3ef86', '#16a32d']}
                locations={[0, 0.3, 0.7, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 2, borderRadius: 9999 }}
              >
                <View className="rounded-full p-0.5 bg-black">
                  <Image source={{ uri: profileData.avatar }} className="w-10 h-10 rounded-full" />
                </View>
              </LinearGradient>
              <View className="ml-3">
                <Text className="text-white font-semibold">{profileData.username}</Text>
                <Text className="text-gray-400 text-xs">2h atrás</Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => setIsStoryModalVisible(false)}
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 20,
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text className="text-white text-xl">✕</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-center items-center">
            <Image source={{ uri: profileData.avatar }} className="w-full h-full" resizeMode="cover" />
          </View>

          <TouchableOpacity 
            className="absolute inset-0"
            activeOpacity={1}
            onPress={() => setIsStoryModalVisible(false)}
          />
        </View>
      </Modal>

      {/* Modal de Post (estilo Feed) */}
      <Modal
        visible={isPostModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsPostModalVisible(false)}
      >
        <View className="flex-1 bg-black">
          <SafeAreaView className="flex-1">
            {/* Header */}
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
              {/* Imagem do Post */}
              <Image
                source={{ uri: selectedPost?.image }}
                style={{ width, height: width }}
                resizeMode="cover"
              />

              {/* Ações */}
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

              {/* Likes */}
              <Text className="text-white font-semibold px-4 mb-2">
                {selectedPost?.likes} curtidas
              </Text>

              {/* Caption */}
              <View className="px-4 mb-4">
                <Text className="text-white">
                  <Text className="font-semibold">{profileData.username}</Text>
                  <Text className="text-gray-300"> {selectedPost?.caption}</Text>
                </Text>
              </View>

              {/* Comentários mockados */}
              <TouchableOpacity className="px-4 mb-2">
                <Text className="text-gray-400">Ver todos os {selectedPost?.comments} comentários</Text>
              </TouchableOpacity>

              <View className="px-4 mb-3">
                <View className="flex-row items-start mb-3">
                  <Image source={{ uri: 'https://i.pravatar.cc/150?img=1' }} className="w-8 h-8 rounded-full mr-3" />
                  <View className="flex-1">
                    <Text className="text-white">
                      <Text className="font-semibold">user123</Text>
                      <Text className="text-gray-300"> Que foto incrível! 😍</Text>
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-start mb-3">
                  <Image source={{ uri: 'https://i.pravatar.cc/150?img=2' }} className="w-8 h-8 rounded-full mr-3" />
                  <View className="flex-1">
                    <Text className="text-white">
                      <Text className="font-semibold">maria_silva</Text>
                      <Text className="text-gray-300"> Adorei! 🔥</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <Text className="text-gray-500 text-xs px-4 mb-6">há 3 horas</Text>
            </ScrollView>

            {/* Input de Comentário */}
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

      {/* Modal de Klip (player de vídeo vertical) */}
      <Modal
        visible={isKlipModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsKlipModalVisible(false)}
      >
        <View className="flex-1 bg-black">
          <SafeAreaView className="flex-1">
            {/* Header */}
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

            {/* Vídeo (mockado com imagem) */}
            <Image
              source={{ uri: selectedPost?.thumbnail }}
              className="w-full h-full"
              resizeMode="cover"
            />

            {/* Botões laterais */}
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

            {/* Descrição */}
            <View className="absolute bottom-20 left-4 right-20">
              <Text className="text-white font-semibold mb-2">{profileData.username}</Text>
              <Text className="text-white">Vídeo incrível! 🎥 #klip #strivo</Text>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      <ShareProfile profileUrl='https://teste.com' visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
   </SafeAreaView>
  );
};

export default ProfileScreen;