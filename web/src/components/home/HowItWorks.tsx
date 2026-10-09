import { AnimatePresence, motion, useInView, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { TranslatableText } from '@/components/translate/TranslatableText'
import { Mark } from '@/components/ui/mark'
import { cn } from '@/lib/utils'

const shot = (name: string, theme: 'light' | 'dark') => `${import.meta.env.BASE_URL}shots/${name}-${theme}.webp`

/**
 * A real screenshot of CE that follows the site theme (the hidden one is never downloaded).
 * Images are added only when they come near the screen; until then a box of the same size holds their place.
 */
function Shot({ name, alt, eager }: { name: string; alt: string; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const near = useInView(ref, { once: true, margin: '500px' })
  return (
    <div ref={ref} className="bg-bg-alt" style={{ aspectRatio: '600 / 1298' }}>
      {(near || eager) && (
        <>
          <img src={shot(name, 'light')} alt={alt} width={600} height={1298} loading="lazy" decoding="async" className="block h-auto w-full dark:hidden" />
          <img src={shot(name, 'dark')} alt={alt} width={600} height={1298} loading="lazy" decoding="async" className="hidden h-auto w-full dark:block" />
        </>
      )}
    </div>
  )
}

function Phone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative rounded-[40px] bg-ink p-2 shadow-pop ring-1 ring-black/5 dark:ring-white/10', className)}>
      <span aria-hidden className="absolute left-1/2 top-3.5 z-10 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-ink" />
      <div className="overflow-hidden rounded-[33px]">{children}</div>
    </div>
  )
}

const STEPS = [
  {
    n: '01',
    shot: 'lesson-read-phone',
    alt: 'A CE lesson on a phone: a short paragraph in simple English with its Arabic translation',
    title: ['Read for', 'five minutes.'],
    mark: 1,
    text: 'Every lesson is short and written in simple English, with the Arabic version one tap away. You learn one idea about Claude — and the words to talk about it.',
    ar: 'دروس قصيرة بإنجليزية بسيطة، والنسخة العربية على بُعد ضغطة.',
  },
  {
    n: '02',
    shot: 'lesson-phone',
    alt: 'A CE lesson on a phone, with the Arabic meaning of a word open',
    title: ['Tap any', 'word.'],
    mark: 1,
    text: 'See the meaning, the part of speech and the sound. Select a whole sentence to translate it. Nothing to install.',
    ar: 'اضغط على أي كلمة لترى معناها ونطقها.',
  },
  {
    n: '03',
    shot: 'words-phone',
    alt: 'A flashcard review of saved words on a phone',
    title: ['Keep the words', 'you need.'],
    mark: 0,
    text: 'Save a word and CE brings it back just before you would forget it — a few cards a day, with your own voice to practise.',
    ar: 'احفظ الكلمة، وتعود إليك قبل أن تنساها.',
  },
  {
    n: '04',
    shot: 'path-phone',
    alt: 'The CE learning path on a phone, with the next lesson ready to start',
    title: ['Follow', 'your path.'],
    mark: 1,
    text: 'One lesson unlocks the next. Keep a daily streak, collect badges, and finish each track with a certificate.',
    ar: 'درس يفتح الذي بعده، وشهادة في نهاية كل مسار.',
  },
]

/**
 * How it works — scrollytelling: on large screens the phone stays in place while the steps scroll past it,
 * and its screen changes with the step you are reading. On phones each step shows its own screenshot.
 */
export function HowItWorks() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start center', 'end center'] })

  return (
    <section aria-labelledby="how-title" className="relative mx-auto max-w-[1180px] px-4 py-24 sm:px-6 lg:py-32">
      <div className="max-w-2xl">
        <p className="kicker">How it works</p>
        <h2 id="how-title" className="mt-3 text-balance text-[clamp(2.4rem,6vw,4.4rem)] font-[560] leading-[1.02]">
          Small steps. <span className="text-fg-subtle">Every day.</span>
        </h2>
        <p lang="ar" data-ar-help className="font-ruqaa mt-2 text-3xl text-fg-muted">
          خطوات صغيرة، كل يوم.
        </p>
      </div>

      <div ref={wrap} className="relative mt-16 grid gap-20 lg:mt-24 lg:grid-cols-[1fr_380px] lg:gap-24">
        {/* the steps */}
        <ol className="relative space-y-24 lg:space-y-0">
          {/* a hairline that fills as you read */}
          <span aria-hidden className="absolute bottom-0 left-[1.15rem] top-0 hidden w-px bg-border lg:block" />
          <motion.span
            aria-hidden
            style={{ scaleY: reduce ? 1 : scrollYProgress }}
            className="absolute bottom-0 left-[1.15rem] top-0 hidden w-[2px] origin-top bg-saffron lg:block"
          />
          {STEPS.map((s, i) => (
            <Step key={s.n} index={i} onActive={setActive}>
              <div className="lg:flex lg:min-h-[78vh] lg:items-center lg:pl-16">
                <div className="max-w-xl">
                  <p className="font-display text-[15px] font-semibold text-clay">{s.n}</p>
                  <h3 className="mt-2 font-display text-[clamp(2rem,4.6vw,3.4rem)] font-[560] leading-[1.04] tracking-[-0.02em]">
                    {s.title.map((t, j) => (
                      <span key={j} className="block">
                        {j === s.mark ? <Mark>{t}</Mark> : t}
                      </span>
                    ))}
                  </h3>
                  <TranslatableText text={s.text} className="mt-5 text-pretty text-lg leading-relaxed text-fg-muted" />
                  <p lang="ar" data-ar-help className="mt-2 text-fg-subtle">
                    {s.ar}
                  </p>
                  {/* phones: the screenshot sits under its step */}
                  <Phone className="mx-auto mt-10 w-[248px] -rotate-1 lg:hidden">
                    <Shot name={s.shot} alt={s.alt} />
                  </Phone>
                </div>
              </div>
            </Step>
          ))}
        </ol>

        {/* large screens: one phone that stays while the steps scroll */}
        <div className="hidden lg:block">
          <div className="sticky top-[calc(50vh-330px)]">
            <Phone className="w-[310px] rotate-[1.5deg]">
              <div className="relative" style={{ aspectRatio: '600 / 1298' }}>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={STEPS[active].shot}
                    initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.2, 0.7, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Shot name={STEPS[active].shot} alt={STEPS[active].alt} eager />
                  </motion.div>
                </AnimatePresence>
              </div>
            </Phone>
            <p aria-hidden className="mt-6 text-center font-display text-sm text-fg-subtle">
              {STEPS[active].n} / 04
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Step({ index, onActive, children }: { index: number; onActive: (i: number) => void; children: React.ReactNode }) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])
  return <li ref={ref}>{children}</li>
}
