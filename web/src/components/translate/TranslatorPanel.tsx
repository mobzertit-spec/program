import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Bookmark, BookmarkCheck, Languages, Loader2, Volume2, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useApp } from '@/context/AppContext'
import { useTranslator } from '@/context/TranslatorContext'
import { canSpeak, speak } from '@/lib/speech'
import { lookupLocal, translateText } from '@/lib/translate'
import { usePersistentState } from '@/lib/storage'
import { useToast } from '@/components/ui/toast'

type Recent = { en: string; ar: string }

/** Floating quick translator — type any English word or sentence. Open with the button or "/" key. */
export function TranslatorPanel() {
  const { panelOpen, setPanelOpen } = useTranslator()
  const { isSaved, toggleSave } = useApp()
  const toast = useToast()
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Recent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recent, setRecent] = usePersistentState<Recent[]>('pe:recent', [])
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (e.key === '/' && !panelOpen && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        setPanelOpen(true)
      }
      if (e.key === 'Escape' && panelOpen) {
        setPanelOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panelOpen, setPanelOpen])

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text) return
    setLoading(true)
    setError(null)
    try {
      const ar = await translateText(text)
      const r = { en: text, ar }
      setResult(r)
      setRecent((p) => [r, ...p.filter((x) => x.en.toLowerCase() !== text.toLowerCase())].slice(0, 6))
    } catch {
      setError(navigator.onLine ? 'Sorry, we could not translate that. Try a shorter text.' : 'You are offline. Single words from the built-in dictionary still work.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const isWord = result && /^[A-Za-z'’-]+$/.test(result.en)
  const saveKey = result ? (isWord ? (lookupLocal(result.en)?.base ?? result.en.toLowerCase()) : result.en) : ''

  return (
    <>
      <motion.button
        ref={triggerRef}
        onClick={() => setPanelOpen(!panelOpen)}
        whileTap={{ scale: 0.95 }}
        aria-expanded={panelOpen}
        aria-controls="translator-panel"
        className="fixed bottom-5 right-5 z-40 hidden min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-fg pl-3.5 pr-4 text-[14px] lg:inline-flex font-medium text-bg shadow-pop transition-transform hover:scale-[1.03]"
      >
        <Languages className="size-5" />
        <span>Translate</span>
        <kbd className="ml-1 hidden rounded-md border border-bg/30 px-1.5 text-xs opacity-70 sm:inline">/</kbd>
      </motion.button>

      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPanelOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none"
            />
            <motion.div
              key="panel"
              id="translator-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="translator-title"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
              className="fixed inset-x-3 top-[76px] z-[60] lg:top-auto lg:bottom-20 overflow-hidden rounded-3xl border border-border-soft bg-surface/95 shadow-pop backdrop-blur-2xl sm:inset-x-auto sm:right-5 sm:w-[400px]"
            >
              <div className="flex items-center justify-between px-5 pt-5">
                <div>
                  <h2 id="translator-title" className="text-lg font-semibold tracking-tight">Quick Translate</h2>
                  <p className="text-sm text-fg-muted">English → العربية</p>
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="grid size-9 cursor-pointer place-items-center rounded-full text-fg-muted hover:bg-bg-alt"
                  aria-label="Close translator"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={submit} className="px-5 pt-4">
                <label htmlFor="translate-input" className="sr-only">
                  English text
                </label>
                <div className="rounded-2xl border border-border bg-bg-alt transition-shadow focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
                  <textarea
                    id="translate-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) submit(e)
                    }}
                    rows={3}
                    maxLength={500}
                    placeholder="Type a word or sentence…"
                    autoFocus
                    className="block w-full resize-none bg-transparent px-4 py-3 text-base text-fg outline-none placeholder:text-fg-subtle focus-visible:outline-none"
                  />
                  <div className="flex items-center justify-between px-3 pb-2">
                    <span className="text-xs text-fg-subtle">{input.length}/500</span>
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-on-primary transition-opacity disabled:opacity-40"
                    >
                      {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                      Translate
                    </button>
                  </div>
                </div>
              </form>

              <div className="px-5 pb-5 pt-4" aria-live="polite">
                {error && <p className="text-sm text-danger">{error}</p>}
                {result && (
                  <div className="rounded-2xl bg-bg-alt p-4">
                    <p lang="ar" dir="rtl" className="text-right text-xl font-semibold leading-relaxed">
                      {result.ar}
                    </p>
                    <div className="mt-3 flex items-center justify-end gap-1">
                      {canSpeak() && (
                        <button
                          onClick={() => speak(result.en)}
                          className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-primary hover:bg-surface"
                        >
                          <Volume2 className="size-4" /> Listen
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const added = toggleSave({ word: saveKey, ar: result.ar })
                          toast(added ? 'Saved to your words' : 'Removed from your words')
                        }}
                        className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-primary hover:bg-surface"
                      >
                        {isSaved(saveKey) ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                        {isSaved(saveKey) ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}
                {!result && !error && recent.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-fg-subtle">Recent</p>
                    <ul className="flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <li key={r.en}>
                          <button
                            onClick={() => {
                              setInput(r.en)
                              setResult(r)
                            }}
                            className="max-w-[200px] cursor-pointer truncate rounded-full border border-border-soft px-3 py-1.5 text-sm text-fg-muted hover:bg-bg-alt hover:text-fg"
                          >
                            {r.en}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!result && !error && recent.length === 0 && (
                  <p className="text-sm text-fg-muted">
                    Tip: you can also <strong className="text-fg">click any word</strong> or <strong className="text-fg">select a sentence</strong> in the lessons.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
