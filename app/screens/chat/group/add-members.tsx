import React, { useState } from 'react';
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import UserListItem from './user-list';

// Definição de cores personalizadas para referência (assumindo que estão no tailwind.config.js)
// '[#39FF14]': '#39FF14'
// 'red-500': '#FF3939'

interface User {
  id: string;
  name: string;
  status: string;
  avatarUrl: string;
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Flávio Silva', status: 'Family is complicated, but love will...', avatarUrl: '' },
  { id: '2', name: 'Marcos', status: 'Obrigado Deus por tudo!!!', avatarUrl: '' },
  { id: '3', name: 'Gb', status: 'Online', avatarUrl: '' },
  { id: '4', name: 'Ana Carolina', status: 'Estudando React Native', avatarUrl: '' },
  { id: '5', name: 'Sthevan', status: 'Digitando...', avatarUrl: '' },
  { id: '6', name: 'Adriana', status: 'O mundo vai sempre girar.', avatarUrl: '' },
  { id: '7', name: 'Sandra', status: 'Disponível', avatarUrl: '' },
  // Adicione mais usuários mockados para simular a lista
  { id: '8', name: 'João', status: 'Trabalhando', avatarUrl: '' },
  { id: '9', name: 'Maria', status: 'Em reunião', avatarUrl: '' },
  { id: '10', name: 'Pedro', status: 'No cinema', avatarUrl: '' },
];

interface AddMembersScreenProps {
  onCancel: () => void;
  onAdvance: (selectedMembers: User[]) => void;
}

const AddMembersScreen: React.FC<AddMembersScreenProps> = ({ onCancel, onAdvance }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const toggleUserSelection = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) return;

    setSelectedUsers(prev => {
      if (prev.some(u => u.id === userId)) {
        return prev.filter(u => u.id !== userId);
      } else {
        return [...prev, user];
      }
    });
  };

  const filteredUsers = MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1 bg-black">
        {/* Header Personalizado */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
          <TouchableOpacity onPress={onCancel} className="p-2">
            <Text className="text-red-500 text-lg font-semibold">Cancelar</Text>
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-white">Adicionar membros</Text>
          
          <TouchableOpacity 
            onPress={() => onAdvance(selectedUsers)} 
            className="p-2"
            disabled={selectedUsers.length === 0}
          >
            <Text 
              className={`text-lg font-semibold ${
                selectedUsers.length > 0 ? 'text-[#39FF14]' : 'text-gray-600'
              }`}
            >
              Avançar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barra de Pesquisa */}
        <View className="p-4">
          <TextInput
            className="text-lg text-[#39FF14] border-b border-[#39FF14] pb-2"
            placeholder="Pesquisar Usuário..."
            placeholderTextColor={ '#39FF14' }
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Lista de Usuários */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserListItem
              user={item}
              isSelected={selectedUsers.some(u => u.id === item.id)}
              onToggle={toggleUserSelection}
            />
          )}
          // Remove o alfabeto lateral e o espaçamento extra entre os itens
          ItemSeparatorComponent={() => <View className="h-px bg-gray-800 mx-4" />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </SafeAreaView>
    </View>
  );
};

export default AddMembersScreen;
