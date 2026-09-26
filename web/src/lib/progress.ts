import type { Lesson } from '@/data/lessons'
import { lessons } from '@/data/lessons'

/** Local calendar day, e.g. "2026-09-26". */
export function dayKey(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Consecutive active days ending today (or yesterday, so the streak survives until tonight). */
export function computeStreak(log: Record<string, number>) {
  const active = (d: Date) => (log[dayKey(d)] ?? 0) > 0
  const d = new Date()
  if (!active(d)) d.setDate(d.getDate() - 1)
  let n = 0
  while (active(d)) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export const XP_PER_LEVEL = 150

export function levelFromXp(xp: number) {
  return { level: Math.floor(xp / XP_PER_LEVEL) + 1, into: xp % XP_PER_LEVEL, span: XP_PER_LEVEL }
}

/** The first lesson of every track is open; the others open when the previous lesson in the track is done. */
export function isUnlocked(lesson: Lesson, completed: string[]) {
  const track = lessons.filter((l) => l.track === lesson.track)
  const i = track.findIndex((l) => l.id === lesson.id)
  return i <= 0 || completed.includes(track[i - 1].id) || completed.includes(lesson.id)
}

/** The next lesson to study: the first unlocked, unfinished lesson in path order. */
export function nextLesson(completed: string[]) {
  return lessons.find((l) => !completed.includes(l.id) && isUnlocked(l, completed))
}

/** Last `days` days of XP, oldest first — for the activity chart. */
export function recentDays(log: Record<string, number>, days = 7) {
  const out: { key: string; label: string; xp: number }[] = []
  const d = new Date()
  d.setDate(d.getDate() - (days - 1))
  for (let i = 0; i < days; i++) {
    out.push({ key: dayKey(d), label: d.toLocaleDateString('en', { weekday: 'narrow' }), xp: log[dayKey(d)] ?? 0 })
    d.setDate(d.getDate() + 1)
  }
  return out
}
