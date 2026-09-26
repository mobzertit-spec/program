import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { usePersistentState } from '@/lib/storage'

export type SavedWord = {
  word: string
  ar: string
  pos?: string
  example?: string
  addedAt: number
  /** number of times the learner marked it as "known" in flashcards */
  strength: number
}

type Theme = 'light' | 'dark' | 'system'

type AppState = {
  saved: SavedWord[]
  isSaved: (word: string) => boolean
  toggleSave: (w: Omit<SavedWord, 'addedAt' | 'strength'>) => boolean
  removeWord: (word: string) => void
  rateWord: (word: string, known: boolean) => void
  completed: string[]
  markComplete: (lessonId: string) => void
  quizScores: Record<string, number>
  setQuizScore: (lessonId: string, score: number) => void
  showArabic: boolean
  setShowArabic: (v: boolean) => void
  theme: Theme
  setTheme: (t: Theme) => void
  resetProgress: () => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = usePersistentState<SavedWord[]>('pe:saved', [])
  const [completed, setCompleted] = usePersistentState<string[]>('pe:completed', [])
  const [quizScores, setQuizScores] = usePersistentState<Record<string, number>>('pe:quiz', {})
  const [showArabic, setShowArabic] = usePersistentState('pe:show-ar', false)
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

  const isSaved = useCallback((word: string) => saved.some((s) => s.word === word.toLowerCase()), [saved])

  const toggleSave = useCallback(
    (w: Omit<SavedWord, 'addedAt' | 'strength'>) => {
      const key = w.word.toLowerCase()
      const exists = saved.some((s) => s.word === key)
      setSaved((prev) =>
        exists ? prev.filter((s) => s.word !== key) : [{ ...w, word: key, addedAt: Date.now(), strength: 0 }, ...prev],
      )
      return !exists
    },
    [saved, setSaved],
  )

  const removeWord = useCallback((word: string) => setSaved((p) => p.filter((s) => s.word !== word)), [setSaved])

  const rateWord = useCallback(
    (word: string, known: boolean) =>
      setSaved((p) => p.map((s) => (s.word === word ? { ...s, strength: Math.max(0, s.strength + (known ? 1 : -1)) } : s))),
    [setSaved],
  )

  const markComplete = useCallback(
    (id: string) => setCompleted((p) => (p.includes(id) ? p : [...p, id])),
    [setCompleted],
  )

  const setQuizScore = useCallback(
    (id: string, score: number) => setQuizScores((p) => ({ ...p, [id]: Math.max(p[id] ?? 0, score) })),
    [setQuizScores],
  )

  const resetProgress = useCallback(() => {
    setCompleted([])
    setQuizScores({})
  }, [setCompleted, setQuizScores])

  const value = useMemo<AppState>(
    () => ({
      saved, isSaved, toggleSave, removeWord, rateWord,
      completed, markComplete, quizScores, setQuizScore,
      showArabic, setShowArabic, theme, setTheme, resetProgress,
    }),
    [saved, isSaved, toggleSave, removeWord, rateWord, completed, markComplete, quizScores, setQuizScore, showArabic, setShowArabic, theme, setTheme, resetProgress],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
