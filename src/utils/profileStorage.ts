import { supabase } from '@/src/lib/supabase'

export async function loadProfileData() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.log('Erro auth ou usuário não logado:', authError)
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .limit(1)

  if (error) {
    console.log('Erro ao carregar profile:', error)
    return null
  }

  if (!data || data.length === 0) {
    return null
  }

  return data[0]
}
