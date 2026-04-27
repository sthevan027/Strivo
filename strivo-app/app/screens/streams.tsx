import { useRouter } from 'expo-router';
import { ArrowRight, Circle, Search, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import "../../global.css";

interface Categories{
  id:number;
  name:string;
  image:string;
  viewers:string;
  tags:string[];
}

interface TopStreamer {
  id: number;
  rank: number;
  name: string;
  avatar: any;
  followers: string;
  category: string;
  isOnline: boolean;
}

export default function Streams() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);
  const router = useRouter();

  const categories = [
    { 
      id: 1, 
      name: 'Roblox', 
      image: require('../../assets/images/roblox.png'),
      viewers: '0 mil assistindo', 
      tags: ['Adventure', 'Casual'] 
    },
    { 
      id: 2, 
      name: 'Grand Theft Auto V', 
      image: require('../../assets/images/gta.png'),
      viewers: '0 mil assistindo', 
      tags: ['Action', 'Shooter'] 
    },
    { 
      id: 3, 
      name: 'Fortnite', 
      image: require('../../assets/images/fortnitepng.png'),
      viewers: '0 mil assistindo', 
      tags: ['Battle Royale', 'Shooter'] 
    }
  ];

  const topStreamers: TopStreamer[] = [
    {
      id: 1,
      rank: 1,
      name: 'JonVlogs',
      avatar: require('../../assets/images/Avatar.jpg'),
      followers: '2.32M',
      category: 'Fortnite',
      isOnline: true
    },
    {
      id: 2,
      rank: 2,
      name: 'paulinholokobr',
      avatar: require('../../assets/images/Avatar.jpg'),
      followers: '178K',
      category: 'GTA V',
      isOnline: true
    },
    {
      id: 3,
      rank: 3,
      name: 'facada',
      avatar: require('../../assets/images/Avatar.jpg'),
      followers: '54K',
      category: 'Roblox',
      isOnline: true
    },
    {
      id: 4,
      rank: 4,
      name: 'coringa',
      avatar: require('../../assets/images/Avatar.jpg'),
      followers: '202K',
      category: 'Valorant',
      isOnline: true
    },
    {
      id: 5,
      rank: 5,
      name: 'alanzoka',
      avatar: require('../../assets/images/Avatar.jpg'),
      followers: '7.77M',
      category: 'CS:GO',
      isOnline: true
    }
  ];

  // Tela de categoria selecionada
  if (selectedCategory) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="border-b border-zinc-800">
          <View className="flex-row items-center px-4 pt-4 pb-2">
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text className="text-white text-base">← Voltar</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center px-4">
            <TouchableOpacity className="px-4 py-3">
              <Text className="text-zinc-400">Ao Vivo</Text>
            </TouchableOpacity>
            <View className="px-4 py-3 border-b-2 border-green-500">
              <Text className="text-green-500 font-semibold">Categorias</Text>
            </View>
            <TouchableOpacity className="px-4 py-3">
              <Text className="text-zinc-400">Clipes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="bg-zinc-900 rounded-lg p-8 items-center">
            <View className="w-16 h-16 bg-zinc-800 rounded-lg mb-4 items-center justify-center">
              <Circle size={12} color="#3f3f46" />
            </View>
            <Text className="text-zinc-500 text-center">
              Nenhuma live nesta categoria
            </Text>
            <Text className="text-zinc-600 text-sm text-center mt-2">
              Seja o primeiro a transmitir!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Tela principal
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        {/* Header com Search */}
        <View className="px-4 pt-4 pb-6">
          <View className="flex-row items-center bg-zinc-900 rounded-lg px-4 py-3">
            <Search size={20} color="#71717a" />
            <TextInput
              placeholder="Pesquisar lives ou streamers..."
              placeholderTextColor="#71717a"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-white text-base"
            />
          </View>
        </View>

        {/* Top 5 Streamers do Mês */}
        <View className="px-4 mb-8">
          <Text className="text-white text-xl font-bold mb-4">
            Top 5 Streamers do Mês
          </Text>
          
          <View className="bg-zinc-900 rounded-lg overflow-hidden">
            {topStreamers.map((streamer, index) => (
              <TouchableOpacity
                key={streamer.id}
                className={`flex-row items-center p-4 ${
                  index < topStreamers.length - 1 ? 'border-b border-zinc-800' : ''
                }`}
              >
                {/* Rank */}
                <Text className="text-zinc-500 text-lg font-bold w-8">
                  {streamer.rank}
                </Text>

                {/* Avatar com indicador online */}
                <View className="relative ml-4 mr-4">
                  <View className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
                    <User size={24} color="#52525b" />
                  </View>
                  {streamer.isOnline && (
                    <View className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900" />
                  )}
                </View>

                {/* Nome */}
                <View className="flex-1">
                  <Text className="text-white font-semibold text-base">
                    {streamer.name}
                  </Text>
                </View>

                {/* Categoria e Seguidores */}
                <View className="items-end">
                  <Text className="text-zinc-400 text-sm mb-1">
                    {streamer.category}
                  </Text>
                  <Text className="text-white font-semibold text-base">
                    {streamer.followers}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lives */}
        <View className="px-4 mb-8">
          <Text className="text-white text-xl font-bold mb-4">Lives</Text>
          
          <TouchableOpacity onPress={() => router.push('/screens/chat-live')} className="bg-zinc-900 rounded-lg overflow-hidden">
            {/* Thumbnail da Live */}
            <View className="relative h-48 bg-zinc-800">
              <Image 
                source={require('../../assets/images/fortnitepng.png')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/40" />
              
              {/* Badge AO VIVO */}
              <View className="absolute top-3 left-3 bg-red-600 px-3 py-1.5 rounded-md flex-row items-center">
                <Circle size={6} color="white" fill="white" />
                <Text className="text-white text-xs font-bold ml-1.5">AO VIVO</Text>
              </View>
              
              {/* Viewers */}
              <View className="absolute bottom-3 left-3 bg-black/70 px-2 py-1 rounded-md">
                <Text className="text-white text-xs font-semibold">1.2K espectadores</Text>
              </View>
            </View>

            {/* Info da Live */}
            <View className="p-4">
              <View className="flex-row items-start">
                {/* Avatar do Streamer */}
                <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mr-3">
                  <User size={20} color="white" />
                </View>
                
                {/* Informações */}
                <View className="flex-1">
                  <Text className="text-white font-bold text-base mb-1">
                    Jogando Fortnite - Ranked até Champion!
                  </Text>
                  <Text className="text-zinc-400 text-sm mb-1">
                    StreamerPro
                  </Text>
                  <Text className="text-zinc-500 text-xs">
                    Fortnite • Battle Royale
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Principais Categorias Ao Vivo */}
        <View className="px-4 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">
              Principais Categorias Ao Vivo
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <ArrowRight size={20} color="#22c55e" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {categories.map((category) => (
             <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category)}
                className="mr-3 rounded-lg overflow-hidden"
                style={{ width: 128, height: 250 }}
              >
                <View className="relative h-44 bg-zinc-800">
                  <Image 
                    source={category.image}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black/60" />
                  <View className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded-md flex-row items-center">
                    <Circle size={6} color="white" fill="white" />
                    <Text className="text-white text-xs font-bold ml-1">AO VIVO</Text>
                  </View>
                  <View className="absolute bottom-0 left-0 right-0 p-2">
                    <Text className="text-white font-bold text-sm" numberOfLines={2}>
                      {category.name}
                    </Text>
                  </View>
                </View>

                <View className="bg-zinc-900 p-2 flex-1">
                  <Text className="text-white font-semibold text-xs mb-1" numberOfLines={1}>
                    {category.name}
                  </Text>
                  <Text className="text-zinc-500 text-xs mb-2">
                    {category.viewers}
                  </Text>
                  <View className="flex-row flex-wrap gap-1">
                    {category.tags.map((tag, idx) => (
                      <View key={idx} className="bg-zinc-800 px-2 py-0.5 rounded">
                        <Text className="text-zinc-400 text-xs">{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Jogos de Tiro */}
        <View className="px-4 pb-8">
          <Text className="text-white text-xl font-bold mb-4">
            Jogos de Tiro
          </Text>
          
          <View className="bg-zinc-900 rounded-lg p-6">
            <View className="items-center justify-center py-8">
              <View className="w-16 h-16 bg-zinc-800 rounded-lg items-center justify-center mb-4">
                <View className="w-6 h-6 border-2 border-zinc-700 rounded" />
              </View>
              <Text className="text-zinc-500 text-center">
                Nenhuma live nesta categoria
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}