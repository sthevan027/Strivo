import { supabase } from "@/src/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Image as ImageIcon,
  Send,
  Video,
} from "lucide-react-native";
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

export default function CreatePostScreen() {
  const router = useRouter();
  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCaption, setShowCaption] = useState(false);

  async function pickMedia(type: "image" | "video") {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permissão necessária");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.canceled) setMedia(result.assets[0]);
  }

  async function handlePost() {
    if (!media) return Alert.alert("Selecione uma mídia");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Não autenticado");
      const userId = session.user.id;

      const isVideo = media.type === "video";
      const kind: "photo" | "video" = isVideo ? "video" : "photo";
      const mimeType = isVideo ? "video/mp4" : "image/jpeg";
      const ext = isVideo ? "mp4" : "jpg";
      const size = media.fileSize ?? 1024 * 1024;
      const bucket = "posts";

      const now = new Date();
      const path = `users/${userId}/posts/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${Date.now()}.${ext}`;

      // Passo 1: criar registro de media e obter URL assinada
      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(path);
      if (signedError || !signedData) throw new Error(signedError?.message ?? "Erro ao gerar URL de upload");

      // Passo 2: inserir registro de media no banco
      const { data: mediaRow, error: mediaError } = await supabase
        .from("media")
        .insert({ owner_id: userId, bucket, path, kind, mime_type: mimeType, size, status: "pending" })
        .select("id")
        .single();
      if (mediaError) throw new Error(mediaError.message);

      // Passo 3: enviar arquivo para o Supabase Storage
      const blob = await (await fetch(media.uri)).blob();
      const uploadResult = await fetch(signedData.signedUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": mimeType },
      });
      if (!uploadResult.ok) throw new Error("Falha no upload do arquivo");

      // Passo 4: atualizar status da media para 'ready'
      await supabase.from("media").update({ status: "ready" }).eq("id", mediaRow.id);

      // Passo 5: criar o post e vincular a media
      const { data: postRow, error: postError } = await supabase
        .from("posts")
        .insert({ author_id: userId, caption: caption.trim() || null })
        .select("id")
        .single();
      if (postError) throw new Error(postError.message);

      await supabase.from("post_media").insert({ post_id: postRow.id, media_id: mediaRow.id, order: 0 });

      Alert.alert("Post publicado 🚀");
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
      <View className="flex-1">
        {media ? (
          <Image source={{ uri: media.uri }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-lg">Escolha uma mídia</Text>
          </View>
        )}

        <View className="absolute top-0 left-0 right-0 px-5 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {showCaption && (
          <View className="absolute bottom-32 left-4 right-4 bg-black/70 rounded-2xl p-4">
            <TextInput
              placeholder="Escreva algo..."
              placeholderTextColor="#aaa"
              value={caption}
              onChangeText={setCaption}
              className="text-white text-lg"
              multiline
            />
          </View>
        )}

        <View className="absolute bottom-24 left-0 right-0 flex-row justify-center gap-6">
          <TouchableOpacity onPress={() => pickMedia("image")} className="items-center">
            <View className="bg-black/70 p-4 rounded-full">
              <ImageIcon size={22} color="#00FF40" />
            </View>
            <Text className="text-white text-xs mt-1">Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pickMedia("video")} className="items-center">
            <View className="bg-black/70 p-4 rounded-full">
              <Video size={22} color="#00FF40" />
            </View>
            <Text className="text-white text-xs mt-1">Vídeo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowCaption(!showCaption)} className="items-center">
            <View className="bg-black/70 p-4 rounded-full">
              <Text className="text-white text-lg">Aa</Text>
            </View>
            <Text className="text-white text-xs mt-1">Texto</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handlePost}
          disabled={loading}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#00FF40] px-10 py-4 rounded-full flex-row items-center gap-2"
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Send size={18} color="#000" />
              <Text className="text-black font-bold">Publicar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
