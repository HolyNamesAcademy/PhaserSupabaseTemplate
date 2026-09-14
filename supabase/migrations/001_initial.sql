-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- It creates a small demo table so you can confirm your project is connected.
-- Replace or extend this later with tables for your actual game.

create table if not exists public.demo_messages (
  id bigint generated always as identity primary key,
  message text not null,
  created_at timestamptz not null default now()
);

-- Needed when "Automatically expose new tables" is off in project settings.
grant usage on schema public to anon, authenticated;
grant select on table public.demo_messages to anon, authenticated;

alter table public.demo_messages enable row level security;

-- Anyone can read demo messages (fine for this setup check).
drop policy if exists "Demo messages are publicly readable" on public.demo_messages;
create policy "Demo messages are publicly readable"
  on public.demo_messages
  for select
  to anon, authenticated
  using (true);

-- Add a starter row if the table is empty.
insert into public.demo_messages (message)
select 'Hello from Supabase!'
where not exists (select 1 from public.demo_messages);
