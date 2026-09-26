import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { usePersistentState } from '@/lib/storage'

export type UiLang = 'en' | 'ar'

type LocaleState = {
  lang: UiLang
  setLang: (l: UiLang) => void
  /** pick the interface string for the current language */
  t: (en: string, ar: string) => string
  rtl: boolean
}

const Ctx = createContext<LocaleState>({ lang: 'en', setLang: () => {}, t: (en) => en, rtl: false })

/**
 * Interface language for navigation, page titles and buttons.
 * Lesson content always stays in English — that is what learners practise.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = usePersistentState<UiLang>('pe:ui-lang', 'en')
  const t = useCallback((en: string, ar: string) => (lang === 'ar' ? ar : en), [lang])
  const value = useMemo(() => ({ lang, setLang, t, rtl: lang === 'ar' }), [lang, setLang, t])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useLocale = () => useContext(Ctx)
