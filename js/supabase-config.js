// ============================================
// Coach4U — Supabase Configuration
// ============================================
// Replace these values with your Supabase project credentials.
// Find them at: https://supabase.com/dashboard → Your Project → Settings → API
//
// The anon key is safe to use in client-side code.
// It only grants access to what your Row Level Security (RLS) policies allow.

const SUPABASE_URL = 'https://uoixetfvboevjxlkfyqy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvaXhldGZ2Ym9ldmp4bGtmeXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDY2ODAsImV4cCI6MjA5MDQyMjY4MH0.ZXYJVdvcj70aGMH1FAixIr0hNCaCDSYLEL93hHVCGDU';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
