 import { router } from 'expo-router'
import { useState } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { supabase } from '../src/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleLogin() {
    setErrorMsg('')

    // 1️⃣ valida campos
    if (!email.trim() || !senha.trim()) {
      setErrorMsg('Preencha email e senha')
      return
    }

    setLoading(true)

    // 2️⃣ login no Supabase Auth
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    })

    setLoading(false)

    // 3️⃣ erro de login
    if (error) {
      setErrorMsg('Usuário ou senha incorretos')
      return
    }

    // ✅ sucesso
   router.replace('/home')
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.logo}>S</Text>
        <Text style={styles.title}>Strivo</Text>
        <Text style={styles.subtitle}>Entrar na sua conta</Text>

        {errorMsg !== '' && (
          <Text style={styles.error}>{errorMsg}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#777"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Não tem uma conta?{' '}
          <Text
            style={styles.linkGreen}
            onPress={() => router.push('/login')}
          >
            Inscrever-se
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    color: '#4CAF50',
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    color: '#4CAF50',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    color: '#ff5555',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 16,
    color: '#FFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
  },
  linkGreen: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
})
