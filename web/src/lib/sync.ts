import { readStorage, STORAGE_SYNC_EVENT } from './storage'

/** localStorage keys that make up a learner's progress (preferences like theme stay per device). */
export const SYNC_KEYS = [
  'pe:saved',
  'pe:completed',
  'pe:quiz',
  'pe:xp',
  'pe:best-streak',
  'pe:goal',
  'pe:reviews',
  'pe:pron',
] as const

export type ProgressData = Partial<Record<(typeof SYNC_KEYS)[number], unknown>>

type Word = { word: string; box?: number; due?: number; addedAt?: number }

export function collectLocal(): ProgressData {
  const out: ProgressData = {}
  for (const k of SYNC_KEYS) {
    const v = readStorage<unknown>(k, undefined)
    if (v !== undefined) out[k] = v
  }
  return out
}

export function applyLocal(data: ProgressData) {
  try {
    for (const k of SYNC_KEYS) if (data[k] !== undefined) localStorage.setItem(k, JSON.stringify(data[k]))
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(STORAGE_SYNC_EVENT))
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)
const obj = (v: unknown) => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, number>) : {})
const arr = <T,>(v: unknown) => (Array.isArray(v) ? (v as T[]) : [])

function maxMerge(a: Record<string, number>, b: Record<string, number>) {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, num(v))
  return out
}

/**
 * Combine progress from two devices without losing anything:
 * lessons are united, scores / XP per day / counters take the maximum,
 * saved words are united and keep the stronger memory box.
 */
export function mergeProgress(local: ProgressData, remote: ProgressData): ProgressData {
  const words = new Map<string, Word>()
  for (const w of [...arr<Word>(remote['pe:saved']), ...arr<Word>(local['pe:saved'])]) {
    const prev = words.get(w.word)
    if (!prev || num(w.box) > num(prev.box) || (num(w.box) === num(prev.box) && num(w.due) > num(prev.due))) words.set(w.word, w)
  }
  return {
    'pe:saved': [...words.values()].sort((a, b) => num(b.addedAt) - num(a.addedAt)),
    'pe:completed': [...new Set([...arr<string>(remote['pe:completed']), ...arr<string>(local['pe:completed'])])],
    'pe:quiz': maxMerge(obj(remote['pe:quiz']), obj(local['pe:quiz'])),
    'pe:xp': maxMerge(obj(remote['pe:xp']), obj(local['pe:xp'])),
    'pe:best-streak': Math.max(num(remote['pe:best-streak']), num(local['pe:best-streak'])),
    'pe:goal': local['pe:goal'] ?? remote['pe:goal'] ?? 30,
    'pe:reviews': Math.max(num(remote['pe:reviews']), num(local['pe:reviews'])),
    'pe:pron': Math.max(num(remote['pe:pron']), num(local['pe:pron'])),
  }
}

export const sameProgress = (a: ProgressData, b: ProgressData) => JSON.stringify(a) === JSON.stringify(b)
