import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { Art } from '@/components/art/Art'
import { StarOrnament } from '@/components/art/Zellige'
import { ButtonLink } from '@/components/ui/button'
import { isServer, isTakeover } from '@/lib/boot'
import { LESSON_COUNT } from '@/data/lessons/meta'

/**
 * Editorial hero: one sentence in two scripts, one action, one printed illustration.
 * The illustration drifts slower than the page and the note pinned on it a little faster (depth on scroll).
 */
export function Hero({ start }: { start: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const k = reduce ? 0 : 1
  const artY = useTransform(scrollYProgress, [0, 1], [0, 90 * k])
  const artRotate = useTransform(scrollYProgress, [0, 1], [-2, -2 + 3 * k])
  const noteY = useTransform(scrollYProgress, [0, 1], [0, -70 * k])
  // the highlighter stroke in the headline draws itself, except on the prerendered first paint
  const draw = !isServer && !isTakeover() && !reduce

  return (
    <section ref={ref} className="relative overflow-hidden">
      <StarOrnament className="absolute -right-24 -top-24 hidden size-[520px] text-border lg:block" />
      <div className="relative mx-auto grid max-w-[1180px] gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-20">
        <div>
          <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Free</span>
            <span aria-hidden className="h-px w-6 bg-clay/50" />
            <span>English ⇄ العربية</span>
            <span aria-hidden className="h-px w-6 bg-clay/50" />
            <span>{LESSON_COUNT} lessons</span>
          </p>
          <h1 className="mt-6 text-balance text-[clamp(2.9rem,11vw,6.1rem)] font-[560] leading-[0.98] tracking-[-0.03em]">
            English, <span className={draw ? 'hl hl-draw' : 'hl'}>one word</span> at a time.
          </h1>
          <p lang="ar" dir="rtl" className="font-ruqaa mt-4 text-[clamp(2rem,7vw,3.4rem)] leading-[1.35] text-fg-muted" style={{ textAlign: 'left' }}>
            الإنجليزية، كلمةً كلمة.
          </p>
          <p className="mt-6 max-w-[34rem] text-pretty text-lg leading-relaxed text-fg-muted sm:text-xl">
            Short lessons that teach you to use Claude, the AI assistant — in simple English, with the Arabic meaning of every word one tap away.
          </p>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {start}
            <ButtonLink to="/lessons" variant="link" size="lg" className="text-[16px] font-medium">
              See all {LESSON_COUNT} lessons <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <motion.figure style={{ y: artY, rotate: artRotate }} className="relative rounded-[6px] bg-surface p-2.5 shadow-pop sm:p-3.5">
            <Art name="hero" eager sizes="(min-width: 1024px) 520px, 92vw" className="rounded-[3px]" />
            <figcaption className="sr-only">A study desk: a notebook, a phone with a chat, mint tea.</figcaption>
          </motion.figure>
          {/* a note pinned to the print — the way every word in CE works */}
          <motion.div
            style={{ y: noteY }}
            aria-hidden
            className="absolute -bottom-6 left-3 w-[208px] rotate-[3deg] rounded-[4px] border border-border-soft bg-surface px-4 py-3 shadow-card sm:-left-8 sm:bottom-10"
          >
            <p className="flex items-baseline justify-between gap-2">
              <span className="font-display text-[22px] font-semibold">notebook</span>
              <span className="text-[11px] text-fg-subtle">noun</span>
            </p>
            <p lang="ar" dir="rtl" className="font-ruqaa text-[26px] leading-tight text-primary" style={{ textAlign: 'right' }}>
              دفتر
            </p>
            <span className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 -rotate-2 bg-saffron/70" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
