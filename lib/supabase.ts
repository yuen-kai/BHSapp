import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mvfdwktreukpbcypbrvy.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZmR3a3RyZXVrcGJjeXBicnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMjIxODksImV4cCI6MjA1MDg5ODE4OX0.XMlutI6XFlPkbB6Qn3j85putZdpmRM_eWK6vxhZtblM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})