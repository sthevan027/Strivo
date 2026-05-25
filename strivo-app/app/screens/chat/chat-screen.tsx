import { Conversation, Message } from '@/src/utils/types/message';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCheck, MoreVertical, Phone, Send, StickerIcon, Video } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MessageActionsMenu from './messa-actions-menu';


export default function ChatScreen() {
  const  conversation:Conversation = {
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

  const navigation = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>(conversation.messages || []);
  const [inputText, setInputText] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  const openMenu = (msg: Message) => {
  setSelectedMessage(msg);
  setShowActions(true);
 };

  

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        sender: 'me'
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
  
  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-black"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="px-4 pt-12 pb-3 bg-[#1F2C34] border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity className="mr-3" onPress={() => navigation.back()}>
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            
            {/* Avatar */}
            {conversation.hasStory ? (
              <View className="rounded-full p-0.5 bg-[#00FF40] mr-3">
                <View className="rounded-full p-0.5 bg-gray-900">
                  <Image
                    source={{ uri: conversation.avatar }}
                    className="w-10 h-10 rounded-full"
                  />
                </View>
              </View>
            ) : (
              <Image
                source={{ uri: conversation.avatar }}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}

            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                {conversation.username}
              </Text>
              <Text className="text-gray-400 text-xs">Online</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4">
            <TouchableOpacity>
              <Phone size={22} color="#00FF40" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Video size={22} color="#00FF40" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MoreVertical size={22} color="#00FF40" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((message) => (
          <TouchableOpacity
            key={message.id}
            activeOpacity={0.9}
            onLongPress={() => openMenu(message)}
            delayLongPress={200}
            className={`mb-3 max-w-[75%] ${
              message.sender === 'me' ? 'self-end' : 'self-start'
            }`}
          >
            <View
              className={`px-4 py-2 rounded-2xl ${
                message.sender === 'me'
                  ? 'bg-[#00FF40] rounded-br-md'
                  : 'bg-gray-800 rounded-bl-md'
              }`}
            >
              <Text className="text-white text-base">{message.text}</Text>
            </View>
            <View className={`flex-row items-center mt-1 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <Text className="text-gray-500 text-xs mr-1">{message.time}</Text>
              {message.sender === 'me' && (
                <CheckCheck size={14} color="#00FF40" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View className="px-4 py-3 bg-gray-900 border-t border-gray-800">
        <View className="flex-row items-start  bg-[#25292e] rounded-full px-4 py-2 mb-4">
          <TextInput
            placeholder="Escreva uma mensagem..."
            placeholderTextColor="#39FF14"
            value={inputText}
            onChangeText={setInputText}
            className="flex-1 text-white text-base mr-3 "
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={() => {}}
            disabled={!inputText.trim()}
            className={`w-10 h-10 mr-2 rounded-full flex items-center bg-gray-700 justify-center text-center `}
          >
            <StickerIcon size={18} color={'#6b7280'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-center ${
              inputText.trim() ? 'bg-[#00FF40]' : 'bg-gray-700'
            }`}
          >
            <Send size={18} color={inputText.trim() ? '#000000' : '#6b7280'} />
          </TouchableOpacity>
        </View>
      </View>
      <MessageActionsMenu
        visible={showActions}
        onClose={() => setShowActions(false)}
        onReply={() => {
          console.log("Responder", selectedMessage);
          setShowActions(false);
        }}
        onShare={() => {
          console.log("Compartilhar");
          setShowActions(false);
        }}
        onDeleteForYou={() => {
          console.log("Apagar pra você");
          setShowActions(false);
        }}
        onDeleteForAll={() => {
          console.log("Apagar para todos");
          setShowActions(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}
