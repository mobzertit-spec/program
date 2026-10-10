import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Art, type ArtName } from '@/components/art/Art'
import { ClipReveal, Glide } from '@/components/ui/glide'
import { Mark } from '@/components/ui/mark'
import { Marquee } from '@/components/ui/marquee'
import { lessons, lessonsByTrack, tracks } from '@/data/lessons'
import { isServer } from '@/lib/boot'

/* Home sections that need the lesson data — code-split so the first screen loads faster. */

const useIsoLayoutEffect = isServer ? () => {} : useLayoutEffect

function TrackCard({ index }: { index: number }) {
  const t = tracks[index]
  const count = lessonsByTrack(t.id).length
  return (
    <Link
      to="/path"
      className="group flex w-[78vw] max-w-[340px] shrink-0 snap-start flex-col sm:w-[340px] lg:w-[360px] lg:max-w-none"
      aria-label={`Track ${index + 1}: ${t.title} — ${count} lessons`}
    >
      <div className="rounded-[6px] bg-surface p-2 shadow-card transition-transform duration-500 ease-[cubic-bezier(.2,.7,.3,1)] group-hover:-translate-y-1.5 group-hover:rotate-[-0.6deg]">
        <ClipReveal delay={Math.min(index, 3) * 0.09}>
          <Art name={t.id as ArtName} sizes="(min-width: 1024px) 360px, 78vw" className="rounded-[3px]" />
        </ClipReveal>
      </div>
      <div className="mt-5 px-1">
        <p className="kicker !text-fg-subtle">
          Track {String(index + 1).padStart(2, '0')} · {count} lessons
        </p>
        <h3 className="mt-2 font-display text-[1.9rem] font-[560] leading-[1.05] tracking-[-0.02em]">{t.title}</h3>
        <p lang="ar" className="font-ruqaa mt-1 text-2xl text-fg-muted">
          {t.titleAr}
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">{t.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-link">
          Open the path <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

/**
 * The five tracks as printed covers. On large screens the row is pinned and scrolling the page slides it
 * sideways (vertical scroll → horizontal travel); on phones it is a normal swipeable row.
 */
export function TracksSection() {
  const section = useRef<HTMLElement>(null)
  const row = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [travel, setTravel] = useState(0)
  const [wide, setWide] = useState(false)
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const measure = () => {
      setWide(mq.matches && !reduce)
      if (row.current) setTravel(Math.max(0, row.current.scrollWidth - window.innerWidth + 48))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (row.current) ro.observe(row.current)
    mq.addEventListener('change', measure)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', measure)
    }
  }, [reduce])
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, -travel])

  const header = (
    <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
      <p className="kicker">Five tracks</p>
      <h2 className="mt-3 max-w-3xl text-balance text-[clamp(2.4rem,6vw,4.4rem)] font-[560] leading-[1.02]">
        <Glide>From your first message</Glide>
        <Glide delay={0.08}>
          to <Mark delay={0.5}>Claude Code</Mark>.
        </Glide>
      </h2>
      <p lang="ar" data-ar-help className="mt-3 text-fg-muted">
        خمسة مسارات: من رسالتك الأولى حتى Claude Code والدراسة.
      </p>
    </div>
  )

  if (wide)
    return (
      <section ref={section} aria-label="Tracks" className="relative" style={{ height: `calc(100vh + ${travel}px)` }}>
        <div className="sticky top-0 flex h-dvh flex-col justify-center gap-12 overflow-hidden pt-16">
          {header}
          <motion.div ref={row} style={{ x }} className="flex w-max gap-10 pl-[max(1.5rem,calc((100vw-1180px)/2+1.5rem))] pr-24">
            {tracks.map((t, i) => (
              <TrackCard key={t.id} index={i} />
            ))}
          </motion.div>
        </div>
      </section>
    )

  return (
    <section ref={section} aria-label="Tracks" className="py-24">
      {header}
      <div
        ref={row}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-6 sm:px-6 lg:px-[max(1.5rem,calc((100vw-1180px)/2+1.5rem))]"
      >
        {tracks.map((t, i) => (
          <TrackCard key={t.id} index={i} />
        ))}
      </div>
    </section>
  )
}

const allVocab = lessons.flatMap((l) => l.vocab)

/** Words you will actually use — two lines of type drifting in opposite directions, English over Arabic. */
export function VocabMarquee() {
  return (
    <section aria-labelledby="words-title" className="overflow-hidden border-y border-border-soft py-20">
      <div className="mx-auto mb-12 max-w-[1180px] px-4 sm:px-6">
        <p className="kicker">Vocabulary</p>
        <h2 id="words-title" className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-[560] leading-[1.04]">
          <Glide>
            Words you will <Mark delay={0.45}>actually use</Mark>.
          </Glide>
        </h2>
        <p className="mt-4 max-w-xl text-lg text-fg-muted">
          Every lesson teaches five practical words — the same words you need to write great prompts. Over 3,000 more wait in the word bank.
        </p>
      </div>
      <Marquee duration={70} gap="2.5rem">
        {allVocab.slice(0, 60).map((v) => (
          <span key={v.word} className="flex items-center gap-10 font-display text-[clamp(2rem,5vw,3.6rem)] font-[480] tracking-[-0.02em]">
            {v.word}
            <span aria-hidden className="size-2.5 rotate-45 bg-saffron" />
          </span>
        ))}
      </Marquee>
      <Marquee reverse duration={80} gap="2.5rem" className="mt-4">
        {allVocab.slice(0, 60).map((v) => (
          <span key={v.word} lang="ar" className="font-ruqaa flex items-center gap-10 text-[clamp(1.8rem,4.4vw,3rem)] text-fg-muted">
            {v.ar}
            <span aria-hidden className="size-2 rotate-45 bg-primary/60" />
          </span>
        ))}
      </Marquee>
    </section>
  )
}
