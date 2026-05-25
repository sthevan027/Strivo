import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data
const todayNotifications = [
  {
    id: "1",
    type: "follow",
    user: {
      name: "021_isabella...",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    time: "1 h",
    isFollowing: false,
  },
];

const weekNotifications = [
  {
    id: "2",
    type: "like",
    user: {
      name: "flavio.zrx",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    contentThumb: "https://placehold.co/80x120",
    message: "curtiu o seu klip",
    time: "2 d",
  },
  {
    id: "3",
    type: "comment",
    user: {
      name: "mackcripto",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    contentThumb: "https://placehold.co/80x120",
    message: "comentou no seu klip",
    time: "3 d",
  },
];

export default function NotificationsScreen() {
  const [followState, setFollowState] = useState({});
  const navigation = useRouter();

  const handleFollow = (id) => {
    setFollowState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderFollow = (item) => (
    <View className="flex-row items-center justify-between py-3 px-4">
      <View className="flex-row items-center gap-3">
        <Image source={{ uri: item.user.avatar }} className="w-12 h-12 rounded-full" />
        <View>
          <Text className="text-white font-semibold">{item.user.name}</Text>
          <Text className="text-gray-400 text-sm">começou a seguir você. {item.time}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleFollow(item.id)}
        className={`px-3 py-1 rounded-lg ${followState[item.id] ? "bg-gray-700" : "bg-[#00FF40]"}`}
      >
        <Text className="font-bold text-black">{followState[item.id] ? "Seguindo" : "Seguir de Volta"}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInteraction = (item) => (
    <View className="flex-row items-center justify-between py-3 px-4">
      <View className="flex-row items-center gap-3 w-3/4">
        <Image source={{ uri: item.user.avatar }} className="w-12 h-12 rounded-full" />
        <View className="flex-1">
          <Text className="text-white font-semibold">{item.user.name} {item.message}</Text>
          <Text className="text-gray-400 text-sm">{item.time}</Text>
        </View>
      </View>
      <Image source={{ uri: item.contentThumb }} className="w-16 h-20 rounded-lg" />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between px-4 pb-3 border-b border-gray-800">
       <TouchableOpacity className="mr-3" onPress={() => navigation.back()}>
              <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>

        <Text className="text-white text-2xl font-semibold">Notificações</Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView>
        <Text className="text-white text-lg font-bold mt-4 px-4">Hoje</Text>
        {todayNotifications.map((item) => (
          <View key={item.id}>{renderFollow(item)}</View>
        ))}

        <Text className="text-white text-lg font-bold mt-6 px-4">Durante a semana</Text>
        {weekNotifications.map((item) => (
          <View key={item.id}>{renderInteraction(item)}</View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
