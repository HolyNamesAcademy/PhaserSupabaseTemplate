import { isSupabaseConfigured, supabase } from './supabase';

/**
 * Thin service helpers for the connectivity demo.
 *
 * Scenes should call these functions rather than building Supabase queries
 * inline. When you add Auth, scores, saves, etc., put those helpers in new
 * files next to this one (for example auth.ts, gameData.ts).
 */

export type DemoMessage = {
  id: number;
  message: string;
  created_at: string;
};

function requireConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Copy .env.example to .env and add your project URL and anon key.',
    );
  }
}

/** Read rows from the stub demo_messages table. */
export async function getDemoMessages(): Promise<DemoMessage[]> {
  requireConfigured();

  const { data, error } = await supabase
    .from('demo_messages')
    .select('id, message, created_at')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
