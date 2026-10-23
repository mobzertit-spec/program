import { rest } from './supabase'

/** Community features backed by Supabase (tables and security rules: supabase/migrations/002_leaderboard_feedback.sql). */

export type LessonStats = { helpful: number; not_helpful: number }

export async function fetchLessonStats(lessonId: string): Promise<LessonStats | null> {
  const rows = await rest<LessonStats[]>(`lesson_stats?lesson_id=eq.${encodeURIComponent(lessonId)}&select=helpful,not_helpful`)
  return rows[0] ?? null
}

export function sendLessonFeedback(lessonId: string, helpful: boolean, comment?: string) {
  return rest('lesson_feedback', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ lesson_id: lessonId, helpful, comment: comment?.trim().slice(0, 500) || null }),
  })
}

export type BoardRow = { rank: number; display_name: string; xp: number; is_me: boolean }

export function fetchWeeklyBoard(token?: string | null, limit = 10) {
  return rest<BoardRow[]>(`weekly_leaderboard?select=rank,display_name,xp,is_me&order=xp.desc,display_name.asc&limit=${limit}`, { token })
}

export type BoardProfile = { display_name: string; show_on_leaderboard: boolean }

export async function fetchMyBoardProfile(token: string): Promise<BoardProfile | null> {
  const rows = await rest<BoardProfile[]>('profiles?select=display_name,show_on_leaderboard', { token })
  return rows[0] ?? null
}

export function saveMyBoardProfile(token: string, profile: BoardProfile) {
  return rest('profiles', {
    method: 'POST',
    token,
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ ...profile, display_name: profile.display_name.trim(), updated_at: new Date().toISOString() }),
  })
}
