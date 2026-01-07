import {
  Camera,
  Heart,
  MessageCircle,
  MoreVertical,
  Share2,
  ThumbsDown,
  Volume2,
  VolumeX,
  X
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import ReelsOptions from '@/src/components/reel-options';
import ShareModal from '@/src/components/share-modal';
import { recentContacts } from '@/src/utils/contact-mock';
import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  image?: string;
  likes: number;
  dislikes: number;
  timeAgo: string;
  replies?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  likedByCreator?: boolean;
}

interface Klip {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  videoUrl: string;
  thumbnail: string;
  likes: number;
  comments: number;
  shares: number;
  description: string;
  isLiked?: boolean;
  isFollowing?: boolean;
}

const KlipsScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(Video | null)[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCommentInputFocused, setIsCommentInputFocused] = useState(false);
  const [reelsOptionsVisible, setReelsOptionsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMuteIcon, setShowMuteIcon] = useState(false);
  const muteIconTimeout = useRef<NodeJS.Timeout | null>(null);
  const muteIconOpacity = useRef(new Animated.Value(0)).current;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [klips, setKlips] = useState<Klip[]>([
    {
      id: '1',
      user: {
        name: 'Enrico Delafio',
        username: 'enrico.delafio',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://i.pravatar.cc/400?img=12',
      likes: 53200,
      comments: 307,
      shares: 5848,
      description: 'Se você fizer isso pode ter certeza que vai dar certo! 🔥',
      isLiked: false,
      isFollowing: false,
    },
    {
      id: '2',
      user: {
        name: 'Maria Silva',
        username: 'maria.silva',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: 'https://i.pravatar.cc/400?img=5',
      likes: 42100,
      comments: 189,
      shares: 3421,
      description: 'Momento incrível capturado em câmera lenta! 🎥✨',
      isLiked: false,
      isFollowing: false,
    },
    {
      id: '3',
      user: {
        name: 'João Pedro',
        username: 'joao.pedro',
        avatar: 'https://i.pravatar.cc/150?img=8',
      },
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      thumbnail: 'https://i.pravatar.cc/400?img=8',
      likes: 67800,
      comments: 521,
      shares: 7234,
      description: 'Essa é a melhor dica que você vai ver hoje! 💡',
      isLiked: false,
      isFollowing: false,
    },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: {
        name: 'Gabriel',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      text: 'tadinha da Índia🇮🇳\nkkkkkkkkkkkkkkkkkkkk',
      likes: 412,
      dislikes: 5,
      timeAgo: '3d',
      replies: 4,
      isLiked: false,
      isDisliked: false,
      likedByCreator: true,
    },
    {
      id: '2',
      user: {
        name: 'moreira44',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      text: 'namoral que ainda jogam isso',
      likes: 519,
      dislikes: 23,
      timeAgo: '3d',
      isLiked: false,
      isDisliked: false,
      likedByCreator: false,
    },
    {
      id: '3',
      user: {
        name: 'Tropa da Bélgica',
        avatar: 'https://i.pravatar.cc/150?img=7',
      },
      text: '800 players diários',
      likes: 12,
      dislikes: 2,
      timeAgo: '2d',
      replies: 2,
      isLiked: false,
      isDisliked: false,
      likedByCreator: false,
    },
    {
      id: '4',
      user: {
        name: 'Ana Costa',
        avatar: 'https://i.pravatar.cc/150?img=9',
      },
      text: 'Muito bom! Adorei o conteúdo 😍',
      image: 'https://picsum.photos/400/300',
      likes: 234,
      dislikes: 3,
      timeAgo: '1d',
      isLiked: false,
      isDisliked: false,
      likedByCreator: false,
    },
  ]);


  const activeKlip = klips[currentIndex];

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowMuteIcon(true);

    // Anima a entrada do ícone
    Animated.sequence([
      Animated.timing(muteIconOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(800),
      Animated.timing(muteIconOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowMuteIcon(false);
    });

    // Limpa timeout anterior se existir
    if (muteIconTimeout.current) {
      clearTimeout(muteIconTimeout.current);
    }
  };

  const toggleLike = () => {
    setKlips(
      klips.map((klip, index) =>
        index === currentIndex
          ? {
              ...klip,
              isLiked: !klip.isLiked,
              likes: klip.isLiked ? klip.likes - 1 : klip.likes + 1,
            }
          : klip
      )
    );
  };

  const toggleFollow = () => {
    setKlips(
      klips.map((klip, index) =>
        index === currentIndex
          ? { ...klip, isFollowing: !klip.isFollowing }
          : klip
      )
    );
  };

  const toggleCommentLike = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              isDisliked: false,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes,
            }
          : comment
      )
    );
  };

  const toggleCommentDislike = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isDisliked: !comment.isDisliked,
              isLiked: false,
              dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes + 1,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes,
            }
          : comment
      )
    );
  };

  const handleAddComment = () => {
    if (commentText.trim() || selectedImage) {
      const newComment: Comment = {
        id: String(comments.length + 1),
        user: {
          name: 'Você',
          avatar: 'https://i.pravatar.cc/150?img=20',
        },
        text: commentText,
        image: selectedImage || undefined,
        likes: 0,
        dislikes: 0,
        timeAgo: 'agora',
        isLiked: false,
        isDisliked: false,
        likedByCreator: false,
      };
      setComments([newComment, ...comments]);
      setCommentText('');
      setSelectedImage(null);
      
      setKlips(
        klips.map((klip, index) =>
          index === currentIndex
            ? { ...klip, comments: klip.comments + 1 }
            : klip
        )
      );
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}mil`;
    }
    return num.toString();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  useEffect(() => {
  const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  });
  const hideSub = Keyboard.addListener("keyboardDidHide", () => {
    setKeyboardHeight(0);
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);


  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={{ uri: item.user.avatar }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          {/* Nome e tempo */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>
              {item.user.name}
            </Text>
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#6B7280', marginHorizontal: 6 }} />
            <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
              {item.timeAgo}
            </Text>
          </View>

          {/* Texto do comentário */}
          <Text style={{ color: 'white', fontSize: 14, marginBottom: 8, lineHeight: 20 }}>
            {item.text}
          </Text>

          {/* Imagem do comentário (se tiver) */}
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={{ 
                width: '100%', 
                height: 200, 
                borderRadius: 8,
                marginBottom: 8 
              }}
              resizeMode="cover"
            />
          )}

          {/* Botões de ação */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            {/* Like */}
            <TouchableOpacity
              onPress={() => toggleCommentLike(item.id)}
              style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
            >
              <Heart
                size={14}
                color={item.isLiked ? '#00FF40' : '#9CA3AF'}
                fill={item.isLiked ? '#00FF40' : 'none'}
                strokeWidth={2}
              />
              {item.likes > 0 && (
                <Text style={{ color: '#9CA3AF', fontSize: 12, marginLeft: 6 }}>
                  {item.likes}
                </Text>
              )}
            </TouchableOpacity>

            {/* Dislike */}
            <TouchableOpacity
              onPress={() => toggleCommentDislike(item.id)}
              style={{ marginRight: 16 }}
            >
              <ThumbsDown
                size={14}
                color={item.isDisliked ? '#00FF40' : '#9CA3AF'}
                fill={item.isDisliked ? '#00FF40' : 'none'}
                strokeWidth={2}
              />
            </TouchableOpacity>

            {/* Responder */}
            <TouchableOpacity style={{ marginRight: 8 }}>
              <Text style={{ color: '#9CA3AF', fontSize: 12, fontWeight: '600' }}>
                Responder
              </Text>
            </TouchableOpacity>

            {/* Curtido pelo criador */}
            {item.likedByCreator && (
              <>
                <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#6B7280', marginHorizontal: 8 }} />
                <Heart size={12} color="#00FF40" fill="#00FF40" />
                <Text style={{ color: '#9CA3AF', fontSize: 11, marginLeft: 4 }}>
                  Curtido pelo criador
                </Text>
              </>
            )}
          </View>

          {/* Ver respostas */}
          {item.replies && item.replies > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#6B7280', marginRight: 8 }} />
              <TouchableOpacity>
                <Text style={{ color: '#4B9EFF', fontSize: 12, fontWeight: '600' }}>
                  Exibir {item.replies} {item.replies === 1 ? 'resposta' : 'respostas'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderKlip = ({ item, index }: { item: Klip; index: number }) => (
    <View style={{ height: SCREEN_HEIGHT, width: '100%', backgroundColor: 'black' }}>
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={toggleMute}
        style={{ width: '100%', height: '100%' }}
      >
        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={{ uri: item.videoUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={index === currentIndex}
          isLooping
          isMuted={isMuted}
        />
      </TouchableOpacity>

      {/* Mute Icon */}
      {showMuteIcon && (
        <Animated.View
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [
              { translateX: -40 },
              { translateY: -40 },
            ],
            opacity: muteIconOpacity,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isMuted ? (
              <VolumeX size={40} color="#fff" strokeWidth={2} />
            ) : (
              <Volume2 size={40} color="#fff" strokeWidth={2} />
            )}
          </View>
        </Animated.View>
      )}

      {/* Top Bar */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 50,
          paddingBottom: 16,
        }}
      >
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Klips</Text>
        <TouchableOpacity onPress={() => setReelsOptionsVisible(true)}>
          <MoreVertical size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Right Side Actions */}
      <View
        style={{
          position: 'absolute',
          right: 12,
          bottom: 180,
          alignItems: 'center',
        }}
      >
        {/* User Avatar + Follow */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          {/* Gradiente envolvendo a imagem */}
          <LinearGradient
            colors={['#16a34a', '#4ade80', '#d3ef86', '#16a32d']}
            locations={[0, 0.3, 0.7, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 3,
              borderRadius: 30,
              shadowColor: '#22c55e',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <Image
              source={{ uri: item.user.avatar }}
              style={{ 
                width: 56, 
                height: 56, 
                borderRadius: 28, 
                borderWidth: 3, 
                borderColor: 'black'
              }}
            />
          </LinearGradient>
          
          {/* Botão de seguir */}
          {!item.isFollowing && (
            <TouchableOpacity
              onPress={toggleFollow}
              style={{
                position: 'absolute',
                bottom: -8,
                borderRadius: 12,
                width: 24,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
            </TouchableOpacity>
          )}
        </View>

        {/* Like */}
        <TouchableOpacity onPress={toggleLike} style={{ alignItems: 'center', marginBottom: 24 }}>
          <Heart
            size={32}
            color={item.isLiked ? '#00FF40' : '#fff'}
            fill={item.isLiked ? '#00FF40' : 'none'}
            strokeWidth={1.5}
          />
          <Text style={{ color: 'white', fontSize: 13, fontWeight: '500', marginTop: 4 }}>
            {formatNumber(item.likes)}
          </Text>
        </TouchableOpacity>

        {/* Comments */}
        <TouchableOpacity
          onPress={() => setShowComments(true)}
          style={{ alignItems: 'center', marginBottom: 24 }}
        >
          <MessageCircle size={32} color="#fff" strokeWidth={1.5} />
          <Text style={{ color: 'white', fontSize: 13, fontWeight: '500', marginTop: 4 }}>
            {item.comments}
          </Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity onPress={() => setShowShare(true)} style={{ alignItems: 'center' }}>
          <Share2 size={32} color="#fff" strokeWidth={1.5} />
          <Text style={{ color: 'white', fontSize: 13, fontWeight: '500', marginTop: 4 }}>
            {formatNumber(item.shares)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Info */}
      <LinearGradient
        colors={['transparent', 'black']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginRight: 12 }}>
            @{item.user.username}
          </Text>
          {!item.isFollowing && (
            <TouchableOpacity
              onPress={toggleFollow}
              style={{
                backgroundColor: '#00FF40',
                paddingHorizontal: 20,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: 'black', fontWeight: '600', fontSize: 14 }}>Seguir</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ color: 'white', fontSize: 14 }} numberOfLines={2}>
          {item.description}
        </Text>
      </LinearGradient>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'black', marginBottom:0}} >
      <StatusBar style="light" />
      <FlatList
        data={klips}
        renderItem={renderKlip}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Comments Modal */}
      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        onRequestClose={() => setShowComments(false)}
        transparent={true}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
            setShowComments(false);
          }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View
            style={{
              backgroundColor: '#1F1F1F',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              height: SCREEN_HEIGHT * 0.65,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                borderBottomWidth: 0.5,
                borderBottomColor: '#2a2a2a',
                position: 'relative',
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 4,
                  backgroundColor: '#3a3a3a',
                  borderRadius: 2,
                  position: 'absolute',
                  top: 8,
                }}
              />
              <Text style={{ color: '#A0A0A0', fontWeight: '600', fontSize: 15, marginTop: 12 }}>
                Comentários
              </Text>
            </View>

            {/* Comments List */}
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            />

            {/* Preview da imagem selecionada */}
            {selectedImage && (
              <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, backgroundColor: '#1F1F1F' }}>
                <View style={{ position: 'relative', width: 80 }}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: 80, height: 80, borderRadius: 8 }}
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      backgroundColor: '#000',
                      borderRadius: 12,
                      padding: 4,
                    }}
                  >
                    <X size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Comment Input */}
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                paddingBottom: Platform.OS === 'ios' ? 10 : 10,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#1F1F1F',
                borderTopWidth: 0.5,
                borderTopColor: '#2a2a2a',
              }}
            >
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=20' }}
                style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }}
              />

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#2a2a2a',
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: '#3a3a3a',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                }}
              >
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Comente..."
                  placeholderTextColor="#6B7280"
                  style={{
                    flex: 1,
                    color: 'white',
                    fontSize: 14,
                    paddingVertical: 0,
                  }}
                  onFocus={() => setIsCommentInputFocused(true)}
                  onBlur={() => setIsCommentInputFocused(false)}
                  onSubmitEditing={handleAddComment}
                  multiline={false}
                />

                <TouchableOpacity
                  style={{ marginLeft: 8 }}
                  onPress={() => setSelectedImage('https://picsum.photos/400/300')}
                >
                  <Camera size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {(commentText.trim() || selectedImage) && (
                <TouchableOpacity
                  onPress={handleAddComment}
                  style={{
                    marginLeft: 10,
                  }}
                >
                  <Text style={{ color: '#00FF40', fontWeight: '600', fontSize: 15 }}>
                    Enviar
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Share Modal */}
      <ShareModal
        visible={showShare}
        onClose={() => setShowShare(false)}
        recentContacts={recentContacts}
      />
      <ReelsOptions visible={reelsOptionsVisible} onClose={() => setReelsOptionsVisible(false)} />
    </View>
  );
};

export default KlipsScreen;