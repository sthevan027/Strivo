import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Video, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CreateKlipScreenProps {
  visible: boolean;
  onClose: () => void;
}

const CreateKlipScreen = ({ visible, onClose }: CreateKlipScreenProps) => {
  const [description, setDescription] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
      setSelectedVideo(result.assets[0].uri);
    }
  };

  const handlePublish = () => {
    if (!selectedVideo) {
      Alert.alert('Atenção', 'Selecione um vídeo');
      return;
    }

    Alert.alert('Sucesso', 'Klip publicado com sucesso!', [
      { text: 'OK', onPress: onClose }
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View 
        className="flex-1 bg-black/90 justify-center items-center"
        style={{ 
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <View className="bg-[#1a1a1a] rounded-3xl w-full max-w-md mx-4 overflow-hidden">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-800">
            <Text className="text-white text-xl font-bold">Criar Klips</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            className="px-6 py-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Video Upload Area */}
            <TouchableOpacity
              onPress={pickVideo}
              className="border-2 border-dashed border-gray-700 rounded-2xl mb-6 overflow-hidden"
              style={{ aspectRatio: 9/16 }}
            >
              {!selectedVideo ? (
                <View className="flex-1 items-center justify-center bg-zinc-900 p-6">
                  <View className="bg-zinc-800 rounded-full p-6 mb-4">
                    <Video size={48} color="#9ca3af" />
                  </View>
                  <Text className="text-gray-400 text-center text-base font-medium">
                    Adicionar vídeo
                  </Text>
                  <Text className="text-gray-500 text-sm text-center mt-2">
                    Duração: 15s - 90s
                  </Text>
                </View>
              ) : (
                <View className="flex-1 bg-zinc-900 items-center justify-center">
                  <View className="absolute top-3 right-3 z-10">
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedVideo(null);
                      }}
                      className="bg-black/70 rounded-full w-10 h-10 items-center justify-center"
                    >
                      <Text className="text-white text-xl">✕</Text>
                    </TouchableOpacity>
                  </View>
                  <Video size={64} color="#00FF40" />
                  <Text className="text-white mt-3 font-semibold">
                    Vídeo selecionado
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">
                    Toque para alterar
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Descrição */}
            <View className="mb-6">
              <Text className="text-gray-400 text-sm mb-3 font-medium">
                Descrição
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Descreva seu klip..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                className="bg-zinc-900 text-white rounded-xl px-4 py-4 text-base"
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            {/* Botões de Ação */}
            <View className="flex-row gap-3 mb-2">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-zinc-900 rounded-xl py-4"
              >
                <Text className="text-gray-400 text-center font-semibold text-base">
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePublish}
                className="flex-1 bg-green-500 rounded-xl py-4"
              >
                <Text className="text-black text-center font-bold text-base">
                  Publicar Klips
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreateKlipScreen;