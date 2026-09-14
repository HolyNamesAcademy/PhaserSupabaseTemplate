import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Creates the Supabase client using the public project URL and anon key.
// Never put the service_role key in this file or in VITE_ environment variables.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('YOUR_PROJECT_REF') &&
    !supabaseAnonKey.includes('YOUR_SUPABASE_ANON'),
  );
}

function createSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    // Dummy client so the app can still load before .env is filled in.
    return createClient('https://example.supabase.co', 'public-anon-key');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();
