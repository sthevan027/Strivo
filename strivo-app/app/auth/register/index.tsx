import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import StepOne from "../../../components/register/StepOne";
import StepTwo from "../../../components/register/StepTwo";
import StepThree from "../../../components/register/StepThree";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function prevStep() {
    setStep((prev) => prev - 1);
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <StatusBar style="light" />

      <ScrollView
        className="px-6"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        {/* Header */}
        <View className="items-center mb-10">
          <Text className="text-green-500 text-5xl font-bold tracking-tight">
            Strivo
          </Text>
          <Text className="text-zinc-400 text-lg mt-2">Criar sua conta</Text>
        </View>

        {/* Stepper textual */}
        <View className="flex-row justify-center mb-8">
          <Text className="text-zinc-500">{`Etapa ${step} de 3`}</Text>
        </View>

        {/* Conteúdo do passo */}
        {step === 1 && (
          <StepOne data={formData} setData={setFormData} onNext={nextStep} />
        )}

        {step === 2 && (
          <StepTwo
            data={formData}
            setData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 3 && (
          <StepThree
            data={formData}
            onBack={prevStep}
            onFinish={() => router.push("/auth/login")}
          />
        )}

        {/* Voltar ao login */}
        <View className="flex-row justify-center mt-10">
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text className="text-zinc-500">Já tem conta? </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
