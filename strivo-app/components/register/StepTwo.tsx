import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function StepTwo({ data, setData, onNext, onBack }) {
  const valid = data.email.includes("@");

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-zinc-500 mb-1 ml-1 text-sm font-medium">
          Email
        </Text>
        <TextInput
          placeholder="exemplo@email.com"
          placeholderTextColor="#52525b"
          className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white"
          value={data.email}
          onChangeText={(t) => setData({ ...data, email: t })}
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

      <TouchableOpacity
        onPress={onBack}
        className="items-center mt-2"
      >
        <Text className="text-zinc-500">Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
