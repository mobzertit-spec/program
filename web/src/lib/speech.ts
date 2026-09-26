let cachedVoice: SpeechSynthesisVoice | null | undefined

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice
  const voices = window.speechSynthesis?.getVoices() ?? []
  if (!voices.length) return null
  cachedVoice =
    voices.find((v) => /en[-_]US/i.test(v.lang) && /samantha|google|natural/i.test(v.name)) ??
    voices.find((v) => /en[-_](US|GB)/i.test(v.lang)) ??
    voices.find((v) => v.lang.startsWith('en')) ??
    null
  return cachedVoice
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text: string, rate = 0.92) {
  if (!canSpeak()) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rate
  const voice = pickVoice()
  if (voice) u.voice = voice
  window.speechSynthesis.speak(u)
}

// ---------- Speech recognition (pronunciation practice) ----------

type RecognitionAlternative = { transcript: string }
type RecognitionEvent = { results: ArrayLike<ArrayLike<RecognitionAlternative>> }
type Recognition = {
  lang: string
  maxAlternatives: number
  interimResults: boolean
  continuous: boolean
  onresult: ((e: RecognitionEvent) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}
type RecognitionCtor = new () => Recognition

const getRecognition = (): RecognitionCtor | undefined => {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export const canListen = () => !!getRecognition()

/** Listen once and return the recognizer's guesses (best first). */
export function listen(timeoutMs = 6000): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const Ctor = getRecognition()
    if (!Ctor) return reject(new Error('not-supported'))
    const rec = new Ctor()
    rec.lang = 'en-US'
    rec.maxAlternatives = 5
    rec.interimResults = false
    rec.continuous = false
    let settled = false
    const finish = (fn: () => void) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      fn()
    }
    rec.onresult = (e) => {
      const alts = Array.from(e.results[0] ?? []).map((a) => a.transcript)
      finish(() => resolve(alts))
    }
    rec.onerror = (e) => finish(() => reject(new Error(e.error)))
    rec.onend = () => finish(() => resolve([]))
    const timer = window.setTimeout(() => {
      try {
        rec.stop()
      } catch {
        /* already stopped */
      }
    }, timeoutMs)
    rec.start()
  })
}

function distance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return dp[a.length][b.length]
}

/** Did any guess contain the target word (allowing one small slip for long words)? */
export function matchesWord(target: string, guesses: string[]) {
  const t = target.toLowerCase().trim()
  return guesses.some((g) =>
    g
      .toLowerCase()
      .replace(/[^a-z'\s-]/g, ' ')
      .split(/\s+/)
      .some((w) => w === t || (t.length > 5 && distance(w, t) <= 1)),
  )
}
