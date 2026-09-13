import { isSupabaseConfigured, supabase } from './supabase';

export type Profile = {
  id: string;
  username: string;
  created_at: string;
};

export type ScoreRow = {
  id: number;
  user_id: string;
  score: number;
  created_at: string;
};

export type LeaderboardEntry = {
  username: string;
  score: number;
  created_at: string;
};

export type SaveGameData = {
  coinsCollected: number;
  bestRunScore: number;
};

function requireConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Copy .env.example to .env and add your project values.',
    );
  }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  requireConfigured();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getHighScore(userId: string): Promise<number> {
  requireConfigured();

  const { data, error } = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', userId)
    .order('score', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.score ?? 0;
}

export async function saveScore(userId: string, score: number): Promise<ScoreRow> {
  requireConfigured();

  const { data, error } = await supabase
    .from('scores')
    .insert({ user_id: userId, score })
    .select('id, user_id, score, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  requireConfigured();

  const { data, error } = await supabase
    .from('scores')
    .select('score, created_at, profiles(username)')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const profiles = row.profiles as { username: string } | { username: string }[] | null;
    const username = Array.isArray(profiles)
      ? (profiles[0]?.username ?? 'Unknown')
      : (profiles?.username ?? 'Unknown');

    return {
      username,
      score: row.score as number,
      created_at: row.created_at as string,
    };
  });
}

export async function loadGame(userId: string): Promise<SaveGameData | null> {
  requireConfigured();

  const { data, error } = await supabase
    .from('save_games')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.data) {
    return null;
  }

  return data.data as SaveGameData;
}

export async function saveGame(userId: string, gameData: SaveGameData): Promise<void> {
  requireConfigured();

  const { error } = await supabase.from('save_games').upsert(
    {
      user_id: userId,
      data: gameData,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    throw new Error(error.message);
  }
}
