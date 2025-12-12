import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function StepThree({ data, setData, onBack, onFinish }) {
  const [confirm, setConfirm] = useState("");

  const valid =
    data.password.length >= 6 &&
    confirm.length >= 6 &&
    confirm === data.password;

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-zinc-500 mb-1 ml-1 text-sm font-medium">
          Senha
        </Text>
        <TextInput
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor="#52525b"
          className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white"
          value={data.password}
          onChangeText={(t) => setData({ ...data, password: t })}
        />
      </View>

      <View>
        <Text className="text-zinc-500 mb-1 ml-1 text-sm font-medium">
          Confirmar senha
        </Text>
        <TextInput
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor="#52525b"
          className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white"
          value={confirm}
          onChangeText={setConfirm}
        />
      </View>

      <TouchableOpacity
        disabled={!valid}
        onPress={onFinish}
        className={`w-full h-14 rounded-xl items-center justify-center ${
          valid ? "bg-green-600" : "bg-zinc-800"
        }`}
      >
        <Text className="text-white font-bold text-lg">Finalizar</Text>
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
