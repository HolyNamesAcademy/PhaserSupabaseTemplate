import { isSupabaseConfigured, supabase } from './supabase';

// Helpers for talking to Supabase.
// Keep database calls here (or in new files next to this one), not inside Phaser scenes.

export type DemoMessage = {
  id: number;
  message: string;
  created_at: string;
};

function requireConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Copy .env.example to .env and add your project URL and publishable key.',
    );
  }
}

// Reads all rows from the demo_messages table.
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
