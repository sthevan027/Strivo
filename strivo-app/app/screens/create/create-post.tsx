import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Image as ImageIcon, Plus, Video } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MediaFile {
  type: 'image' | 'video';
  uri: string;
  fileName?: string;
}

const CreatePostScreen = () => {
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [allowComments, setAllowComments] = useState(true);
  const [allowLikes, setAllowLikes] = useState(true);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedMedia({
        type: 'image',
        uri: result.assets[0].uri,
        fileName: result.assets[0].fileName || 'image.jpg',
      });
    }
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedMedia({
        type: 'video',
        uri: result.assets[0].uri,
        fileName: result.assets[0].fileName || 'video.mp4',
      });
    }
  };

  const handlePost = () => {
    if (!selectedMedia) {
      Alert.alert('Atenção', 'Selecione uma foto ou vídeo');
      return;
    }

    Alert.alert('Sucesso', 'Post criado com sucesso!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView  className="flex-1 bg-black">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-800">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Criar Post</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          className="flex-1 px-6 py-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Media Upload Area */}
          {!selectedMedia ? (
            <View className="bg-zinc-900 rounded-2xl mb-6 overflow-hidden">
              <View className="aspect-square items-center justify-center p-8 border-2 border-dashed border-gray-700">
                <View className="bg-zinc-800 rounded-full p-6 mb-4">
                  <Plus size={48} color="#9ca3af" />
                </View>
                <Text className="text-gray-400 text-center mb-2 text-base">
                  Toque para adicionar foto ou vídeo
                </Text>
                <Text className="text-gray-500 text-sm text-center mb-6">
                  Formatos: JPG, PNG, MP4, MOV
                </Text>
                
                {/* Botões de seleção */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={pickImage}
                    className="flex-row items-center gap-2 bg-zinc-800 px-6 py-3 rounded-lg"
                  >
                    <ImageIcon size={20} color="#00FF40" />
                    <Text className="text-white font-semibold">Foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={pickVideo}
                    className="flex-row items-center gap-2 bg-zinc-800 px-6 py-3 rounded-lg"
                  >
                    <Video size={20} color="#00FF40" />
                    <Text className="text-white font-semibold">Vídeo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View className="relative bg-zinc-900 rounded-2xl mb-6 overflow-hidden">
              <Image
                source={{ uri: selectedMedia.uri }}
                className="w-full aspect-square"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setSelectedMedia(null)}
                className="absolute top-3 right-3 bg-black/70 rounded-full w-10 h-10 items-center justify-center"
              >
                <Text className="text-white text-xl">✕</Text>
              </TouchableOpacity>
              <View className="absolute bottom-3 left-3 bg-black/70 px-3 py-2 rounded-full">
                <Text className="text-white text-sm">
                  {selectedMedia.type === 'image' ? '📷 Foto' : '🎥 Vídeo'}
                </Text>
              </View>
            </View>
          )}

          {/* Caption Input */}
          <View className="mb-6">
            <Text className="text-gray-400 text-sm mb-3 font-medium">
              Escreva uma legenda...
            </Text>
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="O que você quer compartilhar?"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              className="bg-zinc-900 text-white rounded-xl px-4 py-4 text-base"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          {/* Configurações */}
          <View className="space-y-4">
            {/* Permitir comentários */}
            <View className="flex-row items-center justify-between bg-zinc-900 rounded-xl px-5 py-4">
              <Text className="text-white text-base font-medium">
                Permitir comentários
              </Text>
              <TouchableOpacity
                onPress={() => setAllowComments(!allowComments)}
                className={`w-14 h-8 rounded-full justify-center ${
                  allowComments ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <View
                  className={`w-6 h-6 rounded-full bg-white shadow-lg ${
                    allowComments ? 'ml-7' : 'ml-1'
                  }`}
                />
              </TouchableOpacity>
            </View>

            {/* Permitir curtidas */}
            <View className="flex-row items-center justify-between bg-zinc-900 rounded-xl px-5 py-4">
              <Text className="text-white text-base font-medium">
                Permitir curtidas
              </Text>
              <TouchableOpacity
                onPress={() => setAllowLikes(!allowLikes)}
                className={`w-14 h-8 rounded-full justify-center ${
                  allowLikes ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <View
                  className={`w-6 h-6 rounded-full bg-white shadow-lg ${
                    allowLikes ? 'ml-7' : 'ml-1'
                  }`}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Espaço extra no final */}
          <View className="h-6" />
        </ScrollView>

        {/* Botões de Ação */}
        <View className="flex-row gap-3 px-6 py-4 border-t border-gray-800">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-zinc-900 rounded-xl py-4"
          >
            <Text className="text-gray-400 text-center font-semibold text-base">
              Cancelar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePost}
            className="flex-1 bg-green-500 rounded-xl py-4"
          >
            <Text className="text-black text-center font-bold text-base">
              Compartilhar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreatePostScreen;