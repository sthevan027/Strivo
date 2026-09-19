import { colors, displayFont, radii } from '@/src/theme/strivo';
import { User } from '@/src/utils/types/message';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


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

  const handleUserPress = (_user: User) => {
    navigation.navigate('/screens/chat/chat-screen');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.push('/screens/chat/message-screen')}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Nova conversa</Text>
      </View>

      <View style={styles.searchField}>
        <Search size={15} color={colors.textDim} />
        <TextInput
          placeholder="Buscar usuários..."
          placeholderTextColor={colors.textDim}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          autoFocus
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(u) => String(u.id)}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.centerText}>Nenhum usuário encontrado</Text>
          </View>
        }
        renderItem={({ item: user }) => (
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => handleUserPress(user)}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{user.username}</Text>
              <Text style={styles.userHint}>Toque para conversar</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 14 },
  title: { fontSize: 18, color: colors.textStrong, ...displayFont },
  searchField: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 18, marginBottom: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: 14, paddingVertical: 11 },
  searchInput: { flex: 1, fontSize: 13.5, color: colors.text },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 80 },
  centerText: { color: colors.textDim },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingVertical: 10 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  userName: { fontSize: 14, fontWeight: "700", color: colors.textStrong },
  userHint: { fontSize: 12, color: colors.textDim, marginTop: 2 },
});
