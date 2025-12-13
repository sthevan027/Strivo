import { useRouter } from 'expo-router';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SharingScreen() {
  const router = useRouter();
  const [allowStorySharing, setAllowStorySharing] = useState(true);
  const [allowPostSharing, setAllowPostSharing] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-black border-b border-zinc-900">
        <TouchableOpacity className="mr-4" onPress={() => router.push('/screens/configuration')}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Compartilhamento</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="text-zinc-400 text-sm mb-4">
            Controle quem pode compartilhar seu conteúdo
          </Text>

          {/* Compartilhamento de Stories */}
          <View className="flex-row items-center justify-between py-4 border-b border-zinc-900">
            <View className="flex-row items-center flex-1 mr-4">
              <View className="mr-3">
                <Share2 size={24} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-base mb-1">
                  Permitir que seus seguidores compartilhem seus stories
                </Text>
                <Text className="text-zinc-400 text-sm">
                  Seus seguidores poderão compartilhar seus stories em mensagens
                </Text>
              </View>
            </View>
            <Switch
              value={allowStorySharing}
              onValueChange={setAllowStorySharing}
              trackColor={{ false: '#3f3f46', true: '#00ff88' }}
              thumbColor="#fff"
              ios_backgroundColor="#3f3f46"
            />
          </View>

          {/* Compartilhamento de Posts/Vídeos */}
          <View className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center flex-1 mr-4">
              <View className="mr-3">
                <Share2 size={24} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-base mb-1">
                  Permitir que seus seguidores compartilhem seus posts ou vídeos
                </Text>
                <Text className="text-zinc-400 text-sm">
                  Seus seguidores poderão compartilhar suas publicações
                </Text>
              </View>
            </View>
            <Switch
              value={allowPostSharing}
              onValueChange={setAllowPostSharing}
              trackColor={{ false: '#3f3f46', true: '#00ff88' }}
              thumbColor="#fff"
              ios_backgroundColor="#3f3f46"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}