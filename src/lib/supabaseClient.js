import { createClient } from '@supabase/supabase-js'

// Ensure these are set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: { 
      'x-app-name': 'UniClubs',
      'Access-Control-Allow-Origin': '*'
    },
  }
});