import { supabase } from '@/src/lib/supabase'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

export default function RegisterScreen() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setAvatar(result.assets[0].uri)
    }
  }

  async function handleRegister() {
    if (!fullName || !age || !phone || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos')
      return
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres')
      return
    }

    setLoading(true)

    /* =======================
       1️⃣ AUTH
    ======================= */
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    if (error || !data.user) {
      setLoading(false)
      Alert.alert('Erro', error?.message || 'Erro ao criar usuário')
      return
    }

    const userId = data.user.id

    let avatarUrl: string | null = null

    /* =======================
       2️⃣ AVATAR
    ======================= */
    if (avatar) {
      const response = await fetch(avatar)
      const blob = await response.blob()

      const fileName = `${userId}.jpg`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          upsert: true,
          contentType: 'image/jpeg',
        })

      if (uploadError) {
        setLoading(false)
        Alert.alert('Erro', 'Erro ao enviar a foto')
        return
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      avatarUrl = urlData.publicUrl
    }

    /* =======================
       3️⃣ INSERT PROFILE
    ======================= */
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: fullName,
        age: Number(age),
        phone,
        email,
        avatar_url: avatarUrl,
      })

    setLoading(false)

    if (profileError) {
      Alert.alert('Erro ao salvar perfil', profileError.message)
      return
    }

    /* =======================
       4️⃣ SUCESSO
    ======================= */
    Alert.alert('Sucesso 🎉', 'Conta criada com sucesso!', [
      {
        text: 'OK',
        onPress: () => router.replace('/auth/login'),
      },
    ])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarText}>Adicionar foto</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Idade"
        placeholderTextColor="#888"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        placeholderTextColor="#888"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha (mín. 6 caracteres)"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Criar conta</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

/* =======================
   STYLES (INALTERADO)
======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#38c172',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  avatarText: {
    color: '#38c172',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  button: {
    backgroundColor: '#38c172',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
})