create table if not exists public.member_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  premium_status text not null default 'inactive',
  access_started_at timestamptz,
  access_expires_at timestamptz,
  stripe_customer_id text,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.member_access enable row level security;

drop policy if exists "Members can read their own premium access" on public.member_access;
create policy "Members can read their own premium access"
on public.member_access
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Service role can manage member access" on public.member_access;
create policy "Service role can manage member access"
on public.member_access
for all
to service_role
using (true)
with check (true);
