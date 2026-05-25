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

        const { data: sessionData } = await supabase.auth.getSession()
        const user = sessionData?.session?.user

        // 🔐 usuário não logado
        if (!user) {
          router.replace('/login')
          return
        }

        // 🔐 VERIFICA CONFIRMAÇÃO (CORRIGIDO TIPAGEM)
        const isConfirmed = (user as any)?.email_confirmed_at

        if (!isConfirmed) {
          router.replace('/verify-email')
          return
        }

        const metadata = user.user_metadata

        // 🔎 verifica se já existe profile (sem quebrar)
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()

        // 🔥 só cria se não existir
        if (!existingProfile) {
          const { error } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              nome: metadata?.full_name || '',
              age: metadata?.age ? Number(metadata.age) : null,
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