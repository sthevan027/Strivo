import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isSelected: boolean;
}

// Usuários de exemplo
const MOCK_USERS: User[] = [
  { id: '1', name: 'João Silva', username: '@joaosilva', isSelected: false },
  { id: '2', name: 'Maria Santos', username: '@mariasantos', isSelected: false },
  { id: '3', name: 'Pedro Costa', username: '@pedrocosta', isSelected: false },
  { id: '4', name: 'Ana Lima', username: '@analima', isSelected: false },
  { id: '5', name: 'Carlos Souza', username: '@carlossouza', isSelected: false },
  { id: '6', name: 'Beatriz Alves', username: '@beatrizalves', isSelected: false },
  { id: '7', name: 'Rafael Mendes', username: '@rafaelmendes', isSelected: false },
];

export default function ManageViewsScreens() {
  const router = useRouter();
  const [showSelectScreen, setShowSelectScreen] = useState(false);
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = useState(new Animated.Value(0))[0];

  const handleOpenSelectScreen = () => {
    setShowSelectScreen(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseSelectScreen = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSelectScreen(false);
    });
  };

  const toggleUserSelection = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isSelected: !user.isSelected } : user
    ));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  return (
    <View className="flex-1 bg-black">
      {/* Tela Principal */}
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 bg-black border-b border-zinc-900">
          <TouchableOpacity className="mr-4" onPress={() => router.push('/screens/configuration')}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Gerenciar Visualizações</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-4 py-6">
            {/* Opção de Gerenciar Visualizações */}
            <TouchableOpacity 
              className="flex-row items-center justify-between py-4 active:bg-zinc-900 rounded-lg"
              onPress={handleOpenSelectScreen}
            >
              <View className="flex-1">
                <Text className="text-white text-base font-semibold mb-2">
                  Gerenciar Visualizações
                </Text>
                <Text className="text-zinc-400 text-sm leading-5">
                  Gerencie quem pode ver seus storys, publicações ou vídeos.
                </Text>
              </View>
              <ChevronRight size={24} color="#71717a" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Tela de Seleção (Slide from Right) */}
      {showSelectScreen && (
        <Animated.View 
          className="absolute inset-0 bg-black"
          style={{ transform: [{ translateX }] }}
        >
          <SafeAreaView className="flex-1 bg-black">
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-black border-b border-zinc-900">
              <View className="flex-row items-center flex-1">
                <TouchableOpacity className="mr-4" onPress={handleCloseSelectScreen}>
                  <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold">Gerencie</Text>
              </View>
              <TouchableOpacity onPress={handleCloseSelectScreen}>
                <Text className="text-[#00ff88] text-base font-semibold">Pronto</Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-3 bg-black border-b border-zinc-900">
              <View className="flex-row items-center bg-zinc-900 rounded-lg px-3 py-2.5">
                <Search size={20} color="#71717a" />
                <TextInput
                  className="flex-1 ml-2 text-white text-base"
                  placeholder="Pesquisar"
                  placeholderTextColor="#71717a"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Users List */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {filteredUsers.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  className="flex-row items-center justify-between px-4 py-3 active:bg-zinc-900"
                  onPress={() => toggleUserSelection(user.id)}
                >
                  <View className="flex-row items-center flex-1">
                    {/* Avatar */}
                    <View className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center mr-3">
                      {user.avatar ? (
                        <Image
                          source={{ uri: user.avatar }}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <View className="w-12 h-12 rounded-full bg-zinc-700 items-center justify-center">
                          <Text className="text-white text-lg font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* User Info */}
                    <View className="flex-1">
                      <Text className="text-white text-base font-medium mb-0.5">
                        {user.name}
                      </Text>
                      <Text className="text-zinc-400 text-sm">
                        {user.username}
                      </Text>
                    </View>
                  </View>

                  {/* Checkbox */}
                  <View 
                    className={`w-6 h-6 rounded border-2 items-center justify-center ${
                      user.isSelected 
                        ? 'bg-[#00ff88] border-[#00ff88]' 
                        : 'border-zinc-600'
                    }`}
                  >
                    {user.isSelected && (
                      <Text className="text-black text-xs font-bold">✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      )}
    </View>
  );
}