import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser-safe Supabase client.
 *
 * Only the anon/public key belongs here. Never put the service_role key
 * in Vite env vars or client code — that key bypasses Row Level Security.
 */
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
    // Create a client with placeholders so imports never crash before setup.
    // Auth/data calls will fail clearly until .env is configured.
    return createClient('https://example.supabase.co', 'public-anon-key');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();
