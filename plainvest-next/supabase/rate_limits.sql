-- Lightweight per-key rate limiting for public endpoints (contact, newsletter).
-- Run this in the Supabase SQL editor. Only the service role touches this table
-- (RLS is enabled with no policies, so anon/authenticated clients are denied).

create table if not exists public.rate_limits (
  id           text primary key,         -- e.g. 'contact:1.2.3.4'
  count        int not null default 0,
  window_start timestamptz not null default now()
);

alter table public.rate_limits enable row level security;

-- Atomic check-and-increment. Returns true if the request is allowed, false if
-- the key has hit p_max within the current p_window_sec window. Row-level lock
-- (for update) makes it safe under concurrent serverless invocations.
create or replace function public.check_rate_limit(p_key text, p_max int, p_window_sec int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
  v_start timestamptz;
begin
  select count, window_start into v_count, v_start
  from public.rate_limits
  where id = p_key
  for update;

  -- No row yet, or the window has expired → start a fresh window.
  if not found or (now() - v_start) > make_interval(secs => p_window_sec) then
    insert into public.rate_limits (id, count, window_start)
    values (p_key, 1, now())
    on conflict (id) do update set count = 1, window_start = now();
    return true;
  end if;

  -- Within the window and already at/over the limit → block.
  if v_count >= p_max then
    return false;
  end if;

  update public.rate_limits set count = count + 1 where id = p_key;
  return true;
end;
$$;
