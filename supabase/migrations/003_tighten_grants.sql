-- CE — defence in depth: Row Level Security already blocks these, but the API roles should not even hold the privileges.
-- Public read-only tables (written only by triggers):
revoke insert, update, delete, truncate on public.leaderboard, public.lesson_stats from anon, authenticated;
revoke insert, update, delete, truncate on public.weekly_leaderboard from anon, authenticated;
-- Feedback is write-only for visitors:
revoke select, update, delete, truncate on public.lesson_feedback from anon, authenticated;
-- Personal tables are for signed-in users only:
revoke all on public.progress, public.profiles from anon;
