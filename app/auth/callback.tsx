import { supabase } from '@/src/lib/supabase'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    async function handleAuth() {
      try {
        await supabase.auth.refreshSession()

        const { data } = await supabase.auth.getUser()
        const user = data?.user

        // 🔐 usuário não logado
        if (!user) {
          router.replace('/login')
          return
        }

        // 🔐 verifica confirmação (SEM ERRO DE TIPAGEM)
        const isConfirmed = (user as any)?.email_confirmed_at

        if (!isConfirmed) {
          router.replace('/verify-email')
          return
        }

        // 📦 dados do cadastro
        const metadata = user.user_metadata

        // 🔎 verifica se já existe profile (SEM quebrar se não existir)
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()

        // =========================
        // 🔥 só cria se não existir
        // =========================
        if (!existingProfile) {
          const { error } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              nome: metadata?.full_name || '',
              age: Number(metadata?.age) || null,
              phone: metadata?.phone || '',
              avatar_url: null,
            })

          if (error) {
            console.log('Erro ao salvar profile:', error)
          }
        }

        // 🚀 entra no app
        router.replace('/home')

      } catch (err) {
        console.log('Erro no callback:', err)
        router.replace('/login')
      }
    }

    handleAuth()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  )
}