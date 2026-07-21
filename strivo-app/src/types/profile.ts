// Linha da tabela public.user_profile (ver supabase/setup.sql).
// email não é coluna do banco: vem da sessão (auth.users).
export interface Profile {
  id: string
  name: string
  username: string | null
  bio: string | null
  avatar: string | null
  phone: string | null
  created_at?: string
  updated_at?: string
}

// Colunas expostas pela view public.user_profile_public,
// usada para ler perfis de outros usuários (sem phone).
export type PublicProfile = Omit<Profile, 'phone' | 'updated_at'>
