import CreateGroup from '@/src/components/create-group';
import { RingAvatar } from '@/src/components/strivo/RingAvatar';
import { colors, displayFont, radii } from '@/src/theme/strivo';
import { Conversation } from '@/src/utils/types/message';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, CheckCheck, Plus, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversation.id ? { ...conv, unread: 0 } : conv))
    );
    navigation.navigate('/screens/chat/chat-screen');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.back()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Mensagens</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Plus size={21} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchField}>
        <Search size={15} color={colors.textDim} />
        <TextInput
          placeholder="Pesquisar"
          placeholderTextColor={colors.textDim}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 40 }}
        renderItem={({ item: conv }) => (
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => handleConversationPress(conv)}>
            <RingAvatar uri={conv.avatar} size={52} ring={conv.hasStory ? "active" : "none"} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.convName} numberOfLines={1}>{conv.username}</Text>
              <View style={styles.lastMessageRow}>
                {conv.read ? (
                  <CheckCheck size={14} color={colors.accent} />
                ) : (
                  <Check size={14} color={colors.textDim} />
                )}
                <Text
                  style={[styles.lastMessage, conv.unread > 0 && styles.lastMessageUnread]}
                  numberOfLines={1}
                >
                  {conv.lastMessage}
                </Text>
              </View>
            </View>
            <View style={styles.metaCol}>
              <Text style={[styles.time, conv.unread > 0 && styles.timeUnread]}>{conv.time}</Text>
              {conv.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{conv.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 8 },
  title: { flex: 1, fontSize: 19, color: colors.textStrong, marginLeft: 4, ...displayFont },
  searchField: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 18, marginTop: 8, marginBottom: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 13, color: colors.text },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingVertical: 10 },
  convName: { fontSize: 14, fontWeight: "700", color: colors.textStrong },
  lastMessageRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  lastMessage: { fontSize: 12.5, color: colors.textDim, flexShrink: 1 },
  lastMessageUnread: { color: colors.text, fontWeight: "600" },
  metaCol: { alignItems: "flex-end", gap: 6, flexShrink: 0 },
  time: { fontSize: 11, color: colors.textDim },
  timeUnread: { color: colors.accent, fontWeight: "600" },
  unreadBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  unreadBadgeText: { fontSize: 10, fontWeight: "700", color: colors.bg },
});
