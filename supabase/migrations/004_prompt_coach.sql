-- CE — prompt coach usage limits (used by the `prompt-coach` Edge Function).
-- Stores only a daily counter per one-way hashed visitor key (never an IP address) plus one global counter,
-- so a public page cannot run up the Claude bill. Rows older than two days are removed automatically.

create table if not exists private.coach_usage (
  day date not null,
  key text not null,
  count integer not null default 0,
  primary key (day, key)
);
alter table private.coach_usage enable row level security;

-- Counts one request and says whether it is allowed (per visitor and in total, per day).
create or replace function public.coach_hit(p_key text, p_per_key integer, p_global integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  total integer;
  mine integer;
begin
  delete from private.coach_usage where day < current_date - 2;

  insert into private.coach_usage (day, key, count) values (current_date, '*', 1)
  on conflict (day, key) do update set count = private.coach_usage.count + 1
  returning count into total;
  if total > p_global then
    return false;
  end if;

  insert into private.coach_usage (day, key, count) values (current_date, p_key, 1)
  on conflict (day, key) do update set count = private.coach_usage.count + 1
  returning count into mine;
  return mine <= p_per_key;
end;
$$;

-- only the Edge Function (service role) may call it — not visitors
revoke all on function public.coach_hit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.coach_hit(text, integer, integer) to service_role;
