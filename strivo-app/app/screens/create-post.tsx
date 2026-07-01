import { supabase } from "@/src/lib/supabase";
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

export default function CreatePostScreen() {
  const router = useRouter();
  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  async function pickMedia(type: "image" | "video") {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert("Permissão necessária"); return; }
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

      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(path);
      if (signedError || !signedData) throw new Error(signedError?.message ?? "Erro ao gerar URL de upload");

      const { data: mediaRow, error: mediaError } = await supabase
        .from("media")
        .insert({ owner_id: userId, bucket, path, kind, mime_type: mimeType, size, status: "pending" })
        .select("id")
        .single();
      if (mediaError) throw new Error(mediaError.message);

      const blob = await (await fetch(media.uri)).blob();
      const uploadResult = await fetch(signedData.signedUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": mimeType },
      });
      if (!uploadResult.ok) throw new Error("Falha no upload do arquivo");

      await supabase.from("media").update({ status: "ready" }).eq("id", mediaRow.id);

      const { data: postRow, error: postError } = await supabase
        .from("posts")
        .insert({ author_id: userId, caption: caption.trim() || null })
        .select("id")
        .single();
      if (postError) throw new Error(postError.message);

      await supabase.from("post_media").insert({ post_id: postRow.id, media_id: mediaRow.id, order: 0 });

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
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={26} />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg">Criar conteúdo</Text>
        <View style={{ width: 26 }} />
      </View>

      <View className="flex-1 flex-row">
        <View className="flex-1 justify-center items-center px-3">
          <View className="bg-zinc-900 rounded-3xl overflow-hidden w-full aspect-[4/5] items-center justify-center">
            {media ? (
              <Image source={{ uri: media.uri }} className="w-full h-full" />
            ) : (
              <Text className="text-gray-500">Preview aqui</Text>
            )}
          </View>
        </View>

        <View className="w-[140px] bg-zinc-900 p-3 rounded-l-3xl">
          <TouchableOpacity onPress={() => pickMedia("image")} className="mb-4 bg-zinc-800 p-3 rounded-xl items-center">
            <ImageIcon color="#00FF40" size={20} />
            <Text className="text-white text-xs mt-1">Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pickMedia("video")} className="mb-4 bg-zinc-800 p-3 rounded-xl items-center">
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
