import { dictionary, IRREGULAR, type DictEntry } from '@/data/dictionary'
import { lessons } from '@/data/lessons'
import { readStorage, writeStorage } from './storage'

export type Translation = {
  word: string
  base: string
  ar: string
  pos?: string
  source: 'dictionary' | 'lesson' | 'online'
}

/** Lesson vocabulary has richer meanings — it wins over the generic dictionary. */
const lessonVocab = new Map<string, DictEntry>()
for (const l of lessons) for (const v of l.vocab) lessonVocab.set(v.word, { word: v.word, pos: v.pos, ar: v.ar })

export const normalize = (w: string) =>
  w
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/^[^a-z]+|[^a-z]+$/g, '')
    .replace(/'s$/, '')

const known = (w: string) => lessonVocab.has(w) || dictionary.has(w)

/** Tiny rule-based lemmatizer: good enough for plurals, -ed, -ing, -er, -ly. */
export function lemmatize(word: string): string {
  const w = normalize(word)
  if (!w) return w
  if (known(w)) return w
  if (IRREGULAR[w]) return IRREGULAR[w]
  const candidates: string[] = []
  const add = (c: string) => c.length > 1 && candidates.push(c)
  if (w.endsWith('ies')) add(w.slice(0, -3) + 'y')
  if (w.endsWith('es')) add(w.slice(0, -2))
  if (w.endsWith('s')) add(w.slice(0, -1))
  if (w.endsWith('ied')) add(w.slice(0, -3) + 'y')
  if (w.endsWith('ed')) {
    add(w.slice(0, -2))
    add(w.slice(0, -1))
    if (w.at(-3) === w.at(-4)) add(w.slice(0, -3))
  }
  if (w.endsWith('ing')) {
    add(w.slice(0, -3))
    add(w.slice(0, -3) + 'e')
    if (w.at(-4) === w.at(-5)) add(w.slice(0, -4))
  }
  if (w.endsWith('er')) add(w.slice(0, -2))
  if (w.endsWith('ly')) add(w.slice(0, -2))
  return candidates.find(known) ?? w
}

export function lookupLocal(word: string): Translation | null {
  const base = lemmatize(word)
  const shown = normalize(word)
  const hit = lessonVocab.get(shown) ?? lessonVocab.get(base)
  if (hit) return { word: shown, base: hit.word, ar: hit.ar, pos: hit.pos, source: 'lesson' }
  const d = dictionary.get(shown) ?? dictionary.get(base)
  if (d) return { word: shown, base: d.word, ar: d.ar, pos: d.pos, source: 'dictionary' }
  return null
}

export const isKnownWord = (word: string) => lookupLocal(word) !== null

const CACHE_KEY = 'pe:online-cache'
const onlineCache: Record<string, string> = readStorage(CACHE_KEY, {})

/** Free MyMemory API as a fallback for words/phrases missing from the offline dictionary. */
export async function translateOnline(text: string, signal?: AbortSignal): Promise<string> {
  const key = text.trim().toLowerCase()
  if (onlineCache[key]) return onlineCache[key]
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=en|ar`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Translation failed (${res.status})`)
  const data = (await res.json()) as { responseData?: { translatedText?: string }; responseStatus?: number }
  const out = data.responseData?.translatedText?.trim()
  if (!out || data.responseStatus !== 200 || /MYMEMORY WARNING|INVALID/i.test(out)) {
    throw new Error('No translation found')
  }
  onlineCache[key] = out
  writeStorage(CACHE_KEY, onlineCache)
  return out
}

/** Word-level lookup: offline first, then online. */
export async function translateWord(word: string, signal?: AbortSignal): Promise<Translation> {
  const local = lookupLocal(word)
  if (local) return local
  const base = lemmatize(word)
  const ar = await translateOnline(normalize(word), signal)
  return { word: normalize(word), base, ar, source: 'online' }
}

/** Translate a phrase: single known word → dictionary, otherwise online. */
export async function translateText(text: string, signal?: AbortSignal): Promise<string> {
  const t = text.trim()
  if (!t) return ''
  if (/^[A-Za-z'’-]+$/.test(t)) {
    const local = lookupLocal(t)
    if (local) return local.ar
  }
  return translateOnline(t, signal)
}
