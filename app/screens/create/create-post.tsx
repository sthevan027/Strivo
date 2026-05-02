import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { ArrowLeft, Image as ImageIcon, Send, Video } from 'lucide-react-native'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../../src/lib/supabase'

export default function CreatePostScreen() {
  const router = useRouter()

  const [media, setMedia] = useState<any>(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCaption, setShowCaption] = useState(false)

  // 📸 PICK MEDIA
  async function pickMedia(type: 'image' | 'video') {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) return Alert.alert('Permissão necessária')

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    })

    if (!result.canceled) {
      const file = result.assets[0]

      // 🔥 adiciona tipo manual (IMPORTANTE)
      file.type = type

      setMedia(file)
    }
  }

  // 🚀 POST
  async function handlePost() {
    if (!media) return Alert.alert('Selecione uma mídia')

    setLoading(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) {
        Alert.alert('Usuário não autenticado')
        return
      }

      const fileExt = media.uri.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      // converter
      const blob = await (await fetch(media.uri)).blob()

      // 📤 upload
      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, blob, {
          contentType:
            media.type === 'video' ? 'video/mp4' : 'image/jpeg',
        })

      if (uploadError) {
        console.log(uploadError)
        Alert.alert('Erro no upload')
        return
      }

      // 🔗 pegar URL
      const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(fileName)

      const publicUrl = data.publicUrl

      // 💾 INSERT NA TABELA
      const { error: dbError } = await supabase.from('posts').insert({
        user_id: user.id,
        content: caption,
        media_url: publicUrl,
        media_type: media.type === 'video' ? 'video' : 'image',
        likes: 0,
      })

      if (dbError) {
        console.log(dbError)
        Alert.alert('Erro ao salvar no banco')
        return
      }

      Alert.alert('Post publicado 🚀')
      router.back()

    } catch (e) {
      console.log(e)
      Alert.alert('Erro inesperado')
    }

    setLoading(false)
  }

  return (
    <SafeAreaView className="flex-1 bg-black">

      <View className="flex-1">

        {/* PREVIEW */}
        {media ? (
          <Image
            source={{ uri: media.uri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-lg">
              Escolha uma mídia
            </Text>
          </View>
        )}

        {/* HEADER */}
        <View className="absolute top-0 left-0 right-0 px-5 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* CAPTION */}
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

        {/* TOOLBAR */}
        <View className="absolute bottom-24 left-0 right-0 flex-row justify-center gap-6">

          <TouchableOpacity onPress={() => pickMedia('image')} className="items-center">
            <View className="bg-black/70 p-4 rounded-full">
              <ImageIcon size={22} color="#00FF40" />
            </View>
            <Text className="text-white text-xs mt-1">Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => pickMedia('video')} className="items-center">
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

        {/* BOTÃO PUBLICAR */}
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
              <Text className="text-black font-bold">
                Publicar
              </Text>
            </>
          )}
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  )
}