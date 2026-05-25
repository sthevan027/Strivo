import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountPrivacy() {
  const router = useRouter();
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-black border-b border-zinc-800">
        <TouchableOpacity className="mr-4" onPress={router.back}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Privacidade da conta</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Toggle Section */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-base">Conta privada</Text>
            
            <TouchableOpacity
              onPress={() => setIsPrivate(!isPrivate)}
              className={`w-14 h-8 rounded-full justify-center ${
                isPrivate ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
              activeOpacity={0.8}
            >
              <View
                className={`w-6 h-6 bg-white rounded-full ${
                  isPrivate ? 'self-end mr-1' : 'self-start ml-1'
                }`}
              />
            </TouchableOpacity>
          </View>

          {/* Description Text */}
          <Text className="text-zinc-400 text-sm leading-relaxed">
            Quando sua conta estiver definida como privada, somente os seguidores aprovados por você poderão visualizar o conteúdo que compartilha, incluindo fotos, vídeos e publicações com marcações ou localização. Suas listas de seguidores e de perfis seguidos também ficarão restritas. Algumas informações básicas, como a foto e o nome de usuário, permanecem públicas dentro e fora do aplicativo.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}