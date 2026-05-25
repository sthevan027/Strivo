import { ArrowLeft, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Definição de cores personalizadas para referência (assumindo que estão no tailwind.config.js)
// '[#39FF14]': '#39FF14'
// 'custom-red': '#FF3939'

interface NewGroupScreenProps {
  onBack: () => void;
  onAddMembers: () => void;
}

const NewGroupScreen: React.FC<NewGroupScreenProps> = ({ onBack, onAddMembers }) => {
  const [groupName, setGroupName] = useState('');

  // Mock de dados para a seção "Adicionar"
  const addOption = {
    id: 'add',
    title: 'Adicionar Membros',
    icon: Users, // Ícone de pessoas para adicionar membros
    action: onAddMembers,
  };

  const IconComponent = addOption.icon;


  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="bg-black">
        {/* Header Personalizado */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
          <TouchableOpacity onPress={onBack} className="p-2">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Novo Grupo</Text>
          <View className="w-8" /> {/* Espaçador para centralizar o título */}
        </View>

        {/* Campo de Nome do Grupo */}
        <View className="p-4">
          <TextInput
            className="text-lg text-[#39FF14] border-b border-[#39FF14] pb-2"
            placeholder="Nome do grupo"
            placeholderTextColor={'#39FF14'}
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        {/* Seção Adicionar Membros */}
        <TouchableOpacity
          onPress={addOption.action}
          className="flex-row items-center p-4 mt-4"
        >
          {/* Ícone sem fundo branco/borda */}
          <View className="w-12 h-12 rounded-full items-center justify-center bg-transparent mr-4">
            <IconComponent size={28} color={'#39FF14'} />
          </View>
          
          {/* Texto "Adicionar Membros" */}
          <Text className="text-lg font-semibold text-white">
            {addOption.title}
          </Text>
        </TouchableOpacity>

        {/* A lista de membros adicionados (se houver) viria aqui, mas por enquanto é apenas a opção de adicionar */}
        <View className="flex-1" />
      </SafeAreaView>
    </View>
  );
};

export default NewGroupScreen;
