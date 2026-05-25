import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface User {
  id: string;
  name: string;
  status: string;
  avatarUrl: string;
}

interface UserListItemProps {
  user: User;
  isSelected: boolean;
  onToggle: (userId: string) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, isSelected, onToggle }) => {

  return (
    <TouchableOpacity
      onPress={() => onToggle(user.id)}
      className="flex-row items-center p-3 active:bg-gray-800"
    >
      {/* Avatar */}
      <View className="w-12 h-12 rounded-full bg-gray-700 mr-4 overflow-hidden items-center justify-center">
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} className="w-full h-full" />
        ) : (
          <Text className="text-white text-xl font-bold">{user.name ? user.name[0] : ''}</Text>
        )}
      </View>

      {/* Nome e Status */}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-white">{user.name}</Text>
        <Text className="text-sm text-gray-400">{user.status}</Text>
      </View>

      {/* Checkbox (Círculo) */}
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          isSelected
            ? 'border-[#39FF14] bg-[#39FF14]'
            : 'border-gray-500'
        }`}
      >
        {isSelected && (
          <Text className="text-black text-xs font-bold">✓</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default UserListItem;
