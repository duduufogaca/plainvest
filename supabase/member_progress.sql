-- Member progress (opened guides, favourites, last guide, milestone flags).
-- Tied to the account so it survives logout/login and syncs across devices/hubs.
-- Run this in the Supabase SQL editor.

create table if not exists public.member_progress (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  read_guides       text[]      not null default '{}',
  starred           text[]      not null default '{}',
  last_guide        text,
  sim_run           boolean     not null default false,
  projection_run    boolean     not null default false,
  portfolio_added   boolean     not null default false,
  updated_at        timestamptz not null default now()
);

alter table public.member_progress enable row level security;

drop policy if exists "own progress: select" on public.member_progress;
drop policy if exists "own progress: insert" on public.member_progress;
drop policy if exists "own progress: update" on public.member_progress;

create policy "own progress: select" on public.member_progress
  for select using (auth.uid() = user_id);
create policy "own progress: insert" on public.member_progress
  for insert with check (auth.uid() = user_id);
create policy "own progress: update" on public.member_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
