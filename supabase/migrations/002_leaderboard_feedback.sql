-- CE — opt-in weekly leaderboard and lesson feedback.
-- Privacy by design: nobody can read another learner's progress. The leaderboard only holds a display name and
-- daily XP of learners who turned it on, and it is written only by the triggers below (never directly by clients).

-- ---------- Progress policies: signed-in users only, auth.uid() evaluated once per query (faster) ----------
drop policy if exists "Read own progress" on public.progress;
drop policy if exists "Insert own progress" on public.progress;
drop policy if exists "Update own progress" on public.progress;
drop policy if exists "Delete own progress" on public.progress;
create policy "Read own progress" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own progress" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own progress" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own progress" on public.progress
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Helpers live in a schema the API does not expose, so they cannot be called over REST/RPC.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- ---------- Profiles: a display name and the leaderboard switch (off by default) ----------
create table if not exists public.profiles (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 24 and display_name !~ '[[:cntrl:]]'),
  show_on_leaderboard boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own profile" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own profile" on public.profiles
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------- Leaderboard: public projection, opted-in learners only ----------
create table if not exists public.leaderboard (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  -- the last 14 days of XP, one key per day ("YYYY-MM-DD"), each day capped at 500
  xp_by_day jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.leaderboard enable row level security;

create policy "Anyone can read the leaderboard" on public.leaderboard
  for select to anon, authenticated using (true);
-- no insert / update / delete policies: only the triggers write here

create or replace function private.refresh_leaderboard(uid uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  name text;
  opted boolean;
  days jsonb;
begin
  select p.display_name, p.show_on_leaderboard into name, opted from public.profiles p where p.user_id = uid;
  if not coalesce(opted, false) then
    delete from public.leaderboard where user_id = uid;
    return;
  end if;

  select coalesce(jsonb_object_agg(e.key, least(e.value::int, 500)), '{}'::jsonb)
    into days
    from public.progress pr,
         jsonb_each_text(case when jsonb_typeof(pr.data -> 'pe:xp') = 'object' then pr.data -> 'pe:xp' else '{}'::jsonb end) e
   where pr.user_id = uid
     and e.key ~ '^\d{4}-\d{2}-\d{2}$'
     and e.value ~ '^\d{1,6}$'
     and e.key >= to_char(current_date - 13, 'YYYY-MM-DD');

  insert into public.leaderboard (user_id, display_name, xp_by_day, updated_at)
  values (uid, name, days, now())
  on conflict (user_id) do update
    set display_name = excluded.display_name, xp_by_day = excluded.xp_by_day, updated_at = now();
end;
$$;

create or replace function private.on_learner_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.refresh_leaderboard(new.user_id);
  return new;
end;
$$;

revoke all on function private.refresh_leaderboard(uuid) from public, anon, authenticated;
revoke all on function private.on_learner_change() from public, anon, authenticated;

drop trigger if exists leaderboard_on_progress on public.progress;
create trigger leaderboard_on_progress
  after insert or update of data on public.progress
  for each row execute function private.on_learner_change();

drop trigger if exists leaderboard_on_profile on public.profiles;
create trigger leaderboard_on_profile
  after insert or update on public.profiles
  for each row execute function private.on_learner_change();

-- XP of the last 7 days, ranked. Runs with the caller's rights (it only sees the public leaderboard table).
create or replace view public.weekly_leaderboard
with (security_invoker = true) as
select
  rank() over (order by w.xp desc) as rank,
  w.display_name,
  w.xp,
  w.user_id = (select auth.uid()) as is_me
from (
  select
    l.user_id,
    l.display_name,
    coalesce((
      select sum(e.value::int)
      from jsonb_each_text(l.xp_by_day) e
      where e.key >= to_char(current_date - 6, 'YYYY-MM-DD') and e.value ~ '^\d{1,6}$'
    ), 0)::int as xp
  from public.leaderboard l
) w
where w.xp > 0;

-- ---------- Lesson feedback: "Was this lesson helpful?" (anyone may answer, nobody can read answers via the API) ----------
create table if not exists public.lesson_feedback (
  id bigint generated always as identity primary key,
  lesson_id text not null check (lesson_id ~ '^[a-z0-9-]{1,64}$'),
  helpful boolean not null,
  comment text check (comment is null or char_length(comment) <= 500),
  user_id uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.lesson_feedback enable row level security;

create policy "Anyone can send lesson feedback" on public.lesson_feedback
  for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));
-- no select policy: answers are read by the site owner in the Supabase dashboard

create index if not exists lesson_feedback_lesson_idx on public.lesson_feedback (lesson_id);
create index if not exists lesson_feedback_user_idx on public.lesson_feedback (user_id);

-- Public counts per lesson ("92% found this helpful"), kept up to date by a trigger.
create table if not exists public.lesson_stats (
  lesson_id text primary key,
  helpful integer not null default 0,
  not_helpful integer not null default 0
);

alter table public.lesson_stats enable row level security;

create policy "Anyone can read lesson stats" on public.lesson_stats
  for select to anon, authenticated using (true);

create or replace function private.count_feedback()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.lesson_stats as s (lesson_id, helpful, not_helpful)
  values (new.lesson_id, case when new.helpful then 1 else 0 end, case when new.helpful then 0 else 1 end)
  on conflict (lesson_id) do update
    set helpful = s.helpful + excluded.helpful, not_helpful = s.not_helpful + excluded.not_helpful;
  return new;
end;
$$;

revoke all on function private.count_feedback() from public, anon, authenticated;

drop trigger if exists lesson_stats_on_feedback on public.lesson_feedback;
create trigger lesson_stats_on_feedback
  after insert on public.lesson_feedback
  for each row execute function private.count_feedback();
