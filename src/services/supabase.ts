import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Creates the Supabase client using the public project URL and publishable key.
// Never put the secret key in this file or in VITE_ environment variables.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabasePublishableKey &&
      !supabaseUrl.includes('YOUR_PROJECT_REF') &&
      !supabasePublishableKey.includes('YOUR_SUPABASE_PUBLISHABLE'),
  );
}

function createSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    // Dummy client so the app can still load before .env is filled in.
    return createClient('https://example.supabase.co', 'public-publishable-key');
  }

  return createClient(supabaseUrl, supabasePublishableKey);
}

export const supabase = createSupabaseClient();
