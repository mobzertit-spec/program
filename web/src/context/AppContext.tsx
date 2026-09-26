import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useToast } from '@/components/ui/toast'
import { dayKey, computeStreak, levelFromXp } from '@/lib/progress'
import { nextReview } from '@/lib/srs'
import { readStorage, usePersistentState } from '@/lib/storage'

export type SavedWord = {
  word: string
  ar: string
  pos?: string
  example?: string
  addedAt: number
  /** Leitner box (0 = new … 6 = mastered) */
  box: number
  /** timestamp when the word is due for review */
  due: number
}

type Theme = 'light' | 'dark' | 'system'

export const XP = {
  lesson: 50,
  quizAnswer: 10,
  reviewKnown: 2,
  reviewAgain: 1,
  pronunciation: 3,
} as const

type AppState = {
  saved: SavedWord[]
  isSaved: (word: string) => boolean
  toggleSave: (w: Pick<SavedWord, 'word' | 'ar' | 'pos' | 'example'>) => boolean
  removeWord: (word: string) => void
  rateWord: (word: string, known: boolean) => void
  dueWords: SavedWord[]
  completed: string[]
  markComplete: (lessonId: string) => void
  quizScores: Record<string, number>
  setQuizScore: (lessonId: string, score: number) => void
  // gamification
  xp: number
  xpToday: number
  xpLog: Record<string, number>
  addXp: (amount: number, reason?: string) => void
  level: { level: number; into: number; span: number }
  streak: number
  bestStreak: number
  dailyGoal: number
  setDailyGoal: (n: number) => void
  reviewsDone: number
  pronunciationHits: number
  recordPronunciation: (ok: boolean) => void
  // preferences
  showArabic: boolean
  /** Arabic subtitles under English titles and hints */
  arabicHelp: boolean
  setArabicHelp: (v: boolean) => void
  setShowArabic: (v: boolean) => void
  theme: Theme
  setTheme: (t: Theme) => void
  resetProgress: () => void
}

const Ctx = createContext<AppState | null>(null)

/** Older versions stored a simple "strength" number — convert it to a Leitner box. */
function migrateSaved(): SavedWord[] {
  const raw = readStorage<(Partial<SavedWord> & { strength?: number; word: string; ar: string })[]>('pe:saved', [])
  return raw.map((w) => ({
    word: w.word,
    ar: w.ar,
    pos: w.pos,
    example: w.example,
    addedAt: w.addedAt ?? Date.now(),
    box: w.box ?? Math.min(w.strength ?? 0, 3),
    due: w.due ?? 0,
  }))
}

export function AppProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const [saved, setSaved] = usePersistentState<SavedWord[]>('pe:saved', migrateSaved)
  const [completed, setCompleted] = usePersistentState<string[]>('pe:completed', [])
  const [quizScores, setQuizScores] = usePersistentState<Record<string, number>>('pe:quiz', {})
  const [xpLog, setXpLog] = usePersistentState<Record<string, number>>('pe:xp', {})
  const [bestStreak, setBestStreak] = usePersistentState('pe:best-streak', 0)
  const [dailyGoal, setDailyGoal] = usePersistentState('pe:goal', 30)
  const [reviewsDone, setReviewsDone] = usePersistentState('pe:reviews', 0)
  const [pronunciationHits, setPronunciationHits] = usePersistentState('pe:pron', 0)
  const [showArabic, setShowArabic] = usePersistentState('pe:show-ar', false)
  const [arabicHelp, setArabicHelp] = usePersistentState('pe:ar-help', true)
  useEffect(() => {
    document.documentElement.classList.toggle('ar-help-off', !arabicHelp)
  }, [arabicHelp])
  const [theme, setTheme] = usePersistentState<Theme>('pe:theme', 'system')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  const xp = useMemo(() => Object.values(xpLog).reduce((a, b) => a + b, 0), [xpLog])
  const xpToday = xpLog[dayKey()] ?? 0
  const streak = useMemo(() => computeStreak(xpLog), [xpLog])
  const level = useMemo(() => levelFromXp(xp), [xp])

  useEffect(() => {
    if (streak > bestStreak) setBestStreak(streak)
  }, [streak, bestStreak, setBestStreak])

  const addXp = useCallback(
    (amount: number, reason?: string) => {
      if (amount <= 0) return
      setXpLog((log) => {
        const k = dayKey()
        return { ...log, [k]: (log[k] ?? 0) + amount }
      })
      if (reason) toast(`+${amount} XP · ${reason}`)
    },
    [setXpLog, toast],
  )

  const isSaved = useCallback((word: string) => saved.some((s) => s.word === word.toLowerCase()), [saved])

  const toggleSave = useCallback(
    (w: Pick<SavedWord, 'word' | 'ar' | 'pos' | 'example'>) => {
      const key = w.word.toLowerCase()
      const exists = saved.some((s) => s.word === key)
      setSaved((prev) =>
        exists
          ? prev.filter((s) => s.word !== key)
          : [{ ...w, word: key, addedAt: Date.now(), box: 0, due: Date.now() }, ...prev],
      )
      return !exists
    },
    [saved, setSaved],
  )

  const removeWord = useCallback((word: string) => setSaved((p) => p.filter((s) => s.word !== word)), [setSaved])

  const rateWord = useCallback(
    (word: string, known: boolean) => {
      setSaved((p) => p.map((s) => (s.word === word ? { ...s, ...nextReview(s.box, known) } : s)))
      setReviewsDone((n) => n + 1)
      addXp(known ? XP.reviewKnown : XP.reviewAgain)
    },
    [setSaved, setReviewsDone, addXp],
  )

  // re-check which words are due once a minute
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  const dueWords = useMemo(
    () => saved.filter((s) => s.due <= Math.max(now, Date.now())).sort((a, b) => a.due - b.due),
    [saved, now],
  )

  const markComplete = useCallback(
    (id: string) => {
      if (completed.includes(id)) return
      setCompleted((p) => (p.includes(id) ? p : [...p, id]))
      addXp(XP.lesson, 'Lesson complete')
    },
    [completed, setCompleted, addXp],
  )

  const setQuizScore = useCallback(
    (id: string, score: number) => {
      const prev = quizScores[id] ?? 0
      if (score > prev) addXp((score - prev) * XP.quizAnswer)
      setQuizScores((p) => ({ ...p, [id]: Math.max(p[id] ?? 0, score) }))
    },
    [quizScores, setQuizScores, addXp],
  )

  const recordPronunciation = useCallback(
    (ok: boolean) => {
      if (!ok) return
      setPronunciationHits((n) => n + 1)
      addXp(XP.pronunciation)
    },
    [setPronunciationHits, addXp],
  )

  const resetProgress = useCallback(() => {
    setCompleted([])
    setQuizScores({})
    setXpLog({})
    setBestStreak(0)
    setReviewsDone(0)
    setPronunciationHits(0)
  }, [setCompleted, setQuizScores, setXpLog, setBestStreak, setReviewsDone, setPronunciationHits])

  const value = useMemo<AppState>(
    () => ({
      saved, isSaved, toggleSave, removeWord, rateWord, dueWords,
      completed, markComplete, quizScores, setQuizScore,
      xp, xpToday, xpLog, addXp, level, streak, bestStreak, dailyGoal, setDailyGoal,
      reviewsDone, pronunciationHits, recordPronunciation,
      showArabic, setShowArabic, arabicHelp, setArabicHelp, theme, setTheme, resetProgress,
    }),
    [
      saved, isSaved, toggleSave, removeWord, rateWord, dueWords,
      completed, markComplete, quizScores, setQuizScore,
      xp, xpToday, xpLog, addXp, level, streak, bestStreak, dailyGoal, setDailyGoal,
      reviewsDone, pronunciationHits, recordPronunciation,
      showArabic, setShowArabic, arabicHelp, setArabicHelp, theme, setTheme, resetProgress,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
