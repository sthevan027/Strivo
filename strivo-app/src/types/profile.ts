export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  email: string | null
  avatar_url: string | null
  created_at?: string
  updated_at?: string
}
