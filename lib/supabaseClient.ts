import { createClient } from '@supabase/supabase-js';

// The URL from your screenshot (e.g., https://your-id.supabase.co)
const supabaseUrl = 'https://mgprbrstoubhcuzegkqw.supabase.co'; 

// The 'anon (public)' key from your screenshot (starts with eyJ...)
const supabaseAnonKey = 'sb_publishable_5Qfu6PA8c3hG-_R65j3E1A_RMKGkTVu'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);