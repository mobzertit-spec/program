import { AnimatePresence, motion } from 'motion/react'
import { Bookmark, BookmarkCheck, Loader2, Volume2, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { isServer } from '@/lib/boot'
import { POS_AR } from '@/data/dictionary'
import { useApp } from '@/context/AppContext'
import { useTranslator } from '@/context/TranslatorContext'
import { canSpeak, speak } from '@/lib/speech'
import { translateText, translateWord, type Translation } from '@/lib/translate'
import { useToast } from '@/components/ui/toast'

type State =
  | { status: 'loading' }
  | { status: 'ok'; data: Translation }
  | { status: 'error'; message: string }

const WIDTH = 320

export function WordPopover() {
  const { target, close } = useTranslator()
  const { isSaved, toggleSave } = useApp()
  const toast = useToast()
  const [state, setState] = useState<State>({ status: 'loading' })
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number }>({ left: 0 })

  // fetch translation
  useEffect(() => {
    if (!target) return
    const ctrl = new AbortController()
    setState({ status: 'loading' })
    const run = async () => {
      try {
        const data: Translation =
          target.kind === 'word'
            ? await translateWord(target.text, ctrl.signal)
            : { word: target.text, base: target.text, ar: await translateText(target.text, ctrl.signal), source: 'online' }
        setState({ status: 'ok', data })
      } catch (e) {
        if (ctrl.signal.aborted) return
        setState({
          status: 'error',
          message: navigator.onLine
            ? `Could not translate this ${target.kind === 'word' ? 'word' : 'text'} right now. Please try again.`
            : 'You are offline — only the built-in dictionary works.',
        })
        void e
      }
    }
    run()
    return () => ctrl.abort()
  }, [target])

  // position next to the word, flip above when there is no room below
  useLayoutEffect(() => {
    if (!target) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    const w = Math.min(WIDTH, vw - 24)
    const left = Math.max(12, Math.min(target.rect.left + target.rect.width / 2 - w / 2, vw - w - 12))
    if (target.rect.bottom + 280 > vh && target.rect.top > 280) setPos({ left, bottom: vh - target.rect.top + 10 })
    else setPos({ left, top: target.rect.bottom + 10 })
  }, [target])

  // highlight the active word
  useEffect(() => {
    const el = target?.anchor
    el?.setAttribute('data-active', 'true')
    return () => el?.removeAttribute('data-active')
  }, [target])

  // close on Escape / outside click / scroll / resize
  useEffect(() => {
    if (!target) return
    const startY = window.scrollY
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        target.anchor?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (ref.current?.contains(t) || target.anchor?.contains(t)) return
      close()
    }
    const onScroll = () => Math.abs(window.scrollY - startY) > 40 && close()
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', close)
    }
  }, [target, close])

  const data = state.status === 'ok' ? state.data : null
  const saveKey = data ? (target?.kind === 'word' ? data.base : data.word) : ''
  const saved = data ? isSaved(saveKey) : false
  const onSave = () => {
    if (!data) return
    const added = toggleSave({ word: saveKey, ar: data.ar, pos: data.pos, example: target?.example })
    toast(added ? `“${saveKey}” saved to your words` : `Removed “${saveKey}”`)
  }

  if (isServer) return null // portals need the DOM
  return createPortal(
    <AnimatePresence>
      {target && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-label={`Translation of ${target.text}`}
          key={target.text + target.rect.top}
          initial={{ opacity: 0, scale: 0.96, y: pos.top !== undefined ? -6 : 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
          style={{ left: pos.left, top: pos.top, bottom: pos.bottom, width: Math.min(WIDTH, window.innerWidth - 24) }}
          className="fixed z-[60] overflow-hidden rounded-2xl border border-border-soft bg-surface/95 shadow-pop backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-2 px-4 pt-4">
            <div className="min-w-0">
              <p className="line-clamp-2 text-lg font-semibold tracking-tight text-fg">{target.text}</p>
              {data?.pos && (
                <p className="mt-0.5 text-xs text-fg-muted">
                  {data.pos}
                  {POS_AR[data.pos] && <span className="font-arabic"> · {POS_AR[data.pos]}</span>}
                  {target.kind === 'word' && data.base !== data.word && <span> · from “{data.base}”</span>}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {canSpeak() && (
                <button
                  onClick={() => speak(target.text)}
                  className="grid size-9 cursor-pointer place-items-center rounded-full text-primary transition-colors hover:bg-bg-alt"
                  aria-label="Listen to pronunciation"
                >
                  <Volume2 className="size-[18px]" />
                </button>
              )}
              <button
                onClick={close}
                className="grid size-9 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors hover:bg-bg-alt"
                aria-label="Close"
              >
                <X className="size-[18px]" />
              </button>
            </div>
          </div>

          <div className="px-4 pb-3 pt-2" aria-live="polite">
            {state.status === 'loading' && (
              <div className="flex items-center gap-2 py-2 text-sm text-fg-muted">
                <Loader2 className="size-4 animate-spin" /> Translating…
              </div>
            )}
            {state.status === 'error' && <p className="py-2 text-sm text-danger">{state.message}</p>}
            {data && (
              <p lang="ar" dir="rtl" className="text-right text-2xl font-semibold leading-snug text-fg">
                {data.ar}
              </p>
            )}
            {target.example && <p className="mt-2 text-sm italic text-fg-muted">“{target.example}”</p>}
          </div>

          {data && (
            <div className="flex items-center justify-between border-t border-border-soft bg-bg-alt/60 px-4 py-2.5">
              <span className="text-[11px] uppercase tracking-wider text-fg-subtle">
                {data.source === 'online' ? 'Online translation' : data.source === 'lesson' ? 'Lesson word' : 'Dictionary'}
              </span>
              <button
                onClick={onSave}
                className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-primary transition-colors hover:bg-surface"
              >
                {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                {saved ? 'Saved' : 'Save word'}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
