// Quick check that Supabase is reachable and demo_messages exists.
// Needs a filled-in .env and the SQL migration already applied.
//
//   npm run smoke

import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function ok(message: string): void {
  console.log(`OK: ${message}`);
}

async function main(): Promise<void> {
  if (
    !url ||
    !publishableKey ||
    url.includes('YOUR_PROJECT') ||
    publishableKey.includes('YOUR_SUPABASE_PUBLISHABLE')
  ) {
    fail(
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (copy .env.example → .env).',
    );
  }

  const supabase = createClient(url, publishableKey);

  console.log('1) Read demo_messages…');
  const { data, error } = await supabase
    .from('demo_messages')
    .select('id, message, created_at')
    .order('id', { ascending: true });

  if (error) {
    fail(`${error.message} — did you run supabase/migrations/001_initial.sql?`);
  }

  if (!data || data.length === 0) {
    fail('demo_messages is empty — re-run the migration (it seeds a hello row).');
  }

  ok(`loaded ${data.length} row(s)`);
  for (const row of data) {
    console.log(`   #${row.id} ${row.message}`);
  }

  console.log('\nConnectivity smoke check passed.');
}

main().catch((err) => {
  fail(err instanceof Error ? err.message : String(err));
});
