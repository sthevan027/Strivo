import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cdjoeytslknugtvamylc.supabase.co'  // Use a URL correta do seu projeto
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkam9leXRzbGtudWd0dmFteWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3OTczNjUsImV4cCI6MjA4OTM3MzM2NX0.wla5-PAvK7vTRkanClWGIa8r6H2zRU1J_sO4OxPlFWs'  // Sua chave pública

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)
