// ============================================
// Coach4U — Supabase Configuration
// ============================================
// Replace these values with your Supabase project credentials.
// Find them at: https://supabase.com/dashboard → Your Project → Settings → API
//
// The anon key is safe to use in client-side code.
// It only grants access to what your Row Level Security (RLS) policies allow.

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
