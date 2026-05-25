import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SupportCreatorScreen = () => {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');

  const amounts = ['R$ 5', 'R$ 10', 'R$ 50', 'Outro'];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Header com seta verde neon */}
          <TouchableOpacity className="py-4">
            <Ionicons name="arrow-back" size={28} color="#7FFF00" />
          </TouchableOpacity>

          {/* Avatar */}
          <View className="items-center mb-4">
            <View className="w-28 h-28 rounded-full bg-gray-800 items-center justify-center overflow-hidden">
              <Text className="text-6xl">👤</Text>
            </View>
          </View>

          {/* Nome do criador */}
          <Text className="text-xl font-bold text-center text-white mb-8">
            Strivo
          </Text>

          {/* Título Apoiar */}
          <Text className="text-3xl font-bold text-white mb-1">
            Apoiar
          </Text>
          <Text className="text-gray-400 text-sm mb-4">Escolha um valor</Text>

          {/* Valores em linha */}
          <View className="flex-row justify-between mb-4">
            {amounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => {
                  setSelectedAmount(amount);
                  if (amount !== 'Outro') {
                    setCustomAmount('');
                  }
                }}
                className={`px-5 py-2.5 rounded-lg border-2 ${
                  selectedAmount === amount
                    ? 'border-[#7FFF00] bg-[#7FFF00]/10'
                    : 'border-gray-700 bg-black'
                }`}
              >
                <Text className="text-white font-medium text-sm">
                  {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input de valor customizado */}
          {selectedAmount === 'Outro' && (
            <View className="mb-4">
              <TextInput
                value={customAmount}
                onChangeText={setCustomAmount}
                placeholder="R$ 0,00"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                autoFocus
              />
            </View>
          )}

          {/* Botão Apoiar Agora */}
          <TouchableOpacity className="w-full bg-[#7FFF00] rounded-lg py-3.5 mb-4">
            <Text className="text-black font-bold text-center text-base">
              Apoiar Agora
            </Text>
          </TouchableOpacity>

          {/* Input de mensagem */}
          <View className="mb-6">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Escreva uma mensagem"
              placeholderTextColor="#6B7280"
              multiline
              className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-4 py-3"
              style={{ minHeight: 40 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SupportCreatorScreen;