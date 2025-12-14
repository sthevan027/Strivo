import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";

export const unstable_settings = {
  headerShown: false,
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-10">
            <Text className="text-green-500 text-5xl font-bold tracking-tight mb-2">
              Strivo
            </Text>
            <Text className="text-zinc-400 text-lg">
              Entrar na sua conta
            </Text>
          </View>
          <View className="space-y-4">
            <View>
              <Text className="text-zinc-500 mb-1 ml-1 text-sm font-medium">
                Email
              </Text>
              <TextInput
                placeholder="exemplo@email.com"
                placeholderTextColor="#52525b"
                className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-zinc-500 mb-1 ml-1 text-sm font-medium">
                Senha
              </Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#52525b"
                className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity className="w-full h-14 bg-green-600 rounded-xl items-center justify-center mt-2 active:bg-green-700">
              <Text className="text-white font-bold text-lg">Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center mt-2">
              <Text className="text-zinc-500 text-sm">Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-[1px] bg-zinc-800" />
            <Text className="text-zinc-600 mx-4 text-xs uppercase font-bold">
              Ou continue com
            </Text>
            <View className="flex-1 h-[1px] bg-zinc-800" />
          </View>

          <View className="mb-8">
            <TouchableOpacity className="w-full h-14 flex-row bg-zinc-900 border border-zinc-800 rounded-xl items-center justify-center active:bg-zinc-800">
              <AntDesign name="google" size={24} color="white" />
              <Text className="text-white font-medium ml-2">
                Continuar com Google
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center pb-8">
            <Text className="text-zinc-400">Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text className="text-green-500 font-bold">Inscrever-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
