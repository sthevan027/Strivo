import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ofddlmiiklxqprvqfvxv.supabase.co'  // Use a URL correta do seu projeto
const SUPABASE_ANON_KEY = 'sb_publishable_QRo5senCCtkmWo-o9Zyb5w_P9KqT0MS'  // Sua chave pública

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)
