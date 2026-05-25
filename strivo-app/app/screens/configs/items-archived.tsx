import { useRouter } from 'expo-router';
import { ArrowLeft, Film, Image, Plus, Video } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'stories' | 'posts' | 'videos' | 'klips';

export default function ArchivedItemsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<TabType>('stories');

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-black border-b border-zinc-900">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity className="mr-4" onPress={() => router.push('/screens/configuration')}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Itens Arquivados</Text>
        </View>
        <TouchableOpacity>
          <Plus size={24} color="#00ff88" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Content Area */}
        <View className="flex-1 items-center justify-center py-20">
          <View className="items-center px-8">
            <View className="w-24 h-24 rounded-full bg-zinc-900 items-center justify-center mb-6">
              <Image size={40} color="#71717a" />
            </View>
            <Text className="text-white text-xl font-semibold mb-3">Arquivo de stories</Text>
            <Text className="text-zinc-400 text-center text-base leading-6">
              Aqui você encontrará todos os seus stories arquivados para revisar quando quiser
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View className="flex-row bg-zinc-950 border-t border-zinc-900 px-2 py-3">
        <TouchableOpacity 
          className="flex-1 items-center py-2"
          onPress={() => setSelectedTab('stories')}
        >
          <Image 
            size={24} 
            color={selectedTab === 'stories' ? '#00ff88' : '#71717a'} 
            strokeWidth={selectedTab === 'stories' ? 2.5 : 2}
          />
          <Text className={`text-xs mt-1 ${selectedTab === 'stories' ? 'text-[#00ff88] font-semibold' : 'text-zinc-400'}`}>
            Stories
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-1 items-center py-2"
          onPress={() => setSelectedTab('posts')}
        >
          <Video 
            size={24} 
            color={selectedTab === 'posts' ? '#00ff88' : '#71717a'}
            strokeWidth={selectedTab === 'posts' ? 2.5 : 2}
          />
          <Text className={`text-xs mt-1 ${selectedTab === 'posts' ? 'text-[#00ff88] font-semibold' : 'text-zinc-400'}`}>
            Posts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-1 items-center py-2"
          onPress={() => setSelectedTab('videos')}
        >
          <Film 
            size={24} 
            color={selectedTab === 'videos' ? '#00ff88' : '#71717a'}
            strokeWidth={selectedTab === 'videos' ? 2.5 : 2}
          />
          <Text className={`text-xs mt-1 ${selectedTab === 'videos' ? 'text-[#00ff88] font-semibold' : 'text-zinc-400'}`}>
            Vídeos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-1 items-center py-2"
          onPress={() => setSelectedTab('klips')}
        >
          {/* Ícone de Klips - similar ao Reels */}
          <View className={`${selectedTab === 'klips' ? 'border-2 border-[#00ff88]' : 'border-2 border-zinc-700'} rounded p-0.5`}>
            <View className="w-4 h-4 bg-transparent" />
          </View>
          <Text className={`text-xs mt-1 ${selectedTab === 'klips' ? 'text-[#00ff88] font-semibold' : 'text-zinc-400'}`}>
            Klips
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}