-- Projects II Game Template — initial schema
-- Apply this in the Supabase SQL Editor (Dashboard → SQL → New query),
-- or with the Supabase CLI: supabase db push / supabase migration up
--
-- Concepts this file demonstrates:
--   - Relational tables with primary/foreign keys
--   - Ownership via auth.users / profiles
--   - Row Level Security (authorization)
--   - Public read for shared leaderboard data

-- ---------------------------------------------------------------------------
-- profiles: one row per authenticated user
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now(),
  constraint username_length check (char_length(username) between 1 and 24)
);

alter table public.profiles enable row level security;

create policy "Profiles are readable by everyone"
  on public.profiles
  for select
  to authenticated, anon
  using (true);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Automatically create a profile when a user signs up.
-- Username comes from auth metadata set during signUp().
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- scores: each play can insert a score owned by the signed-in user
-- ---------------------------------------------------------------------------
create table if not exists public.scores (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  score integer not null check (score >= 0),
  created_at timestamptz not null default now()
);

create index if not exists scores_user_id_idx on public.scores (user_id);
create index if not exists scores_score_desc_idx on public.scores (score desc);

alter table public.scores enable row level security;

-- Shared leaderboard: anyone can read scores
create policy "Scores are readable by everyone"
  on public.scores
  for select
  to authenticated, anon
  using (true);

-- Private write: you may only insert rows for yourself
create policy "Users can insert their own scores"
  on public.scores
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Private update/delete: you may only change your own rows
create policy "Users can update their own scores"
  on public.scores
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own scores"
  on public.scores
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- save_games: optional jsonb blob for game-specific state
-- ---------------------------------------------------------------------------
create table if not exists public.save_games (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.save_games enable row level security;

create policy "Users can read their own save games"
  on public.save_games
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own save games"
  on public.save_games
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own save games"
  on public.save_games
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own save games"
  on public.save_games
  for delete
  to authenticated
  using (auth.uid() = user_id);
