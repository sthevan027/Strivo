import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Check, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { loadProfileData, saveProfileData, ProfileData } from '@/src/utils/profileStorage';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Estilo para campos de texto (especialmente para web)
const textInputStyle = Platform.OS === 'web' ? { 
  caretColor: '#00FF40',
  outlineColor: '#00FF40',
} : {};

interface ProfileForm {
  username: string;
  fullname: string;
  bio: string;
  email: string;
  youtube: string;
  twitch: string;
  instagram: string;
  twitter: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  );
  const [isCropModalVisible, setIsCropModalVisible] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para crop
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState(0);
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  const lastPanPosition = useRef({ x: 0, y: 0 });

  // Animações
  const lineScale = useRef(new Animated.Value(0)).current;
  const notificationScale = useRef(new Animated.Value(0)).current;
  const notificationOpacity = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState<ProfileForm>({
    username: 'strivo',
    fullname: 'Strivo Creator',
    bio: 'Connecting creators',
    email: 'contato@strivo.com',
    youtube: '',
    twitch: '',
    instagram: '',
    twitter: '',
  });

  // Carregar dados do perfil quando a tela abrir
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await loadProfileData();
        setForm({
          username: profileData.username || 'strivo',
          fullname: profileData.name || 'Strivo Creator',
          bio: profileData.bio || 'Connecting creators',
          email: profileData.email || 'contato@strivo.com',
          youtube: profileData.youtube || '',
          twitch: profileData.twitch || '',
          instagram: profileData.instagram || '',
          twitter: profileData.twitter || '',
        });
        if (profileData.avatar) {
          setProfileImage(profileData.avatar);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Animação da linha do header
  const handleHeaderHover = (isHover: boolean) => {
    Animated.timing(lineScale, {
      toValue: isHover ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // PanResponder para drag da imagem no crop
  const imagePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Salvar posição inicial
        lastPanPosition.current = { ...imagePosition };
      },
      onPanResponderMove: (evt, gestureState) => {
        const newX = lastPanPosition.current.x + gestureState.dx;
        const newY = lastPanPosition.current.y + gestureState.dy;
        
        // Limitar movimento dentro dos bounds
        const maxMove = (containerSize * 0.8 * zoom - containerSize * 0.8) / 2;
        setImagePosition({
          x: Math.max(-maxMove, Math.min(maxMove, newX)),
          y: Math.max(-maxMove, Math.min(maxMove, newY)),
        });
      },
      onPanResponderRelease: () => {
        // Atualizar posição de referência
        lastPanPosition.current = { ...imagePosition };
      },
    })
  ).current;

  // PanResponder para slider de zoom
  const sliderStartX = useRef(0);
  const sliderStartZoom = useRef(1);
  const sliderWidthRef = useRef(0);
  
  const sliderPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const sliderWidth = containerSize || SCREEN_WIDTH - 80;
        sliderWidthRef.current = sliderWidth;
        const touchX = evt.nativeEvent.locationX;
        sliderStartX.current = touchX;
        sliderStartZoom.current = zoom;
        
        // Atualizar zoom baseado na posição inicial do toque
        const percentage = Math.max(0, Math.min(1, touchX / sliderWidth));
        const newZoom = 0.5 + percentage * 2.5;
        setZoom(newZoom);
      },
      onPanResponderMove: (evt, gestureState) => {
        const sliderWidth = sliderWidthRef.current;
        if (sliderWidth === 0) return;
        
        // Calcular nova posição baseada no movimento relativo
        const newX = sliderStartX.current + gestureState.dx;
        const percentage = Math.max(0, Math.min(1, newX / sliderWidth));
        const newZoom = 0.5 + percentage * 2.5;
        setZoom(newZoom);
      },
      onPanResponderRelease: () => {
        // Manter o zoom atual
      },
    })
  ).current;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showNotification('Erro', 'Permissão para acessar a galeria é necessária', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageUri(result.assets[0].uri);
      setZoom(1);
      setImagePosition({ x: 0, y: 0 });
      lastPanPosition.current = { x: 0, y: 0 };
      setIsCropModalVisible(true);
      
      // Obter dimensões da imagem
      Image.getSize(result.assets[0].uri, (width, height) => {
        setImageNaturalSize({ width, height });
      });
    }
  };

  const applyCrop = async () => {
    if (!selectedImageUri) return;

    try {
      // Aplicar a imagem selecionada diretamente
      // O crop circular será feito visualmente pela borda do avatar
      setProfileImage(selectedImageUri);
      
      // Salvar a foto imediatamente no storage
      try {
        const currentProfile = await loadProfileData();
        const updatedProfile: ProfileData = {
          ...currentProfile,
          avatar: selectedImageUri,
        };
        console.log('Salvando foto de perfil:', {
          uri: selectedImageUri,
          currentProfile: currentProfile,
          updatedProfile: updatedProfile,
        });
        await saveProfileData(updatedProfile);
        
        // Verificar se foi salvo corretamente
        const verify = await loadProfileData();
        console.log('Foto de perfil verificada após salvar:', verify.avatar);
        
        if (verify.avatar !== selectedImageUri) {
          console.warn('Aviso: A foto pode não ter sido salva corretamente');
        }
      } catch (error) {
        console.error('Erro ao salvar foto no storage:', error);
        showNotification('Erro', 'Não foi possível salvar a foto de perfil', 'error');
        return;
      }
      
      setIsCropModalVisible(false);
      setSelectedImageUri(null);
      setZoom(1);
      setImagePosition({ x: 0, y: 0 });
      lastPanPosition.current = { x: 0, y: 0 };
      
      // Mostrar notificação de sucesso
      showNotification('Sucesso', 'Foto de perfil atualizada com sucesso!', 'success', false);
    } catch (error) {
      console.error('Erro ao aplicar imagem:', error);
      showNotification('Erro', 'Não foi possível processar a imagem', 'error');
    }
  };

  const showNotification = (title: string, message: string, type: 'success' | 'error', redirect = false) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setNotificationType(type);
    setShouldRedirect(redirect);
    setIsNotificationVisible(true);

    // Animação de entrada
    notificationScale.setValue(0);
    notificationOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(notificationScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(notificationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeNotification = () => {
    Animated.parallel([
      Animated.timing(notificationScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(notificationOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsNotificationVisible(false);
      if (shouldRedirect) {
        router.push('/screens/profile');
      }
    });
  };

  const handleSave = async () => {
    // Validações
    if (!form.username.trim()) {
      showNotification('Erro', 'O nome de usuário é obrigatório!', 'error');
      return;
    }

    if (!form.email.trim() || !form.email.includes('@')) {
      showNotification('Erro', 'Por favor, insira um e-mail válido!', 'error');
      return;
    }

    if (form.bio.length > 150) {
      showNotification('Erro', 'A biografia não pode ter mais de 150 caracteres!', 'error');
      return;
    }

    try {
      // Salvar dados do perfil
      const profileData: ProfileData = {
        username: form.username.trim(),
        name: form.fullname.trim(),
        bio: form.bio.trim(),
        email: form.email.trim(),
        avatar: profileImage,
        youtube: form.youtube.trim(),
        twitch: form.twitch.trim(),
        instagram: form.instagram.trim(),
        twitter: form.twitter.trim(),
      };

      await saveProfileData(profileData);
      showNotification('Sucesso!', 'Perfil atualizado com sucesso!', 'success', true);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      showNotification('Erro', 'Não foi possível salvar o perfil. Tente novamente.', 'error');
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => router.push('/screens/profile')}
          className="w-10 h-10 bg-emerald-500/20 rounded-full items-center justify-center mr-4 border border-emerald-500/30"
        >
          <ArrowLeft size={20} color="#53fc18" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white text-xl font-bold">Editar Perfil</Text>
          <Animated.View
            className="h-0.5 bg-emerald-500 mt-1"
            style={{
              transform: [{ scaleX: lineScale }],
            }}
          />
        </View>
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Picture Section */}
        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mx-4 mb-6">
          <View className="items-center">
            <View className="relative mb-4">
              <LinearGradient
                colors={['#53fc18', '#45d614']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 64,
                  padding: 4,
                }}
              >
                <View className="w-full h-full bg-black rounded-full items-center justify-center overflow-hidden">
                  <Image
                    source={{ uri: profileImage }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                </View>
              </LinearGradient>
              <TouchableOpacity
                onPress={pickImage}
                className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-500 rounded-full items-center justify-center border-2 border-black"
              >
                <Camera size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={pickImage}>
              <Text className="text-emerald-500 text-sm font-medium">Alterar foto de perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Section */}
        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mx-4 mb-6">
          <Text className="text-white text-lg font-bold mb-6">Informações Pessoais</Text>

          {/* Username */}
          <View className="mb-6">
            <Text className="text-gray-300 text-sm font-medium mb-2">Nome de Usuário</Text>
            <View className="relative">
              <View className="absolute left-4 z-10" style={{ top: '50%', transform: [{ translateY: -10 }] }}>
                <Text className="text-gray-400">@</Text>
              </View>
              <TextInput
                value={form.username}
                onChangeText={(text) => setForm({ ...form, username: text })}
                className="bg-black border border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-white"
                placeholderTextColor="#666"
                placeholder="seu_usuario"
              selectionColor="#00FF40"
              cursorColor="#00FF40"
              style={textInputStyle}
              />
            </View>
            <Text className="text-zinc-500 text-xs mt-1">Seu nome de usuário será usado na URL do seu perfil</Text>
          </View>

          {/* Full Name */}
          <View className="mb-6">
            <Text className="text-gray-300 text-sm font-medium mb-2">Nome Completo</Text>
            <TextInput
              value={form.fullname}
              onChangeText={(text) => setForm({ ...form, fullname: text })}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white"
              placeholderTextColor="#666"
              placeholder="Seu nome completo"
              selectionColor="#00FF40"
              cursorColor="#00FF40"
              style={textInputStyle}
            />
          </View>

          {/* Bio */}
          <View className="mb-6">
            <Text className="text-gray-300 text-sm font-medium mb-2">Biografia</Text>
            <TextInput
              value={form.bio}
              onChangeText={(text) => setForm({ ...form, bio: text })}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white min-h-[100px]"
              placeholderTextColor="#666"
              placeholder="Conte um pouco sobre você..."
              multiline
              textAlignVertical="top"
              selectionColor="#00FF40"
              cursorColor="#00FF40"
              style={textInputStyle}
            />
            <View className="flex-row justify-between mt-1">
              <Text className="text-zinc-500 text-xs">Máximo de 150 caracteres</Text>
              <Text className={`text-xs ${form.bio.length > 150 ? 'text-red-500' : 'text-zinc-500'}`}>
                {form.bio.length}/150
              </Text>
            </View>
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-gray-300 text-sm font-medium mb-2">E-mail</Text>
            <TextInput
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white"
              placeholderTextColor="#666"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              selectionColor="#00FF40"
              cursorColor="#00FF40"
              style={textInputStyle}
            />
            <Text className="text-zinc-500 text-xs mt-1">Usado para notificações e recuperação de conta</Text>
          </View>
        </View>

        {/* Social Links Section */}
        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mx-4 mb-6">
          <Text className="text-white text-lg font-bold mb-6">Links Sociais</Text>

          {/* YouTube */}
          <View className="mb-4">
            <Text className="text-gray-300 text-sm font-medium mb-2">YouTube</Text>
            <View className="relative">
              <View className="absolute left-4 z-10" style={{ top: '50%', transform: [{ translateY: -10 }] }}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    fill="#FF0000"
                  />
                </Svg>
              </View>
              <TextInput
                value={form.youtube}
                onChangeText={(text) => setForm({ ...form, youtube: text })}
                className="bg-black border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white"
                placeholderTextColor="#666"
                placeholder="https://youtube.com/@seu_canal"
                keyboardType="url"
                autoCapitalize="none"
                selectionColor="#00FF40"
                cursorColor="#00FF40"
                style={textInputStyle}
              />
            </View>
          </View>

          {/* Twitch */}
          <View className="mb-4">
            <Text className="text-gray-300 text-sm font-medium mb-2">Twitch</Text>
            <View className="relative">
              <View className="absolute left-4 z-10" style={{ top: '50%', transform: [{ translateY: -10 }] }}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"
                    fill="#9146FF"
                  />
                </Svg>
              </View>
              <TextInput
                value={form.twitch}
                onChangeText={(text) => setForm({ ...form, twitch: text })}
                className="bg-black border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white"
                placeholderTextColor="#666"
                placeholder="https://twitch.tv/seu_canal"
                keyboardType="url"
                autoCapitalize="none"
                selectionColor="#00FF40"
                cursorColor="#00FF40"
                style={textInputStyle}
              />
            </View>
          </View>

          {/* Instagram */}
          <View className="mb-4">
            <Text className="text-gray-300 text-sm font-medium mb-2">Instagram</Text>
            <View className="relative">
              <View className="absolute left-4 z-10" style={{ top: '50%', transform: [{ translateY: -10 }] }}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Defs>
                    <SvgLinearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#833AB4" stopOpacity="1" />
                      <Stop offset="50%" stopColor="#E1306C" stopOpacity="1" />
                      <Stop offset="100%" stopColor="#FCAF45" stopOpacity="1" />
                    </SvgLinearGradient>
                  </Defs>
                  <Path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    fill="url(#instagram-gradient)"
                  />
                </Svg>
              </View>
              <TextInput
                value={form.instagram}
                onChangeText={(text) => setForm({ ...form, instagram: text })}
                className="bg-black border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white"
                placeholderTextColor="#666"
                placeholder="https://instagram.com/seu_perfil"
                keyboardType="url"
                autoCapitalize="none"
                selectionColor="#00FF40"
                cursorColor="#00FF40"
                style={textInputStyle}
              />
            </View>
          </View>

          {/* Twitter/X */}
          <View className="mb-4">
            <Text className="text-gray-300 text-sm font-medium mb-2">Twitter / X</Text>
            <View className="relative">
              <View className="absolute left-4 z-10" style={{ top: '50%', transform: [{ translateY: -10 }] }}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    fill="#fff"
                  />
                </Svg>
              </View>
              <TextInput
                value={form.twitter}
                onChangeText={(text) => setForm({ ...form, twitter: text })}
                className="bg-black border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white"
                placeholderTextColor="#666"
                placeholder="https://x.com/seu_perfil"
                keyboardType="url"
                autoCapitalize="none"
                selectionColor="#00FF40"
                cursorColor="#00FF40"
                style={textInputStyle}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mx-4 mb-6">
          <TouchableOpacity
            onPress={handleSave}
            className="flex-1 bg-emerald-500 rounded-xl py-4"
          >
            <Text className="text-black text-center font-bold text-lg">Salvar Alterações</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/screens/profile')}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-4"
          >
            <Text className="text-white text-center font-bold text-lg">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {/* Crop Modal */}
      <Modal
        visible={isCropModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsCropModalVisible(false)}
      >
        <View className="flex-1 bg-black/80 items-center justify-center p-4">
          <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-xl font-bold">Ajustar Foto de Perfil</Text>
              <TouchableOpacity onPress={() => setIsCropModalVisible(false)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View
              className="mb-4"
              onLayout={(e) => {
                const { width } = e.nativeEvent.layout;
                setContainerSize(width);
              }}
            >
              <View className="w-full bg-black rounded-xl overflow-hidden" style={{ aspectRatio: 1, minHeight: 300 }}>
                <View className="absolute inset-0 items-center justify-center" style={{ overflow: 'hidden' }}>
                  {selectedImageUri && (
                    <View
                      {...imagePanResponder.panHandlers}
                      style={{
                        position: 'absolute',
                        width: containerSize * 0.8,
                        height: containerSize * 0.8,
                        transform: [
                          { translateX: imagePosition.x },
                          { translateY: imagePosition.y },
                          { scale: zoom },
                        ],
                        zIndex: 1,
                      }}
                      onLayout={(e) => {
                        if (containerSize > 0) {
                          const { width, height } = e.nativeEvent.layout;
                          setImageSize({ width, height });
                        }
                      }}
                    >
                      <Image
                        source={{ uri: selectedImageUri }}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                        resizeMode="cover"
                        onLoad={(e) => {
                          try {
                            const source = e.nativeEvent?.source;
                            if (source && source.width && source.height) {
                              setImageNaturalSize({ width: source.width, height: source.height });
                            }
                          } catch (error) {
                            // Ignorar erro se não conseguir obter dimensões
                            console.log('Não foi possível obter dimensões da imagem');
                          }
                        }}
                      />
                    </View>
                  )}
                  {/* Overlay escuro ao redor do círculo */}
                  <View
                    className="absolute"
                    style={{
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      zIndex: 5,
                    }}
                  />
                  {/* Overlay circular (área visível) */}
                  <View
                    className="absolute border-2 border-emerald-500 rounded-full"
                    style={{
                      width: '80%',
                      height: '80%',
                      top: '10%',
                      left: '10%',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 9999,
                      elevation: 10,
                      zIndex: 10,
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Zoom Slider */}
            <View className="mb-6">
              <Text className="text-gray-300 text-sm font-medium mb-3">Zoom</Text>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-400 text-xs">0.5x</Text>
                <Text className="text-gray-400 text-xs">3x</Text>
              </View>
              <View 
                className="w-full h-2 bg-zinc-800 rounded-full relative" 
                style={{ position: 'relative', marginBottom: 8 }}
                onLayout={(e) => {
                  const { width } = e.nativeEvent.layout;
                  if (width > 0) {
                    setContainerSize(width);
                    sliderWidthRef.current = width;
                  }
                }}
                {...sliderPanResponder.panHandlers}
              >
                <View
                  className="h-full bg-emerald-500 rounded-full absolute left-0"
                  style={{ width: `${((zoom - 0.5) / 2.5) * 100}%` }}
                />
                <View
                  className="absolute w-5 h-5 bg-emerald-500 rounded-full border-2 border-black"
                  style={{
                    left: `${((zoom - 0.5) / 2.5) * 100}%`,
                    marginLeft: -10,
                    top: -6.5,
                    zIndex: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                />
                <TouchableOpacity
                  className="absolute inset-0"
                  activeOpacity={1}
                  onPress={(e) => {
                    const sliderWidth = sliderWidthRef.current || containerSize || SCREEN_WIDTH - 80;
                    const touchX = e.nativeEvent.locationX;
                    const percentage = Math.max(0, Math.min(1, touchX / sliderWidth));
                    const newZoom = 0.5 + percentage * 2.5;
                    setZoom(newZoom);
                  }}
                />
              </View>
            </View>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setIsCropModalVisible(false)}
                className="flex-1 bg-black border border-zinc-800 rounded-xl py-3"
              >
                <Text className="text-white text-center font-medium">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyCrop}
                className="flex-1 bg-emerald-500 rounded-xl py-3"
              >
                <Text className="text-black text-center font-medium">Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
      <Modal
        visible={isNotificationVisible}
        animationType="fade"
        transparent
        onRequestClose={closeNotification}
      >
        <TouchableOpacity
          className="flex-1 bg-black/60 items-center justify-center p-4"
          activeOpacity={1}
          onPress={closeNotification}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Animated.View
              className={`bg-zinc-900 border rounded-3xl p-8 w-full max-w-sm ${
                notificationType === 'error' ? 'border-red-500' : 'border-emerald-500'
              }`}
              style={{
                transform: [{ scale: notificationScale }],
                opacity: notificationOpacity,
              }}
            >
              <View className="items-center">
                <View
                  className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
                    notificationType === 'error' ? 'bg-red-500/20' : 'bg-emerald-500/20'
                  }`}
                >
                  {notificationType === 'error' ? (
                    <X size={32} color="#ef4444" />
                  ) : (
                    <Check size={32} color="#53fc18" />
                  )}
                </View>
                <Text className="text-white text-xl font-bold mb-2">{notificationTitle}</Text>
                <Text className="text-gray-300 mb-6 text-center">{notificationMessage}</Text>
                <TouchableOpacity
                  onPress={closeNotification}
                  className="w-full bg-emerald-500 rounded-xl py-3"
                >
                  <Text className="text-black text-center font-medium">OK</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

