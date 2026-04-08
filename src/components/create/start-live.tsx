import { LinearGradient } from 'expo-linear-gradient';
import { Radio, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StartLiveScreenProps {
  visible: boolean;
  onClose: () => void;
}

const StartLiveScreen = ({ visible, onClose }: StartLiveScreenProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Apenas Conversando');
  const [chatEnabled, setChatEnabled] = useState(true);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const insets = useSafeAreaInsets();

  const categories = [
    'Apenas Conversando',
    'Games',
    'Música',
    'Esportes',
    'Culinária',
    'Educação',
    'Tecnologia',
    'Arte',
    'Fitness',
    'Viagem',
  ];

  const handleStartLive = () => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Digite um título para a live');
      return;
    }

    Alert.alert('Sucesso', 'Live iniciada!', [
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
        <View className="bg-[#1a1a1a] rounded-3xl w-11/12 max-w-md overflow-hidden">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-800">
            <Text className="text-white text-xl font-bold">Iniciar Live</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            className="px-6 py-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Live Icon Area */}
            <View className="items-center mb-6">
              <View className="border-2 border-dashed border-red-500/50 rounded-2xl p-8 w-full items-center">
                <LinearGradient
                  colors={['#ef4444', '#dc2626', '#b91c1c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-full p-6 mb-3"
                  style={{
                    shadowColor: '#ef4444',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 20,
                  }}
                >
                  <Radio size={40} color="#fff" fill="#fff" />
                </LinearGradient>
                <Text className="text-red-500 font-bold text-base mb-1">
                  Transmissão ao vivo
                </Text>
                <Text className="text-gray-500 text-sm">
                  Sua câmera será ativada
                </Text>
              </View>
            </View>

            {/* Título da Live */}
            <View className="mb-6">
              <Text className="text-gray-400 text-sm mb-3 font-medium">
                Título da live
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="O que você vai transmitir?"
                placeholderTextColor="#666"
                className="bg-zinc-900 text-white rounded-xl px-4 py-4 text-base"
              />
            </View>

            {/* Categoria */}
            <View className="mb-6">
              <Text className="text-gray-400 text-sm mb-3 font-medium">
                Categoria
              </Text>
              <TouchableOpacity
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                className="bg-zinc-900 rounded-xl px-4 py-4 flex-row items-center justify-between"
              >
                <Text className="text-white text-base">{category}</Text>
                <Text className="text-gray-500 text-xl">▼</Text>
              </TouchableOpacity>

              {/* Category Picker */}
              {showCategoryPicker && (
                <View className="mt-2 bg-zinc-900 rounded-xl overflow-hidden">
                  {categories.map((cat, index) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryPicker(false);
                      }}
                      className={`px-4 py-3 ${
                        index !== categories.length - 1 ? 'border-b border-gray-800' : ''
                      } ${cat === category ? 'bg-zinc-800' : ''}`}
                    >
                      <Text className={`text-base ${
                        cat === category ? 'text-green-500 font-semibold' : 'text-white'
                      }`}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Chat habilitado */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between bg-zinc-900 rounded-xl px-5 py-4">
                <Text className="text-white text-base font-medium">
                  Chat habilitado
                </Text>
                <TouchableOpacity
                  onPress={() => setChatEnabled(!chatEnabled)}
                  className="w-14 h-8 rounded-full justify-center"
                  style={{ backgroundColor: chatEnabled ? '#22c55e' : '#4b5563' }}
                >
                  <View
                    className="w-6 h-6 rounded-full bg-white shadow-lg"
                    style={{ marginLeft: chatEnabled ? 28 : 4 }}
                  />
                </TouchableOpacity>
              </View>
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
                onPress={handleStartLive}
                className="flex-1 bg-red-600 rounded-xl py-4 flex-row items-center justify-center gap-2"
              >
                <Radio size={20} color="#fff" fill="#fff" />
                <Text className="text-white text-center font-bold text-base">
                  Iniciar Live
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default StartLiveScreen;