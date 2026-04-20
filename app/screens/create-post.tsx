import { supabase } from '@/src/lib/supabase'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

export default function CreatePost() {
  const router = useRouter()

  const [image, setImage] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)

  // 📸 escolher imagem
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Libere acesso à galeria')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 5],
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  // 🚀 postar
  const handlePost = async () => {
    if (!image) {
      Alert.alert('Erro', 'Selecione uma imagem')
      return
    }

    setLoading(true)

    try {
      // 🔐 usuário logado
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) throw new Error('Usuário não logado')

      const fileName = `${user.id}_${Date.now()}.jpg`

      // ✅ CONVERTE PARA BLOB (ESSENCIAL NO EXPO)
      const response = await fetch(image)
      const blob = await response.blob()

      // 🔥 IMPORTANTE: CONFERE O NOME DO BUCKET
      const bucket = 'avatars' // ⚠️ MUDA SE PRECISAR

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
        })

      if (uploadError) {
        console.log('ERRO UPLOAD:', uploadError)
        throw uploadError
      }

      // 🌍 pegar URL pública
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      const mediaUrl = data.publicUrl

      // 💾 salvar no banco
      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            content: caption,
            media_url: mediaUrl,
            media_type: 'image',
          },
        ])

      if (insertError) {
        console.log('ERRO INSERT:', insertError)
        throw insertError
      }

      Alert.alert('Sucesso 🚀', 'Post criado com sucesso!')
      router.back()

    } catch (err: any) {
      console.log('ERRO GERAL:', err)
      Alert.alert('Erro', err.message || 'Erro ao postar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 16,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>
          Novo Post
        </Text>

        <TouchableOpacity onPress={handlePost}>
          {loading ? (
            <ActivityIndicator color="#00FF40" />
          ) : (
            <Text style={{ color: '#00FF40', fontWeight: 'bold' }}>
              Publicar
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* IMAGEM */}
      <TouchableOpacity
        onPress={pickImage}
        style={{
          height: 300,
          backgroundColor: '#111',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 16,
          borderRadius: 12,
        }}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: '100%', height: '100%', borderRadius: 12 }}
          />
        ) : (
          <Text style={{ color: '#888' }}>
            Selecionar imagem
          </Text>
        )}
      </TouchableOpacity>

      {/* LEGENDA */}
      <TextInput
        placeholder="Escreva uma legenda..."
        placeholderTextColor="#666"
        value={caption}
        onChangeText={setCaption}
        style={{
          color: '#fff',
          padding: 16,
        }}
        multiline
      />
    </SafeAreaView>
  )
}