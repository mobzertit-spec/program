import { AnimatePresence, motion } from 'motion/react'
import { Languages } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslator } from '@/context/TranslatorContext'

type Pill = { text: string; rect: { top: number; left: number; bottom: number; width: number } }

/** Select any English text inside [data-translatable] → a floating "Translate" pill appears. */
export function SelectionTranslator() {
  const { open } = useTranslator()
  const [pill, setPill] = useState<Pill | null>(null)

  useEffect(() => {
    const check = () => {
      const sel = window.getSelection()
      const text = sel?.toString().trim() ?? ''
      if (!sel || sel.rangeCount === 0 || text.length < 2 || text.length > 400 || !/[a-z]/i.test(text)) {
        setPill(null)
        return
      }
      const node = sel.anchorNode
      const el = node instanceof Element ? node : node?.parentElement
      if (!el?.closest('[data-translatable]')) return setPill(null)
      const r = sel.getRangeAt(0).getBoundingClientRect()
      setPill({ text, rect: { top: r.top, left: r.left, bottom: r.bottom, width: r.width } })
    }
    const deferred = () => window.setTimeout(check, 10)
    const onSelChange = () => {
      if (!window.getSelection()?.toString().trim()) setPill(null)
    }
    document.addEventListener('mouseup', deferred)
    document.addEventListener('keyup', deferred)
    document.addEventListener('touchend', deferred)
    document.addEventListener('selectionchange', onSelChange)
    window.addEventListener('scroll', onSelChange, { passive: true })
    return () => {
      document.removeEventListener('mouseup', deferred)
      document.removeEventListener('keyup', deferred)
      document.removeEventListener('touchend', deferred)
      document.removeEventListener('selectionchange', onSelChange)
      window.removeEventListener('scroll', onSelChange)
    }
  }, [])

  const onTranslate = () => {
    if (!pill) return
    const single = /^[A-Za-z'’-]+$/.test(pill.text)
    open({ text: pill.text, kind: single ? 'word' : 'phrase', rect: pill.rect })
    setPill(null)
  }

  const top = pill ? Math.max(8, pill.rect.top - 48) : 0
  const left = pill ? Math.min(Math.max(8, pill.rect.left + pill.rect.width / 2 - 60), window.innerWidth - 128) : 0

  return createPortal(
    <AnimatePresence>
      {pill && (
        <motion.button
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onTranslate}
          style={{ top, left }}
          className="fixed z-[55] inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg shadow-pop"
        >
          <Languages className="size-4" /> Translate
        </motion.button>
      )}
    </AnimatePresence>,
    document.body,
  )
}
