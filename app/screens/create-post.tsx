import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { ArrowLeft, Image as ImageIcon, Video } from 'lucide-react-native'
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
import { supabase } from '../../src/lib/supabase'

export default function CreatePostScreen() {
  const router = useRouter()

  const [media, setMedia] = useState<any>(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)

  async function pickMedia(type: 'image' | 'video') {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permissão necessária')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
    })

    if (!result.canceled) setMedia(result.assets[0])
  }

  async function handlePost() {
    if (!media) return Alert.alert('Selecione uma mídia')

    setLoading(true)

    try {
      // 🔥 pega usuário REAL
      const { data: userData, error: userError } =
        await supabase.auth.getUser()

      if (userError || !userData.user) {
        Alert.alert('Erro ao obter usuário')
        setLoading(false)
        return
      }

      const user = userData.user

      // 🔥 GARANTE PROFILE (ESSENCIAL)
      await supabase.from('profiles').upsert({
        id: user.id,
        nome: user.email || 'Usuário',
      })

      // 🔥 arquivo organizado por usuário
      const fileExt = media.uri.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const response = await fetch(media.uri)
      const blob = await response.blob()

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, blob)

      if (uploadError) {
        console.log(uploadError)
        Alert.alert('Erro ao enviar mídia')
        setLoading(false)
        return
      }

      // 🔥 URL pública
      const { data: publicData } = supabase.storage
        .from('posts')
        .getPublicUrl(fileName)

      const mediaType = media.type === 'video' ? 'video' : 'image'

      // 🔥 cria post
      const { error: postError } = await supabase.from('posts').insert({
        user_id: user.id,
        content: caption,
        media_url: publicData.publicUrl,
        media_type: mediaType,
      })

      if (postError) {
        console.log(postError)
        Alert.alert('Erro ao criar post')
        setLoading(false)
        return
      }

      Alert.alert('Post criado com sucesso 🚀')
      router.back()

    } catch (err) {
      console.log(err)
      Alert.alert('Erro inesperado')
    }

    setLoading(false)
  }

  return (
    <SafeAreaView className="flex-1 bg-black">

      {/* HEADER */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={26} />
        </TouchableOpacity>

        <Text className="text-white font-bold text-lg">
          Criar conteúdo
        </Text>

        <View style={{ width: 26 }} />
      </View>

      {/* CONTEÚDO */}
      <View className="flex-1 flex-row">

        {/* PREVIEW */}
        <View className="flex-1 justify-center items-center px-3">
          <View className="bg-zinc-900 rounded-3xl overflow-hidden w-full aspect-[4/5] items-center justify-center">

            {media ? (
              <Image
                source={{ uri: media.uri }}
                className="w-full h-full"
              />
            ) : (
              <Text className="text-gray-500">
                Preview aqui
              </Text>
            )}

          </View>
        </View>

        {/* LATERAL */}
        <View className="w-[140px] bg-zinc-900 p-3 rounded-l-3xl">

          <TouchableOpacity
            onPress={() => pickMedia('image')}
            className="mb-4 bg-zinc-800 p-3 rounded-xl items-center"
          >
            <ImageIcon color="#00FF40" size={20} />
            <Text className="text-white text-xs mt-1">Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickMedia('video')}
            className="mb-4 bg-zinc-800 p-3 rounded-xl items-center"
          >
            <Video color="#00FF40" size={20} />
            <Text className="text-white text-xs mt-1">Vídeo</Text>
          </TouchableOpacity>

          <Text className="text-gray-400 text-xs mb-1">
            Legenda
          </Text>

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
            <Text className="text-black font-bold">
              Publicar agora
            </Text>
          )}
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}