import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3;

interface LikedPost {
  id: string;
  imageUrl: string;
  type: 'image' | 'video';
}

// Posts de exemplo (você vai substituir pelos seus dados reais)
const MOCK_POSTS: LikedPost[] = [
  { id: '1', imageUrl: 'https://picsum.photos/400/400?random=1', type: 'image' },
  { id: '2', imageUrl: 'https://picsum.photos/400/400?random=2', type: 'video' },
  { id: '3', imageUrl: 'https://picsum.photos/400/400?random=3', type: 'image' },
  { id: '4', imageUrl: 'https://picsum.photos/400/400?random=4', type: 'video' },
  { id: '5', imageUrl: 'https://picsum.photos/400/400?random=5', type: 'image' },
  { id: '6', imageUrl: 'https://picsum.photos/400/400?random=6', type: 'image' },
  { id: '7', imageUrl: 'https://picsum.photos/400/400?random=7', type: 'video' },
  { id: '8', imageUrl: 'https://picsum.photos/400/400?random=8', type: 'image' },
  { id: '9', imageUrl: 'https://picsum.photos/400/400?random=9', type: 'image' },
  { id: '10', imageUrl: 'https://picsum.photos/400/400?random=10', type: 'video' },
  { id: '11', imageUrl: 'https://picsum.photos/400/400?random=11', type: 'image' },
  { id: '12', imageUrl: 'https://picsum.photos/400/400?random=12', type: 'image' },
];

export default function LikedContentScreen() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="bg-black border-b border-zinc-900">
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity className="mr-4" onPress={() => router.push('/screens/configuration')}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">Conteúdo Curtido</Text>
          </View>
          <TouchableOpacity>
            <Text className="text-[#00ff88] text-base font-semibold">Selecionar</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Dropdown */}
        <TouchableOpacity 
          className="flex-row items-center justify-between px-4 py-3 border-t border-zinc-900"
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text className="text-white text-base">Todo conteúdo curtido</Text>
          <ChevronDown 
            size={20} 
            color="#fff" 
            style={{ transform: [{ rotate: showDropdown ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Grid de posts curtidos */}
        <View className="flex-row flex-wrap">
          {MOCK_POSTS.map((post, index) => (
            <TouchableOpacity
              key={post.id}
              className="border border-black"
              style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
            >
              <Image
                source={{ uri: post.imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}