create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  language text not null default 'en',
  source_page text,
  country text,
  utm_source text,
  status text not null default 'pending',
  confirmation_token uuid unique default gen_random_uuid(),
  sequence_step integer not null default 0,
  next_send_at timestamptz,
  subscribed_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Service role manages subscribers" on public.newsletter_subscribers;
create policy "Service role manages subscribers"
  on public.newsletter_subscribers
  for all
  to service_role
  using (true)
  with check (true);
