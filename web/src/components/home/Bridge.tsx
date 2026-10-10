import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/* A real request to Claude, read word by word: each word gets marked and its Arabic meaning appears. */
const WORDS = [
  { en: 'Make', ar: 'اجعل', pos: 'verb' },
  { en: 'this', ar: 'هذه', pos: 'determiner' },
  { en: 'email', ar: 'الرسالة', pos: 'noun' },
  { en: 'shorter,', ar: 'أقصر', pos: 'adjective · more short' },
  { en: 'please.', ar: 'من فضلك', pos: 'adverb · the polite word' },
]
const SENTENCE_AR = 'اجعل هذه الرسالة أقصر، من فضلك.'
const STAGES = WORDS.length + 1 // one stage per word, then the whole sentence

/**
 * Signature scroll moment ("the bridge"): the section pins to the screen and scrolling walks through a sentence,
 * one word at a time, until the whole request reads in Arabic. Reduced motion shows the finished state.
 */
export function Bridge() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [stage, setStage] = useState(reduce ? STAGES - 1 : -1)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return
    // a short lead-in before the first word, then equal steps
    const s = p < 0.06 ? -1 : Math.min(STAGES - 1, Math.floor(((p - 0.06) / 0.88) * STAGES))
    setStage(s)
  })
  const done = stage >= WORDS.length
  const current = stage >= 0 && !done ? WORDS[stage] : null

  return (
    <section ref={ref} aria-labelledby="bridge-title" className="relative bg-ink text-[#f1ece1]" style={{ height: reduce ? 'auto' : '340vh' }}>
      <div className={cn('flex flex-col justify-center overflow-hidden px-4 sm:px-6', reduce ? 'py-24' : 'sticky top-0 h-dvh')}>
        <div className="mx-auto w-full max-w-[1100px]">
          <p className="kicker !text-[#f0a27a]">Try it — one sentence, word by word</p>
          <h2 id="bridge-title" className="sr-only">
            Every word has its Arabic meaning
          </h2>

          {/* the sentence */}
          <p className="mt-6 font-display text-[clamp(2.6rem,9.5vw,7rem)] font-[520] leading-[1.02] tracking-[-0.03em]">
            <span className="sr-only">{WORDS.map((w) => w.en).join(' ')}</span>
            {WORDS.map((w, i) => (
              <span key={w.en} aria-hidden className="inline-block pr-[0.22em]">
                <span
                  className={cn(
                    'bg-no-repeat transition-[background-size,color] duration-500 ease-[cubic-bezier(.65,.05,.25,1)]',
                    i <= stage ? 'text-[#f1ece1]' : i === stage + 1 ? 'text-[#f1ece1]/80' : 'text-[#f1ece1]/30',
                  )}
                  style={{
                    backgroundImage: 'linear-gradient(#b9780c, #b9780c)',
                    backgroundPosition: '0 88%',
                    backgroundSize: i <= stage ? '100% 46%' : '0% 46%',
                    paddingInline: '0.05em',
                  }}
                >
                  {w.en}
                </span>
              </span>
            ))}
          </p>

          {/* the meaning of the current word, or the whole sentence at the end */}
          <div className="mt-10 min-h-[9.5rem] sm:min-h-[11rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={current.en}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.7, 0.3, 1] }}
                  className="flex flex-wrap items-end gap-x-6 gap-y-1"
                >
                  <span lang="ar" dir="rtl" className="font-ruqaa text-[clamp(3rem,10vw,6.5rem)] leading-none text-[#f5b83d]">
                    {current.ar}
                  </span>
                  <span className="pb-2 text-[15px] text-[#c3bcae]">
                    <span className="font-semibold text-[#f1ece1]">{current.en.replace(/[.,]/, '')}</span> · {current.pos}
                  </span>
                </motion.div>
              )}
              {done && (
                <motion.div key="all" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                  <p lang="ar" dir="rtl" className="font-ruqaa text-[clamp(2.4rem,8vw,5.4rem)] leading-[1.2] text-[#f5b83d]" style={{ textAlign: 'left' }}>
                    {SENTENCE_AR}
                  </p>
                  <p className="mt-3 max-w-xl text-[17px] text-[#c3bcae]">
                    A real request to Claude — and now you understand every word. That is how every lesson works: tap a word, see it in
                    Arabic, keep it.
                  </p>
                </motion.div>
              )}
              {stage < 0 && (
                <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[17px] text-[#c3bcae]">
                  Scroll to read it word by word ↓ <span lang="ar" className="mx-2">مرّر لتقرأها كلمةً كلمة</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* progress ticks */}
          <div aria-hidden className="mt-8 flex gap-2">
            {Array.from({ length: STAGES }, (_, i) => (
              <span key={i} className={cn('h-[3px] w-10 rounded-full transition-colors duration-300', i <= stage ? 'bg-[#f2a71b]' : 'bg-white/15')} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
