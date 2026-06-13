import { createClient } from '@supabase/supabase-js';

// Replace these with the actual values from your Supabase API settings
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);