import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { supabase } from '../lib/supabase'

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [modoCadastro, setModoCadastro] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')

  async function entrar() {
    if (!email || !senha) {
      setMensagem('Preencha e-mail e senha')
      return
    }

    setLoading(true)
    setMensagem('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    setLoading(false)

    if (error) {
      setMensagem(error.message)
    } else {
      router.push('/screens/feed')
    }
  }

  async function criarConta() {
    if (!email || !senha) {
      setMensagem('Preencha e-mail e senha')
      return
    }

    setLoading(true)
    setMensagem('')

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    setLoading(false)

    if (error) {
      setMensagem(error.message)
    } else {
      setMensagem('Conta criada com sucesso! Faça login.')
      setModoCadastro(false)
    }
  }

  async function recuperarSenha() {
    if (!email) {
      setMensagem('Digite seu e-mail para recuperar a senha')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      setMensagem(error.message)
    } else {
      setMensagem('E-mail de recuperação enviado')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Strivo</Text>

      <View style={styles.loginBox}>
        <Text style={styles.titulo}>
          {modoCadastro ? 'Criar Conta' : 'Login Strivo'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#777"
          keyboardType="email-address"
          autoCapitalize="none"
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

        {!modoCadastro && (
          <TouchableOpacity onPress={recuperarSenha}>
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={modoCadastro ? criarConta : entrar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.textoBotao}>
              {modoCadastro ? 'Criar conta' : 'Entrar'}
            </Text>
          )}
        </TouchableOpacity>

        {mensagem !== '' && <Text style={styles.mensagem}>{mensagem}</Text>}

        <View style={styles.divisor} />

        <Text style={styles.textoConta}>
          {modoCadastro ? 'Já possui conta?' : 'Não tem uma conta?'}
        </Text>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => {
            setModoCadastro(!modoCadastro)
            setMensagem('')
          }}
        >
          <Text style={styles.textoBotaoSecundario}>
            {modoCadastro ? 'Voltar ao login' : 'Criar conta'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.rodape}>© 2024 Strivo • Versão 1.0.0</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  logo: {
    color: '#41ff6a',
    fontSize: 46,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  loginBox: {
    backgroundColor: '#111',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },

  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },

  input: {
    backgroundColor: '#1b1b1b',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#2d2d2d',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 16,
  },

  link: {
    color: '#41ff6a',
    textAlign: 'right',
    marginBottom: 22,
    fontSize: 14,
  },

  botaoPrincipal: {
    backgroundColor: '#41ff6a',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  textoBotao: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
  },

  mensagem: {
    color: '#41ff6a',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },

  divisor: {
    height: 1,
    backgroundColor: '#2d2d2d',
    marginVertical: 24,
  },

  textoConta: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 14,
    fontSize: 15,
  },

  botaoSecundario: {
    borderWidth: 1,
    borderColor: '#41ff6a',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  textoBotaoSecundario: {
    color: '#41ff6a',
    fontSize: 16,
    fontWeight: 'bold',
  },

  rodape: {
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 12,
  },
})