import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { BlurFade } from '@/components/ui/blur-fade'
import { cn } from '@/lib/utils'

const shot = (name: string, theme: 'light' | 'dark') => `${import.meta.env.BASE_URL}shots/${name}-${theme}.webp`

/**
 * A real screenshot of CE that follows the site theme (the hidden one is never downloaded).
 * Images are added only when they come near the screen, so they never compete with the first paint;
 * until then a box of the same size holds their place (no layout shift).
 */
function Shot({ name, alt, width, height, className }: { name: string; alt: string; width: number; height: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const near = useInView(ref, { once: true, margin: '400px' })
  return (
    <div ref={ref} className="bg-bg-alt" style={{ aspectRatio: `${width} / ${height}` }}>
      {near && (
        <>
          <img src={shot(name, 'light')} alt={alt} width={width} height={height} loading="lazy" decoding="async" className={cn('block h-auto w-full dark:hidden', className)} />
          <img src={shot(name, 'dark')} alt={alt} width={width} height={height} loading="lazy" decoding="async" className={cn('hidden h-auto w-full dark:block', className)} />
        </>
      )}
    </div>
  )
}

function Phone({ name, alt }: { name: string; alt: string }) {
  return (
    <div className="relative rounded-[44px] bg-[#0b0c1a] p-2.5 shadow-pop ring-1 ring-white/10">
      <span aria-hidden className="absolute left-1/2 top-4 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-[#0b0c1a]" />
      <div className="overflow-hidden rounded-[36px]">
        <Shot name={name} alt={alt} width={600} height={1298} />
      </div>
    </div>
  )
}

const PHONES = [
  { name: 'lesson-phone', alt: 'A CE lesson on a phone, with the Arabic meaning of “purpose” open', title: 'Tap any word', text: 'The meaning, the part of speech and the sound — in one tap.', ar: 'اضغط على أي كلمة لترى معناها' },
  { name: 'path-phone', alt: 'The CE learning path on a phone, with the next lesson ready to start', title: 'Follow your path', text: 'One lesson unlocks the next. Collect stars as you go.', ar: 'تقدّم خطوة بخطوة واجمع النجوم' },
  { name: 'words-phone', alt: 'A flashcard review of saved words on a phone', title: 'Keep every word', text: 'Smart reviews bring words back just before you forget them.', ar: 'مراجعة ذكية قبل أن تنسى' },
]

/** "See it in action": the real product in a laptop and three phones. */
export function Showcase() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  // the laptop screen opens towards you as it scrolls in (Apple-style)
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 22, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.92, 1])

  return (
    <section className="mx-auto max-w-[1100px] px-4 py-24 sm:px-6" aria-labelledby="showcase-title">
      <BlurFade className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">See it in action</p>
        <h2 id="showcase-title" className="mx-auto mt-2 max-w-3xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-6xl">
          Made for your phone. <span className="text-fg-subtle">Ready on your laptop.</span>
        </h2>
        <p lang="ar" data-ar-help className="mt-3 text-center text-fg-muted">مصمَّم لهاتفك، وجاهز على حاسوبك.</p>
      </BlurFade>

      <div ref={ref} className="mt-14 [perspective:1400px]">
        <motion.div style={{ rotateX, scale, transformOrigin: 'center bottom' }} className="mx-auto max-w-[900px]">
          <div className="rounded-t-[22px] bg-[#0b0c1a] p-2.5 pb-3 shadow-pop ring-1 ring-white/10 sm:p-3.5">
            <div className="overflow-hidden rounded-[12px]">
              <Shot name="lesson-laptop" alt="A CE lesson on a laptop, with an instant Arabic translation" width={1600} height={1000} />
            </div>
          </div>
          <div aria-hidden className="relative mx-auto h-4 w-[106%] -translate-x-[3%] rounded-b-[18px] bg-gradient-to-b from-[#c9ccd8] to-[#9da1b3] dark:from-[#3a3e52] dark:to-[#23263a]">
            <span className="absolute left-1/2 top-0 h-1.5 w-28 -translate-x-1/2 rounded-b-lg bg-black/15" />
          </div>
        </motion.div>
      </div>

      {/* phones: side by side on desktop, a swipeable row on small screens */}
      <div className="no-scrollbar -mx-4 mt-20 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:px-0">
        {PHONES.map((p, i) => (
          <BlurFade key={p.name} delay={i * 0.08} className="w-[68vw] max-w-[280px] shrink-0 snap-center md:w-auto md:max-w-none">
            <div className={cn('lift mx-auto max-w-[270px]', i === 1 && 'md:-translate-y-8')}>
              <Phone name={p.name} alt={p.alt} />
            </div>
            <h3 className="mt-6 text-center text-xl font-semibold tracking-tight">{p.title}</h3>
            <p className="mx-auto mt-1 max-w-[260px] text-center text-[15px] text-fg-muted">{p.text}</p>
            <p lang="ar" data-ar-help className="text-center text-sm text-fg-subtle">{p.ar}</p>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}
