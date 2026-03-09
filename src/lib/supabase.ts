import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: ReturnType<typeof createClient> = supabaseEnabled
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any)
