import { api } from "@/src/lib/api";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ArrowLeft, Image as ImageIcon, Video } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UploadResponse {
  mediaId: number;
  path: string;
  signedUploadUrl: string;
  token: string;
}

export default function CreatePostScreen() {
  const router = useRouter();
  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  async function pickMedia(type: "image" | "video") {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
    });
    if (!result.canceled) setMedia(result.assets[0]);
  }

  async function handlePost() {
    if (!media) return Alert.alert("Selecione uma mídia");
    setLoading(true);
    try {
      const isVideo = media.type === "video";
      const kind: "photo" | "video" = isVideo ? "video" : "photo";
      const mimeType = isVideo ? "video/mp4" : "image/jpeg";
      const size = media.fileSize ?? 1024 * 1024;

      // Passo 1: obter URL assinada do backend
      const uploadRes = await api.post<UploadResponse>("/posts/uploads", {
        kind,
        mimeType,
        size,
      });

      // Passo 2: enviar arquivo via URL assinada
      const blob = await (await fetch(media.uri)).blob();
      const uploadResult = await fetch(uploadRes.signedUploadUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": mimeType },
      });
      if (!uploadResult.ok) throw new Error("Falha no upload do arquivo");

      // Passo 3: criar o post
      await api.post("/posts", { caption, mediaIds: [uploadRes.mediaId] });

      Alert.alert("Post criado com sucesso 🚀");
      router.back();
    } catch (err: any) {
      console.log(err);
      Alert.alert("Erro", err.message ?? "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={26} />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg">Criar conteúdo</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* CONTEÚDO */}
      <View className="flex-1 flex-row">
        {/* PREVIEW */}
        <View className="flex-1 justify-center items-center px-3">
          <View className="bg-zinc-900 rounded-3xl overflow-hidden w-full aspect-[4/5] items-center justify-center">
            {media ? (
              <Image source={{ uri: media.uri }} className="w-full h-full" />
            ) : (
              <Text className="text-gray-500">Preview aqui</Text>
            )}
          </View>
        </View>

        {/* LATERAL */}
        <View className="w-[140px] bg-zinc-900 p-3 rounded-l-3xl">
          <TouchableOpacity
            onPress={() => pickMedia("image")}
            className="mb-4 bg-zinc-800 p-3 rounded-xl items-center"
          >
            <ImageIcon color="#00FF40" size={20} />
            <Text className="text-white text-xs mt-1">Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickMedia("video")}
            className="mb-4 bg-zinc-800 p-3 rounded-xl items-center"
          >
            <Video color="#00FF40" size={20} />
            <Text className="text-white text-xs mt-1">Vídeo</Text>
          </TouchableOpacity>

          <Text className="text-gray-400 text-xs mb-1">Legenda</Text>
          <TextInput
            placeholder="Digite..."
            placeholderTextColor="#666"
            value={caption}
            onChangeText={setCaption}
            multiline
            className="text-white text-sm bg-zinc-800 p-2 rounded-xl"
          />
        </View>
      </View>

      {/* BOTÃO */}
      <View className="p-4">
        <TouchableOpacity
          onPress={handlePost}
          disabled={loading}
          className="bg-[#00FF40] py-4 rounded-2xl items-center"
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-black font-bold">Publicar agora</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
