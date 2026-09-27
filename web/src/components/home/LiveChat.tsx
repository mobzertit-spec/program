import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowUp, MousePointerClick, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TranslatableText } from '@/components/translate/TranslatableText'
import { useTranslator } from '@/context/TranslatorContext'
import { lemmatize } from '@/lib/translate'
import { cn } from '@/lib/utils'

type Scenario = {
  id: string
  tab: string
  tabAr: string
  prompt: string
  answer: string
  /** the word the demo "taps" to show the translation */
  gloss: { word: string; ar: string; note: string }
}

const SCENARIOS: Scenario[] = [
  {
    id: 'fix',
    tab: 'Fix my English',
    tabAr: 'صحّح إنجليزيتي',
    prompt: 'You are a patient English teacher. Correct my sentence: “Yesterday I go to the market.”',
    answer: 'Almost perfect! Say: “Yesterday I went to the market.” We use the past tense for actions that are finished.',
    gloss: { word: 'went', ar: 'ذهبَ', note: 'past of “go”' },
  },
  {
    id: 'word',
    tab: 'Learn a word',
    tabAr: 'تعلّم كلمة',
    prompt: 'What does “context” mean? Explain it in one simple sentence with an example.',
    answer: 'Context is the background information that helps someone understand you. For example: “I need a gift for my mom, who loves gardening.”',
    gloss: { word: 'background', ar: 'خلفية', note: 'noun' },
  },
  {
    id: 'email',
    tab: 'Write an email',
    tabAr: 'اكتب بريدًا',
    prompt: 'Write a short, polite email to my manager asking for Friday off.',
    answer: 'Hi Sarah, could I take this Friday off for a family wedding? I will finish my tasks by Thursday. Thank you!',
    gloss: { word: 'wedding', ar: 'حفل زفاف', note: 'noun' },
  },
]

type Phase = 'typing' | 'thinking' | 'streaming' | 'done'
type State = { s: number; phase: Phase; typed: number; shown: number }

const words = (t: string) => t.split(' ')
const finished = (s: number): State => ({ s, phase: 'done', typed: SCENARIOS[s].prompt.length, shown: words(SCENARIOS[s].answer).length })

/**
 * The hero demo: a prompt types itself, Claude's answer streams in, then one word is "tapped" to show its Arabic
 * meaning. Every word stays clickable. It starts on a finished conversation (what the prerendered page shows),
 * pauses when hovered or off screen, and is static for people who prefer reduced motion.
 */
export function LiveChat() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-80px' })
  const [hover, setHover] = useState(false)
  // once someone taps a word they are exploring — stop the autoplay until they pick another example
  const [exploring, setExploring] = useState(false)
  const { target } = useTranslator()
  const reading = !!target?.anchor && !!ref.current?.contains(target.anchor)
  const [state, setState] = useState<State>(() => finished(0))
  const sc = SCENARIOS[state.s]
  const answerWords = useMemo(() => words(sc.answer), [sc])
  const active = inView && !hover && !reduce && !exploring && !reading

  useEffect(() => {
    if (!active) return
    const next = (ms: number, fn: (st: State) => State) => {
      const t = window.setTimeout(() => setState(fn), ms)
      return () => window.clearTimeout(t)
    }
    switch (state.phase) {
      case 'typing':
        return state.typed < sc.prompt.length
          ? next(24, (st) => ({ ...st, typed: Math.min(st.typed + 2, sc.prompt.length) }))
          : next(380, (st) => ({ ...st, phase: 'thinking' }))
      case 'thinking':
        return next(900, (st) => ({ ...st, phase: 'streaming', shown: 0 }))
      case 'streaming':
        return state.shown < answerWords.length
          ? next(55, (st) => ({ ...st, shown: st.shown + 1 }))
          : next(250, (st) => ({ ...st, phase: 'done' }))
      case 'done':
        return next(6000, (st) => ({ s: (st.s + 1) % SCENARIOS.length, phase: 'typing', typed: 0, shown: 0 }))
    }
  }, [active, state, sc, answerWords])

  const pick = (s: number) => {
    setExploring(false)
    setState(reduce ? finished(s) : { s, phase: 'typing', typed: 0, shown: 0 })
  }
  const sent = state.phase !== 'typing'
  const glossBase = useMemo(() => new Set([lemmatize(sc.gloss.word)]), [sc])

  return (
    <div ref={ref} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} className="w-full">
      <div
        role="group"
        aria-label="Demo: a short chat with Claude. Click any word to translate it."
        className="overflow-hidden rounded-[28px] border border-border-soft bg-surface shadow-pop"
      >
        {/* window bar */}
        <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2 px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="size-3 rounded-full bg-[#28c840]" aria-hidden />
          <span className="ml-2 flex items-center gap-1.5 text-xs font-medium text-fg-muted">
            <Sparkles className="size-3.5 text-clay" aria-hidden /> Chat with Claude
          </span>
          <span className="ml-auto hidden text-[11px] text-fg-subtle sm:inline">Click any word</span>
        </div>

        {/* messages — fixed height, so streaming text never pushes the page around */}
        <div
          onClick={(e) => (e.target as HTMLElement).closest('[data-w]') && setExploring(true)}
          className="relative flex h-[330px] flex-col justify-end gap-4 overflow-hidden p-4 text-left sm:h-[350px] sm:p-6"
        >
          {/* a new chat starts empty — greet like the real app */}
          <AnimatePresence initial={false}>
            {!sent && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.4 } }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="absolute inset-0 grid place-items-center text-center"
              >
                <p className="flex flex-col items-center gap-2 text-xl font-medium tracking-tight text-fg-muted">
                  <Sparkles className="size-7 text-clay" aria-hidden />
                  How can I help you today?
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout" initial={false}>
            {sent && (
              <motion.div
                key={`u-${state.s}`}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, delay: 0.12 }}
                className="flex justify-end"
              >
                <div className="max-w-[88%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-[15px] leading-relaxed text-on-primary sm:text-base">
                  <TranslatableText as="span" text={sc.prompt} className="[&_.tw:hover]:bg-white/20 [&_.tw]:decoration-white/60" />
                </div>
              </motion.div>
            )}
            {(state.phase === 'thinking' || state.phase === 'streaming' || state.phase === 'done') && (
              <motion.div
                key={`a-${state.s}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="flex gap-2.5"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-clay-soft" aria-hidden>
                  <Sparkles className="size-4 text-clay" />
                </span>
                <div className="min-w-0 max-w-[88%]">
                  <div className="rounded-3xl rounded-tl-md bg-bg-alt px-4 py-3 text-[15px] leading-relaxed sm:text-base">
                    {state.phase === 'thinking' ? (
                      <span className="flex h-6 items-center gap-1" aria-label="Claude is writing">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="size-2 rounded-full bg-fg-subtle"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </span>
                    ) : (
                      <TranslatableText
                        as="span"
                        text={answerWords.slice(0, state.shown).join(' ')}
                        highlight={state.phase === 'done' ? glossBase : undefined}
                      />
                    )}
                  </div>
                  <AnimatePresence initial={false}>
                    {state.phase === 'done' && (
                      <motion.p
                        key={`g-${state.s}`}
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: reduce ? 0 : 0.35, duration: 0.3 }}
                        className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-border-soft bg-surface px-3 py-2 text-sm shadow-card"
                      >
                        <MousePointerClick className="size-4 text-primary" aria-hidden />
                        <span className="font-semibold">{sc.gloss.word}</span>
                        <span className="text-fg-subtle">→</span>
                        <span lang="ar" className="font-semibold text-clay">{sc.gloss.ar}</span>
                        <span className="text-xs text-fg-subtle">{sc.gloss.note}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* composer */}
        <div className="border-t border-border-soft p-3 sm:p-4" aria-hidden>
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-bg px-4 py-3">
            <p className={cn('min-h-6 flex-1 text-left text-[15px] leading-6', state.phase === 'typing' ? 'text-fg' : 'text-fg-subtle')}>
              {state.phase === 'typing' ? (
                <>
                  {sc.prompt.slice(0, state.typed)}
                  <span className="ml-px inline-block h-5 w-0.5 translate-y-1 animate-pulse bg-primary" />
                </>
              ) : (
                'Message Claude…'
              )}
            </p>
            <span
              className={cn(
                'grid size-8 shrink-0 place-items-center rounded-full transition-colors',
                state.phase === 'typing' && state.typed >= sc.prompt.length ? 'bg-primary text-on-primary' : 'bg-bg-alt text-fg-subtle',
              )}
            >
              <ArrowUp className="size-4" />
            </span>
          </div>
        </div>
      </div>

      {/* scenario tabs */}
      <div className="mt-4 flex flex-wrap justify-center gap-1.5" role="group" aria-label="Choose an example">
        {SCENARIOS.map((x, i) => (
          <button
            key={x.id}
            onClick={() => pick(i)}
            aria-pressed={state.s === i}
            className={cn(
              'inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors',
              state.s === i ? 'border-fg bg-fg text-bg' : 'border-border-soft bg-surface/80 text-fg-muted hover:bg-bg-alt',
            )}
          >
            {x.tab}
            <span lang="ar" data-ar-help className={cn('text-xs', state.s === i ? 'opacity-70' : 'text-fg-subtle')}>
              {x.tabAr}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
