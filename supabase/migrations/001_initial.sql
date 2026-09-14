-- Projects II Game Template — connectivity demo schema
--
-- Apply this in the Supabase SQL Editor (Dashboard → SQL → New query),
-- or with the Supabase CLI during local development.
--
-- Purpose: prove that your computer, .env, and Supabase project are wired up.
-- This is NOT your game database. Students replace/extend this for auth,
-- profiles, scores, saves, and anything their game actually needs.

create table if not exists public.demo_messages (
  id bigint generated always as identity primary key,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.demo_messages enable row level security;

-- Public read so the starter can work before anyone builds Auth.
create policy "Demo messages are publicly readable"
  on public.demo_messages
  for select
  to anon, authenticated
  using (true);

-- Seed one row the Phaser demo can display.
insert into public.demo_messages (message)
select 'Hello from Supabase!'
where not exists (select 1 from public.demo_messages);
