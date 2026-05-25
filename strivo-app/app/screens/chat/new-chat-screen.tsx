import { Conversation, User } from '@/src/utils/types/message';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';


const allUsers: User[] = [
  { id: 6, username: 'Pedro Oliveira', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: 7, username: 'Carla Santos', avatar: 'https://i.pravatar.cc/150?img=25' },
  { id: 8, username: 'Rafael Costa', avatar: 'https://i.pravatar.cc/150?img=35' },
  { id: 9, username: 'Juliana Lima', avatar: 'https://i.pravatar.cc/150?img=40' },
  { id: 10, username: 'Marcos Silva', avatar: 'https://i.pravatar.cc/150?img=50' },
  { id: 11, username: 'Beatriz Alves', avatar: 'https://i.pravatar.cc/150?img=55' },
  { id: 12, username: 'Fernando Rocha', avatar: 'https://i.pravatar.cc/150?img=60' },
];

export default function NewChatScreen() {
  const [searchText, setSearchText] = useState<string>('');
  const navigation = useRouter();
  const filteredUsers = allUsers.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleUserPress = (user: User) => {
    const newConversation: Conversation = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      lastMessage: '',
      time: 'Agora',
      unread: 0,
      read: true,
      hasStory: false,
      messages: []
    };
    navigation.navigate('/screens/chat/chat-screen');
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="px-4 pt-12 pb-4 bg-black border-b border-gray-800">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity className="mr-4" onPress={() => navigation.push('/screens/chat/message-screen')}>
            <ArrowLeft size={26} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-semibold">Nova Conversa</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-900 rounded-xl px-4 py-2.5">
          <Search size={18} color="#00FF40" />
          <TextInput
            placeholder="Buscar usuários..."
            placeholderTextColor="#00FF40"
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 ml-3 text-white text-base"
            autoFocus
          />
        </View>
      </View>

      {/* Users List */}
      <ScrollView className="flex-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <TouchableOpacity
              key={user.id}
              className="flex-row items-center px-4 py-3 border-b border-gray-900"
              activeOpacity={0.7}
              onPress={() => handleUserPress(user)}
            >
              <Image
                source={{ uri: user.avatar }}
                className="w-14 h-14 rounded-full mr-3"
              />
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">
                  {user.username}
                </Text>
                <Text className="text-gray-400 text-sm">Toque para conversar</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500 text-base">Nenhum usuário encontrado</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}