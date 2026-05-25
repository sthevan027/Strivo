import CreateGroup from '@/src/components/create-group';
import { Conversation } from '@/src/utils/types/message';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, CheckCheck, Plus, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import NewGroupModal from './group/new-modal';


const initialConversations: Conversation[] = [
  {
    id: 1,
    username: 'Lucas Rodrigues Ramon',
    avatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Oi, tudo bem?',
    time: '14:32',
    unread: 2,
    read: false,
    hasStory: true,
    messages: [
      { id: 1, text: 'E aí, como vai?', time: '14:30', sender: 'them' },
      { id: 2, text: 'Oi, tudo bem?', time: '14:32', sender: 'them' }
    ]
  },
  {
    id: 2,
    username: 'Strivo Brasil',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Vamos marcar aquele treino!',
    time: '13:45',
    unread: 0,
    read: true,
    hasStory: false,
    messages: [
      { id: 1, text: 'Vamos marcar aquele treino!', time: '13:45', sender: 'them' },
      { id: 2, text: 'Bora sim! Amanhã de manhã?', time: '13:50', sender: 'me' }
    ]
  },
  {
    id: 3,
    username: 'Maria Silva',
    avatar: 'https://i.pravatar.cc/150?img=45',
    lastMessage: 'Obrigada pela dica 🙏',
    time: '12:18',
    unread: 0,
    read: true,
    hasStory: true,
    messages: [
      { id: 1, text: 'Obrigada pela dica 🙏', time: '12:18', sender: 'them' }
    ]
  },
  {
    id: 4,
    username: 'João Santos',
    avatar: 'https://i.pravatar.cc/150?img=33',
    lastMessage: 'Você viu o novo vídeo?',
    time: '11:52',
    unread: 0,
    read: false,
    hasStory: false,
    messages: [
      { id: 1, text: 'Você viu o novo vídeo?', time: '11:52', sender: 'them' }
    ]
  },
  {
    id: 5,
    username: 'Ana Costa',
    avatar: 'https://i.pravatar.cc/150?img=20',
    lastMessage: 'Show! Até amanhã então',
    time: 'Ontem',
    unread: 0,
    read: true,
    hasStory: true,
    messages: [
      { id: 1, text: 'Show! Até amanhã então', time: 'Ontem', sender: 'them' }
    ]
  }
];

export default function MessagesScreen() {
  const [searchText, setSearchText] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const navigation = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    conv.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleConversationPress = (conversation: Conversation) => {
    // Marcar como lida
    const updatedConversations = conversations.map(conv =>
      conv.id === conversation.id ? { ...conv, unread: 0 } : conv
    );
    setConversations(updatedConversations);

    navigation.navigate('/screens/chat/chat-screen', );
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="px-4 pt-12 pb-4 bg-black border-b border-gray-800">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity className="mr-4" onPress={() => navigation.back()}>
              <ArrowLeft size={26} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-semibold">Mensagens</Text>
          </View>
          <View className="flex-row items-center gap-5">
         
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Plus size={24} color="#00FF40" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-900 rounded-xl px-4 py-2.5">
          <Search size={18} color="#00FF40" />
          <TextInput
            placeholder="Pesquisar..."
            placeholderTextColor="#00FF40"
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 ml-3 text-white text-base"
          />
        </View>
      </View>

      {/* Messages List */}
      <ScrollView className="flex-1">
        {filteredConversations.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            className="flex-row items-center px-4 py-3 border-b border-gray-900"
            activeOpacity={0.7}
            onPress={() => handleConversationPress(conv)}
          >
            {/* Avatar with Story Ring */}
            <View className="mr-3">
              {conv.hasStory ? (
                <View className="rounded-full p-0.5 bg-[#00FF40]">
                  <View className="rounded-full p-0.5 bg-black">
                    <Image
                      source={{ uri: conv.avatar }}
                      className="w-14 h-14 rounded-full"
                    />
                  </View>
                </View>
              ) : (
                <Image
                  source={{ uri: conv.avatar }}
                  className="w-14 h-14 rounded-full"
                />
              )}
            </View>
            

            {/* Message Info */}
            <View className="flex-1 flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-white font-semibold text-base mb-1">
                  {conv.username}
                </Text>
                <View className="flex-row items-center">
                  {conv.read ? (
                    <CheckCheck size={16} color="#00FF40" style={{ marginRight: 4 }} />
                  ) : (
                    <Check size={16} color="#6b7280" style={{ marginRight: 4 }} />
                  )}
                  <Text 
                    className={`text-sm ${conv.unread > 0 ? 'text-white font-medium' : 'text-gray-400'}`}
                    numberOfLines={1}
                  >
                    {conv.lastMessage}
                  </Text>
                </View>
              </View>

              {/* Time and Unread Badge */}
              <View className="items-end">
                <Text className="text-gray-400 text-xs mb-1">{conv.time}</Text>
                {conv.unread > 0 && (
                  <View className="bg-[#00FF40] rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-black text-xs font-bold">{conv.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
       

         <CreateGroup 
          setIsGroupModalVisible={() => {
            setModalVisible(false);
            setTimeout(() => setIsGroupModalVisible(true), 50);
          }} 
          visible={modalVisible} 
          onClose={() => setModalVisible(false)} 
        />

        <NewGroupModal
          visible={isGroupModalVisible}
          onClose={() => setIsGroupModalVisible(false)}
        />

    </View>
  );
}