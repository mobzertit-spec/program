import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type PopoverTarget = {
  text: string
  /** word = single token lookup, phrase = online translation of a selection */
  kind: 'word' | 'phrase'
  rect: { top: number; left: number; bottom: number; width: number }
  example?: string
  anchor?: HTMLElement
}

type TranslatorState = {
  target: PopoverTarget | null
  open: (t: PopoverTarget) => void
  close: () => void
  panelOpen: boolean
  setPanelOpen: (v: boolean) => void
}

const Ctx = createContext<TranslatorState | null>(null)

export function TranslatorProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<PopoverTarget | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const open = useCallback((t: PopoverTarget) => setTarget(t), [])
  const close = useCallback(() => setTarget(null), [])
  const value = useMemo(() => ({ target, open, close, panelOpen, setPanelOpen }), [target, open, close, panelOpen])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTranslator() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTranslator must be used inside <TranslatorProvider>')
  return ctx
}

export const rectOf = (el: Element) => {
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, bottom: r.bottom, width: r.width }
}
