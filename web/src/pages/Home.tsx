import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { lazy, Suspense, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Art } from '@/components/art/Art'
import { ZelligePattern } from '@/components/art/Zellige'
import { Bridge } from '@/components/home/Bridge'
import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Mascot } from '@/components/mascot/Mascot'
import { buttonClass } from '@/components/ui/button'
import { Glide } from '@/components/ui/glide'
import { Mark } from '@/components/ui/mark'
import { lazyWithPreload } from '@/lib/boot'
import { useProfile } from '@/lib/profile'

const homeLessons = () => import('./home/HomeLessons')
const TracksSection = lazyWithPreload(() => homeLessons().then((m) => ({ default: m.TracksSection })))
const VocabMarquee = lazyWithPreload(() => homeLessons().then((m) => ({ default: m.VocabMarquee })))
/** Everything the home page renders, so a prerendered home page can be taken over without a gap. */
export const preloadHome = () => Promise.all([TracksSection.preload(), VocabMarquee.preload()])
const Onboarding = lazy(() => import('@/components/learn/Onboarding').then((m) => ({ default: m.Onboarding })))

export default function Home() {
  return (
    <>
      <Hero start={<StartButton />} />
      <Bridge />
      <HowItWorks />
      <Suspense fallback={<div className="min-h-[80vh]" aria-hidden />}>
        <TracksSection />
        <VocabMarquee />
      </Suspense>
      <Sources />
      <FinalCta />
    </>
  )
}

const SOURCES = [
  {
    n: 'I',
    title: 'Claude Academy',
    ar: 'دورات Claude Academy',
    text: 'Free courses with certificates — Claude 101, AI Fluency, Claude Code and more. Every lesson links to the right one.',
  },
  {
    n: 'II',
    title: 'Official videos',
    ar: 'فيديوهات رسمية',
    text: 'Talks and course videos from the Anthropic team, embedded right inside the lessons.',
  },
  {
    n: 'III',
    title: 'Docs & Help Center',
    ar: 'الوثائق ومركز المساعدة',
    text: 'Prompting best practices and a short guide for every Claude feature, when you want to go deeper.',
  },
]

/** Straight from the source — an editorial three-column list, hairlines instead of cards. */
function Sources() {
  return (
    <section aria-labelledby="sources-title" className="relative mx-auto max-w-[1180px] px-4 py-24 sm:px-6 lg:py-32">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <p className="kicker">Straight from the source</p>
          <h2 id="sources-title" className="mt-3 text-balance text-[clamp(2.2rem,5vw,3.8rem)] font-[560] leading-[1.04]">
            <Glide>Built on Anthropic’s</Glide>
            <Glide delay={0.08}>
              <Mark delay={0.5}>own guides</Mark>.
            </Glide>
          </h2>
          <p lang="ar" data-ar-help className="mt-3 text-fg-muted">
            كل درس يرتبط بمصادر Anthropic الرسمية لتتعمّق متى شئت.
          </p>
        </div>
        <ol className="border-t border-fg/80">
          {SOURCES.map((s) => (
            <li key={s.n}>
              <Link to="/library" className="group grid grid-cols-[3rem_1fr_auto] items-start gap-4 border-b border-border py-7">
                <span className="font-display text-xl italic text-clay">{s.n}</span>
                <span>
                  <span className="block font-display text-[1.65rem] font-[560] leading-tight tracking-[-0.015em]">{s.title}</span>
                  <span lang="ar" data-ar-help className="block text-fg-subtle">
                    {s.ar}
                  </span>
                  <span className="mt-2 block text-[15px] leading-relaxed text-fg-muted">{s.text}</span>
                </span>
                <ArrowUpRight className="mt-2 size-5 text-fg-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-link" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** The closing spread: the bridge print widens as it scrolls in, and the invitation sits on paper over it. */
function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 1.12, 1])
  const inset = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['6%', '0%'])

  return (
    <section ref={ref} aria-labelledby="cta-title" className="relative overflow-hidden px-4 pb-24 sm:px-6 lg:pb-32">
      <motion.div style={{ marginInline: inset }} className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[6px]">
        <motion.div style={{ scale }}>
          <Art name="bridge" sizes="100vw" className="min-h-[520px] sm:min-h-0" imgClassName="object-[50%_60%]" />
        </motion.div>
      </motion.div>
      <div className="relative mx-auto -mt-40 max-w-[760px] sm:-mt-56">
        <div className="relative overflow-hidden rounded-[6px] bg-surface px-6 py-10 text-center shadow-pop sm:px-12 sm:py-14">
          <ZelligePattern className="text-border opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" cell={44} />
          <Mascot pose="wave" size={92} className="relative mx-auto -mt-2" />
          <h2 id="cta-title" className="relative mt-4 text-balance text-[clamp(2.2rem,6vw,3.8rem)] font-[560] leading-[1.04]">
            <Glide>Every word is a</Glide>
            <Glide delay={0.08}>
              <Mark delay={0.5}>small bridge</Mark>.
            </Glide>
          </h2>
          <p lang="ar" dir="rtl" className="font-ruqaa relative mt-2 text-[clamp(1.8rem,5vw,2.6rem)] text-fg-muted" style={{ textAlign: 'center' }}>
            كلُّ كلمةٍ جسرٌ صغير.
          </p>
          <p className="relative mx-auto mt-5 max-w-md text-lg text-fg-muted">
            Five minutes a day. Free, no sign-up — your progress stays on your device.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <StartButton />
            <Link to="/path" className={buttonClass('secondary', 'lg')}>
              See the path
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function StartButton() {
  const { profile } = useProfile()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => (profile.onboarded ? navigate('/path') : setOpen(true))} className={buttonClass('primary', 'lg')}>
        Start learning — free <ArrowRight className="size-5" />
      </button>
      {open && (
        <Suspense fallback={null}>
          <Onboarding open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  )
}
