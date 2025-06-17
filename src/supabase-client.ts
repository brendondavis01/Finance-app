import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iwdinufisnvxtlvygqht.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZGludWZpc252eHRsdnlncWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzc4NjUsImV4cCI6MjA2NTcxMzg2NX0.FA9zhVuTrjWzT9ieMSDn5KSMRzQxew1MxSoqC72Ier4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)