import { RingAvatar } from '@/src/components/strivo/RingAvatar';
import { colors, displayFont, radii } from '@/src/theme/strivo';
import { Conversation, Message } from '@/src/utils/types/message';
import { useRouter } from 'expo-router';
import { ArrowLeft, MoreVertical, Phone, Send, Video } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MessageActionsMenu from './messa-actions-menu';


export default function ChatScreen() {
  const conversation: Conversation = {
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
  };

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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.back()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <RingAvatar uri={conversation.avatar} size={34} ring={conversation.hasStory ? "active" : "none"} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.name} numberOfLines={1}>{conversation.username}</Text>
          <Text style={styles.status}>ativa agora</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Phone size={19} color={colors.text} strokeWidth={1.7} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Video size={20} color={colors.text} strokeWidth={1.7} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MoreVertical size={20} color={colors.textDim} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <TouchableOpacity
            key={message.id}
            activeOpacity={0.9}
            onLongPress={() => openMenu(message)}
            delayLongPress={200}
            style={[styles.bubbleWrap, message.sender === 'me' ? styles.bubbleWrapMe : styles.bubbleWrapThem]}
          >
            <View style={[styles.bubble, message.sender === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
              <Text style={message.sender === 'me' ? styles.bubbleTextMe : styles.bubbleText}>{message.text}</Text>
            </View>
            <Text style={[styles.messageTime, message.sender === 'me' && { alignSelf: 'flex-end' }]}>{message.time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <View style={styles.inputField}>
          <TextInput
            placeholder="Mensagem..."
            placeholderTextColor={colors.textDim}
            value={inputText}
            onChangeText={setInputText}
            style={styles.textInput}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim()}
          style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
        >
          <Send size={17} color={inputText.trim() ? colors.bg : colors.textDim} />
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingTop: 54, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.divider },
  name: { fontSize: 14.5, color: colors.textStrong, ...displayFont },
  status: { fontSize: 11, color: colors.accent, marginTop: 1 },
  headerIcon: { marginRight: 4 },
  messagesContent: { padding: 14, gap: 10 },
  bubbleWrap: { maxWidth: "74%", marginBottom: 6 },
  bubbleWrapMe: { alignSelf: "flex-end" },
  bubbleWrapThem: { alignSelf: "flex-start" },
  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleThem: { backgroundColor: colors.bubbleIn, borderBottomLeftRadius: 4 },
  bubbleMe: { backgroundColor: colors.bubbleOut, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 13.5, lineHeight: 18, color: colors.text },
  bubbleTextMe: { fontSize: 13.5, lineHeight: 18, color: colors.bubbleOutText },
  messageTime: { fontSize: 10.5, color: colors.textDim, marginTop: 4 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 18, borderTopWidth: 1, borderTopColor: colors.divider },
  inputField: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.pill, paddingHorizontal: 14, paddingVertical: 10 },
  textInput: { fontSize: 13.5, color: colors.text, maxHeight: 100 },
  sendButton: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceAlt },
  sendButtonActive: { backgroundColor: colors.accent },
});
