import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function StepOne({ data, setData, onNext }) {
  const valid = data.fullName.trim().length > 2;

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-zinc-500 mb-1 ml-1 text-sm font-medium">
          Nome completo
        </Text>
        <TextInput
          placeholder="Seu nome"
          placeholderTextColor="#52525b"
          className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white"
          value={data.fullName}
          onChangeText={(t) => setData({ ...data, fullName: t })}
        />
      </View>

      <TouchableOpacity
        disabled={!valid}
        onPress={onNext}
        className={`w-full h-14 rounded-xl items-center justify-center ${
          valid ? "bg-green-600" : "bg-zinc-800"
        }`}
      >
        <Text className="text-white font-bold text-lg">Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}
