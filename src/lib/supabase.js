import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cdjoeytslknugtvamylc.supabase.co'
const supabaseAnonKey = 'sb_publishable_SLitDjf6p-h01uQ_BWMb7w_A7sWaXz7'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)