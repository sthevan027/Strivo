import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Camera, Circle, RefreshCw, RotateCw, Send, Type, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Alert, Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function StoryCamera() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const navigation = useRouter();


  const onCameraReady = () => {
    setIsCameraReady(true);
    console.log('Camera is ready!');
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    // Pequeno delay para garantir que a câmera reinicialize
    setTimeout(() => {
      setIsCameraReady(true);
    }, 100);
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        setCapturedPhoto(photo.uri);
        console.log('Photo captured:', photo.uri);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível capturar a foto');
      }
    }
  };

  const handlePost = () => {
    Alert.alert('Sucesso!', 'Story postado com sucesso!');
    console.log('Posting photo:', capturedPhoto);
    // Aqui você enviaria a foto para o servidor
    setCapturedPhoto(null); // Volta para a câmera
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleClose = () => {
    if (capturedPhoto) {
      setCapturedPhoto(null);
      navigation.back()
    } else {
       navigation.back()
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Carregando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6">
        <Text className="text-white text-center mb-4 text-base">
          Precisamos da sua permissão para acessar a câmera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Permitir Câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Câmera ou Preview em tela cheia */}
      {capturedPhoto ? (
        // Preview da foto capturada
        <Image 
          source={{ uri: capturedPhoto }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      ) : (
        // Câmera em tela cheia
        <View className="absolute inset-0 w-full h-full bg-black">
          <CameraView 
            key={facing}
            ref={cameraRef}
            style={{ flex: 1 }}
            facing={facing}
            onCameraReady={onCameraReady}
          />
        </View>
      )}

      {/* Header com foto e nome */}
      <View className="absolute top-0 left-0 right-0 z-20 px-4 pt-12 pb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            {/* Foto do usuário */}
            <View className="w-9 h-9 rounded-full bg-gray-700 items-center justify-center">
              <Text className="text-white text-sm font-medium">U</Text>
            </View>
            <Text className="text-white font-medium text-[15px]">Seu story</Text>
          </View>
          
          {/* Botão X */}
          <TouchableOpacity 
            onPress={handleClose}
            className="w-9 h-9 items-center justify-center"
          >
            <X color="white" size={26} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer com ferramentas */}
      <View className="absolute bottom-0 left-0 right-0 pb-8 px-4 bg-gradient-to-t from-black/60 to-transparent">
        {!capturedPhoto ? (
          // Modo Câmera
          <>
            {/* Ícones de ferramentas */}
            <View className="flex-row items-center justify-around mb-5">
              <TouchableOpacity className="items-center gap-1.5">
                <View className="w-11 h-11 items-center justify-center">
                  <Camera color="white" size={26} strokeWidth={2} />
                </View>
                <Text className="text-white text-xs">Efeitos</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={toggleCameraFacing}
                className="items-center gap-1.5"
              >
                <View className="w-11 h-11 items-center justify-center">
                  <RefreshCw color="white" size={26} strokeWidth={2} />
                </View>
                <Text className="text-white text-xs">Virar</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center gap-1.5">
                <View className="w-11 h-11 items-center justify-center">
                  <Circle color="white" size={26} strokeWidth={2} />
                </View>
                <Text className="text-white text-xs">Filtro</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center gap-1.5">
                <View className="w-11 h-11 items-center justify-center">
                  <Type color="white" size={26} strokeWidth={2} />
                </View>
                <Text className="text-white text-xs">Texto</Text>
              </TouchableOpacity>
            </View>

            {/* Botão para capturar foto */}
            <TouchableOpacity 
              onPress={handleCapture}
              className="bg-[#252525]  active:bg-[#7FFF00] rounded-full py-3.5 px-6 flex-row items-center justify-center"
            >
              <Camera color="white" size={18} strokeWidth={2} style={{ marginRight: 8 }} />
              <Text className="text-white font-semibold text-[15px]">Capturar</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Modo Preview
          <View className="gap-3">
            {/* Botão Postar */}
            <TouchableOpacity 
              onPress={handlePost}
              className="bg-blue-500 active:bg-blue-600 rounded-full py-3.5 px-6 flex-row items-center justify-center"
            >
              <Send color="white" size={18} strokeWidth={2} style={{ marginRight: 8 }} />
              <Text className="text-white font-semibold text-[15px]">Postar</Text>
            </TouchableOpacity>

            {/* Botão Tirar outra */}
            <TouchableOpacity 
              onPress={handleRetake}
              className="bg-[#1a1a1a] active:bg-[#252525] rounded-full py-3.5 px-6 flex-row items-center justify-center"
            >
              <RotateCw color="white" size={18} strokeWidth={2} style={{ marginRight: 8 }} />
              <Text className="text-white font-semibold text-[15px]">Tirar outra</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}