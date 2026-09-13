/**
 * End-to-end smoke test for the template service layer.
 * Requires a running Supabase project (.env with URL + anon key).
 *
 * Usage:
 *   npx tsx scripts/smoke-test.ts
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function ok(message: string): void {
  console.log(`OK: ${message}`);
}

async function main(): Promise<void> {
  if (!url || !anon || url.includes('YOUR_PROJECT') || anon.includes('YOUR_SUPABASE')) {
    fail('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (copy .env.example → .env).');
  }

  const supabase = createClient(url, anon);
  const email = `smoke_${Date.now()}@example.com`;
  const password = 'smoke-test-password-123';
  const username = `smoke_${Date.now().toString().slice(-6)}`;

  console.log('1) Register…');
  const signUp = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (signUp.error) fail(signUp.error.message);
  const user = signUp.data.user;
  if (!user) fail('No user returned from signUp (is email confirmation required?)');
  ok(`registered ${email}`);

  // Profile trigger may be briefly async
  await new Promise((r) => setTimeout(r, 500));

  console.log('2) Load profile…');
  const profile = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (profile.error) fail(profile.error.message);
  if (!profile.data) fail('Profile row missing — did you run 001_initial.sql?');
  ok(`profile username=${profile.data.username}`);

  console.log('3) Save score…');
  const scoreValue = 42;
  const scoreInsert = await supabase
    .from('scores')
    .insert({ user_id: user.id, score: scoreValue })
    .select('*')
    .single();
  if (scoreInsert.error) fail(scoreInsert.error.message);
  ok(`score ${scoreInsert.data.score} saved`);

  console.log('4) Save game blob…');
  const saveUpsert = await supabase.from('save_games').upsert(
    {
      user_id: user.id,
      data: { coinsCollected: scoreValue, bestRunScore: scoreValue },
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
  if (saveUpsert.error) fail(saveUpsert.error.message);
  ok('save_games upserted');

  console.log('5) Read high score + leaderboard…');
  const high = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', user.id)
    .order('score', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (high.error) fail(high.error.message);
  if (high.data?.score !== scoreValue)
    fail(`expected high score ${scoreValue}, got ${high.data?.score}`);
  ok(`high score=${high.data.score}`);

  const board = await supabase
    .from('scores')
    .select('score, profiles(username)')
    .order('score', { ascending: false })
    .limit(5);
  if (board.error) fail(board.error.message);
  ok(`leaderboard rows=${board.data?.length ?? 0}`);

  console.log('6) Sign out / sign in…');
  await supabase.auth.signOut();
  const signIn = await supabase.auth.signInWithPassword({ email, password });
  if (signIn.error) fail(signIn.error.message);
  ok('signed back in');

  console.log('7) Reload save…');
  const reload = await supabase
    .from('save_games')
    .select('data')
    .eq('user_id', user.id)
    .maybeSingle();
  if (reload.error) fail(reload.error.message);
  const data = reload.data?.data as { coinsCollected?: number } | null;
  if (data?.coinsCollected !== scoreValue) fail('persisted save data mismatch after re-login');
  ok('persisted data survived re-login');

  console.log('\nAll smoke checks passed.');
}

main().catch((err) => {
  fail(err instanceof Error ? err.message : String(err));
});
