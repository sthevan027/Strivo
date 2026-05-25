import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  avatar: string;
  badge?: string;
  isVerified?: boolean;
}

const LiveChatScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      username: 'game kkkk',
      message: '',
      avatar: '',
    },
    {
      id: '2',
      username: 'Mateus Vlogs',
      message: 'Sou mesmo',
      avatar: '',
    },
    {
      id: '3',
      username: 'Erick Gusmao',
      message: 'e nem é metinha do bem',
      avatar: '',
      badge: '#3',
    },
    {
      id: '4',
      username: 'Nilson Mira',
      message: 'vdd..',
      avatar: '',
    },
    {
      id: '5',
      username: 'Keelgtarp',
      message: 'Salve',
      avatar: '',
      isVerified: true,
    },
    {
      id: '6',
      username: 'BartoLomeu',
      message: 'crashei dnv kkkkkkkkkkkkkk',
      avatar: '',
    },
    {
      id: '7',
      username: 'MB MOSQUITO SAMP kkkk',
      message: 'Eu sou um meta game!',
      avatar: '',
    },
    {
      id: '8',
      username: 'Erick Gusmao',
      message: 'ox',
      avatar: '',
      badge: '#3',
    },
    {
      id: '9',
      username: 'BartoLomeu',
      message: 'meu deus ta impossivel',
      avatar: '',
    },
  ]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: 'Você',
        message: message.trim(),
        avatar: '',
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Video Area */}
      <View className="w-full aspect-video bg-gray-900 relative justify-center items-center">
        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-gray-800 items-center justify-center mb-4 border-2 border-gray-700">
            <Text className="text-5xl">👤</Text>
          </View>
        </View>

        {/* QR Code */}
        <View className="absolute bottom-4 left-4 bg-white p-2 rounded">
          <View className="w-16 h-16 bg-black items-center justify-center">
            <Text className="text-white text-xs">QR</Text>
          </View>
        </View>

        {/* Progress Bar - Verde neon no final */}
        <View className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
          <View className="h-full w-full bg-[#7FFF00]" />
        </View>
      </View>

      {/* Chat Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">
            Chat ao vivo
          </Text>
          <View className="flex-row items-center mt-1">
            <View className="flex-row items-center">
              <Ionicons name="people" size={12} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs ml-1">238 assistindo</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
         <TouchableOpacity 
              className="bg-[#7FFF00] px-4 py-2 rounded-lg"
              onPress={() => router.navigate('/screens/suport-creator')} // Adicione esta linha
            >
              <Text className="text-black font-semibold text-sm">
                Apoie o Criador
              </Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {messages.map((msg) => (
          <View key={msg.id} className="flex-row mb-3">
            <View className="flex-1">
              <View className="flex-row items-center flex-wrap">
                <Text className="text-[#00FF40] font-semibold text-sm mr-2">
                  {msg.username}
                </Text>
                
                {msg.message && (
                  <Text className="text-white text-sm flex-1">
                    {msg.message}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Chat Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View className="flex-row items-center px-4 py-3 bg-gray-900 border-t border-gray-800">
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Chat..."
            placeholderTextColor="#6B7280"
            className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white text-sm mr-2"
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
        </View>
      </KeyboardAvoidingView>


    </SafeAreaView>
  );
};

export default LiveChatScreen;