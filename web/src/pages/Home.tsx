import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Award, BookmarkCheck, Check, ChevronRight, Flame, GraduationCap, Languages, LifeBuoy, Lock, PlayCircle, TextSelect, Volume2 } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LiveChat } from '@/components/home/LiveChat'
import { Showcase } from '@/components/home/Showcase'
import { lazyWithPreload } from '@/lib/boot'
import { TranslatableText } from '@/components/translate/TranslatableText'
import { Badge } from '@/components/ui/badge'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { BlurFade } from '@/components/ui/blur-fade'
import { ButtonLink, buttonClass } from '@/components/ui/button'
import { useProfile } from '@/lib/profile'
import { Magnetic } from '@/components/ui/tilt'
import { WordReveal } from '@/components/ui/word-reveal'
import { useTranslator } from '@/context/TranslatorContext'
import { LESSON_COUNT, TRACK_COUNT } from '@/data/lessons/meta'

const homeLessons = () => import('./home/HomeLessons')
const TracksSection = lazyWithPreload(() => homeLessons().then((m) => ({ default: m.TracksSection })))
const VocabMarquee = lazyWithPreload(() => homeLessons().then((m) => ({ default: m.VocabMarquee })))
const LessonLineup = lazyWithPreload(() => homeLessons().then((m) => ({ default: m.LessonLineup })))
/** Everything the home page renders, so a prerendered home page can be taken over without a gap. */
export const preloadHome = () => Promise.all([TracksSection.preload(), VocabMarquee.preload(), LessonLineup.preload()])
const Onboarding = lazy(() => import('@/components/learn/Onboarding').then((m) => ({ default: m.Onboarding })))


export default function Home() {
  const { setPanelOpen } = useTranslator()
  const reduce = useReducedMotion()

  return (
    <>
      {/* ---------------- Hero: one message, one action, one live demo ---------------- */}
      <section className="relative">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-4 pb-20 pt-8 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-24">
          <div className="text-center lg:text-left">
            <BlurFade>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/70 px-3 py-1 text-[13px] font-medium text-fg-muted backdrop-blur">
                <span className="font-bold text-fg">
                  C<span className="text-brand">E</span>
                </span>
                <span className="h-3 w-px bg-border" aria-hidden />
                Learn Claude · Learn English
              </p>
            </BlurFade>
            <WordReveal
              text="Talk to AI. Speak better English."
              className="text-balance text-[44px] font-bold leading-[1.02] tracking-[-0.04em] sm:text-7xl lg:text-[76px]"
              wordClassName={(_, i) => (i >= 3 ? 'headline-gradient' : undefined)}
            />
            <BlurFade delay={0.35}>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-fg-muted sm:text-xl lg:mx-0">
                Short lessons on using Claude, in simple English. Tap any word to see its Arabic meaning.
              </p>
              <p lang="ar" data-ar-help dir="rtl" className="mx-auto mt-2 max-w-xl text-center text-base text-fg-subtle lg:mx-0 lg:text-left">
                دروس قصيرة لتعلّم Claude، مع ترجمة فورية لكل كلمة.
              </p>
            </BlurFade>
            <BlurFade delay={0.5}>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Magnetic>
                  <StartButton />
                </Magnetic>
                <ButtonLink to="/lessons" size="lg" variant="link" className="text-[17px]">
                  Browse all lessons <ChevronRight className="size-4" />
                </ButtonLink>
              </div>
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-fg-muted lg:justify-start">
                {['Free, no sign-up', `${LESSON_COUNT} lessons`, 'Official Anthropic sources'].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5">
                    <Check className="size-4 text-success" strokeWidth={3} aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </BlurFade>
          </div>

          <BlurFade delay={0.2} y={24} className="relative">
            {/* soft brand glow behind the demo */}
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[48px] bg-brand opacity-[0.14] blur-3xl" />
            <LiveChat />
          </BlurFade>
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="border-y border-border-soft bg-bg-alt">
        <div className="mx-auto grid max-w-[1024px] grid-cols-2 gap-y-8 px-4 py-12 text-center sm:px-6 md:grid-cols-4">
          {[
            { n: `${LESSON_COUNT}`, l: `lessons in ${TRACK_COUNT} tracks`, ar: 'درسًا في خمسة مسارات' },
            { n: '3,000+', l: 'words from A1 to C1', ar: 'كلمة من المبتدئ للمتقدم' },
            { n: '1 tap', l: 'to translate any word', ar: 'لترجمة أي كلمة' },
            { n: '100%', l: 'free, no sign-up', ar: 'مجاني بلا تسجيل' },
          ].map((s, i) => (
            <BlurFade key={s.l} delay={i * 0.08}>
              <p className="text-4xl font-bold tracking-tight sm:text-5xl">{s.n}</p>
              <p className="mt-1 text-sm text-fg-muted">{s.l}</p>
              <p lang="ar" data-ar-help className="text-center text-xs text-fg-subtle">{s.ar}</p>
            </BlurFade>
          ))}
        </div>
      </section>

      <Showcase />

      <Suspense fallback={<div className="min-h-[60vh]" aria-hidden />}>
        <TracksSection />
      </Suspense>

      {/* ---------------- Bento features ---------------- */}
      <section className="mx-auto max-w-[1024px] px-4 py-24 sm:px-6">
        <BlurFade>
          <h2 className="max-w-3xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-6xl">
            Everything you need. <span className="text-fg-subtle">Nothing you don’t.</span>
          </h2>
          <p lang="ar" data-ar-help dir="rtl" className="mt-3 text-left text-fg-muted">كل ما تحتاجه، ولا شيء زائد.</p>
        </BlurFade>

        <BlurFade delay={0.1} className="mt-12">
          <BentoGrid>
            <BentoCard
              className="md:col-span-4"
              eyebrow="Tap to translate"
              title="Every word speaks Arabic."
              description="Click or tap any word in a lesson. You get the meaning, the part of speech, and the correct pronunciation — instantly."
            >
              <div className="relative flex h-full min-h-40 items-end justify-center">
                <p className="text-2xl font-medium tracking-tight text-fg-muted sm:text-3xl">
                  Give Claude more{' '}
                  <span className="relative rounded-md bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] px-1 text-fg">
                    context
                    <span className="absolute bottom-[calc(100%+12px)] left-1/2 w-52 -translate-x-1/2 rounded-2xl border border-border-soft bg-surface p-3 text-left shadow-pop">
                      <span className="block text-sm font-semibold text-fg">context</span>
                      <span className="block text-[11px] text-fg-muted">noun · اسم</span>
                      <span lang="ar" dir="rtl" className="mt-1 block text-right text-xl font-semibold text-fg">سياق</span>
                    </span>
                  </span>
                  .
                </p>
              </div>
            </BentoCard>
            <BentoCard
              className="md:col-span-2"
              eyebrow="Listen"
              title="Hear it right."
              description="Native-like pronunciation for every word and sentence."
            >
              <div className="flex h-full items-center justify-center gap-1.5" aria-hidden>
                {[14, 28, 44, 30, 52, 36, 20, 40, 26, 12].map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-2 rounded-full bg-primary"
                    style={{ height: h }}
                    animate={reduce ? undefined : { scaleY: [1, 0.45, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.09, ease: 'easeInOut' }}
                  />
                ))}
                <Volume2 className="ml-3 size-7 text-primary" />
              </div>
            </BentoCard>
            <BentoCard
              className="md:col-span-2"
              eyebrow="Select"
              title="Whole sentences, too."
              description="Highlight any text and press Translate."
            >
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <p className="text-lg">
                  <span className="rounded bg-[color-mix(in_srgb,var(--primary)_22%,transparent)] px-0.5">Think step by step</span>.
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg">
                  <TextSelect className="size-4" /> Translate
                </span>
              </div>
            </BentoCard>
            <BentoCard
              className="md:col-span-2"
              eyebrow="Remember"
              title="Save & review."
              description="Build your personal word list and practise with flashcards."
            >
              <div className="relative flex h-full items-center justify-center">
                {['fluent', 'refine', 'context'].map((w, i) => (
                  <div
                    key={w}
                    className="absolute w-36 rounded-2xl border border-border-soft bg-surface p-4 text-center shadow-card"
                    style={{ transform: `rotate(${(i - 1) * 8}deg) translateX(${(i - 1) * 26}px)`, zIndex: i }}
                  >
                    <p className="font-semibold">{w}</p>
                    <BookmarkCheck className="mx-auto mt-2 size-4 text-clay" />
                  </div>
                ))}
              </div>
            </BentoCard>
            <BentoCard
              className="md:col-span-2"
              eyebrow="Practise"
              title="Prompt Lab."
              description="Build a perfect prompt step by step and get a live quality score."
            >
              <div className="flex h-full flex-col justify-center gap-2">
                {['Role', 'Task', 'Context', 'Format'].map((f, i) => (
                  <div key={f} className="flex items-center gap-3">
                    <span className="w-16 text-xs text-fg-muted">{f}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-alt">
                      <motion.div
                        className="h-full rounded-full bg-brand"
                        initial={{ width: '0%' }}
                        whileInView={{ width: `${[70, 100, 85, 60][i]}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.12, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          </BentoGrid>
        </BlurFade>
      </section>

      {/* ---------------- Path teaser ---------------- */}
      <section className="mx-auto max-w-[1024px] px-4 pb-24 sm:px-6">
        <div className="grid items-center gap-10 overflow-hidden rounded-[36px] border border-border-soft bg-bg-alt p-8 sm:p-12 md:grid-cols-2">
          <BlurFade>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">Learning path</p>
            <h2 className="mt-2 text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl">A path that keeps you going.</h2>
            <p className="mt-4 text-lg text-fg-muted">
              Unlock lessons one by one, earn XP, keep your daily streak, and collect badges. Smart reviews bring every word back
              right before you forget it.
            </p>
            <p lang="ar" data-ar-help className="mt-2 text-fg-subtle">مسار يحفّزك كل يوم: نقاط، وسلسلة أيام، وشارات، ومراجعة ذكية.</p>
            <ButtonLink to="/path" className="mt-7">
              See your path <ArrowRight className="size-4" />
            </ButtonLink>
          </BlurFade>
          <BlurFade delay={0.1}>
            <div className="relative mx-auto h-[340px] w-[260px]" aria-hidden>
              <svg className="absolute inset-0" width="260" height="340">
                <path d="M130 36 C130 80, 200 70, 200 116 C200 160, 130 150, 130 196 C130 240, 60 230, 60 276" fill="none" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" />
                <path d="M60 276 C60 300, 90 310, 110 330" fill="none" stroke="var(--border)" strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" />
              </svg>
              {[
                { x: 130, y: 36, s: 'done' },
                { x: 200, y: 116, s: 'done' },
                { x: 130, y: 196, s: 'done' },
                { x: 60, y: 276, s: 'current' },
              ].map((n, i) => (
                <span
                  key={i}
                  className={
                    'absolute grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ' +
                    (n.s === 'done' ? 'bg-success text-white dark:text-black' : 'bg-primary text-on-primary ring-8 ring-primary/20')
                  }
                  style={{ left: n.x, top: n.y }}
                >
                  {n.s === 'done' ? <Check className="size-7" strokeWidth={3} /> : <GraduationCap className="size-7" />}
                </span>
              ))}
              <span className="absolute bottom-0 right-2 grid size-12 place-items-center rounded-full bg-surface text-fg-subtle shadow-card">
                <Lock className="size-5" />
              </span>
              <div className="float-soft absolute -right-6 top-4 flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-semibold shadow-pop">
                <Flame className="size-4 fill-clay text-clay" /> 7 days
              </div>
              <div className="float-soft absolute -left-8 top-40 flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-semibold shadow-pop" style={{ animationDelay: '-3s' }}>
                <Award className="size-4 text-primary" /> +50 XP
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ---------------- Official sources ---------------- */}
      <section className="mx-auto max-w-[1024px] px-4 pb-24 sm:px-6">
        <BlurFade>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">Straight from the source</p>
          <h2 className="mt-2 max-w-3xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Built on Anthropic’s own guides.
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-fg-muted">
            Every lesson links to official material, so you can go deeper when you are ready.
          </p>
        </BlurFade>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: GraduationCap, t: 'Claude Academy', d: 'Free courses with certificates — Claude 101, AI Fluency, Claude Code and more.', ar: 'دورات مجانية بشهادات' },
            { icon: PlayCircle, t: 'Official videos', d: 'Talks and course videos from the Anthropic team, embedded in the lessons.', ar: 'فيديوهات رسمية من فريق Anthropic' },
            { icon: LifeBuoy, t: 'Docs & Help Center', d: 'Prompting best practices and a short guide for every Claude feature.', ar: 'الوثائق ومركز المساعدة' },
          ].map((c, i) => (
            <BlurFade key={c.t} delay={i * 0.06}>
              <Link to="/library" className="lift group flex h-full flex-col rounded-3xl border border-border-soft bg-surface p-7 shadow-card">
                <c.icon className="icon-pop size-8 text-clay" aria-hidden />
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{c.t}</h3>
                <p className="mt-2 text-[15px] text-fg-muted">{c.d}</p>
                <p lang="ar" data-ar-help className="mt-1 text-sm text-fg-subtle">{c.ar}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-link">
                  Open the library <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>

      <Suspense fallback={<div className="min-h-[60vh]" aria-hidden />}>
        <VocabMarquee />
      </Suspense>

      <Suspense fallback={<div className="min-h-[60vh]" aria-hidden />}>
        <LessonLineup />
      </Suspense>

      {/* ---------------- Before / after ---------------- */}
      <section className="mx-auto max-w-[1024px] px-4 pb-24 sm:px-6">
        <BlurFade>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">The difference</p>
          <h2 className="mt-2 max-w-3xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Better English. Better prompts. Better answers.
          </h2>
        </BlurFade>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <BlurFade delay={0.05}>
            <div className="h-full rounded-[28px] border border-border-soft bg-bg-alt p-8">
              <Badge tone="neutral">Before</Badge>
              <p className="mt-5 font-mono text-lg text-fg-muted">“Tell me about London.”</p>
              <p className="mt-6 text-sm text-fg-subtle">Vague. Claude has to guess what you want.</p>
            </div>
          </BlurFade>
          <BlurFade delay={0.12}>
            <div className="h-full rounded-[28px] border border-primary/30 bg-surface p-8 shadow-card">
              <Badge tone="primary">After</Badge>
              <TranslatableText
                className="mt-5 font-mono text-lg leading-relaxed"
                text="“I am visiting London for 3 days in winter with my two kids. Suggest a simple plan with one indoor activity per day. Use a numbered list.”"
                highlight={new Set(['visit', 'winter', 'suggest', 'indoor', 'activity', 'numbered'])}
              />
              <p className="mt-6 text-sm text-fg-muted">Specific. Claude knows the goal, the details and the format.</p>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="px-4 pb-28 sm:px-6">
        <BlurFade>
          <div className="relative mx-auto max-w-[1024px] overflow-hidden rounded-[36px] bg-ink px-6 py-20 text-center text-white dark:bg-surface">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ background: 'radial-gradient(600px circle at 20% 0%, rgba(240,122,69,.5), transparent 60%), radial-gradient(500px circle at 90% 100%, rgba(109,93,252,.5), transparent 60%)' }}
            />
            <div className="relative">
              <h2 className="text-balance text-4xl font-bold tracking-[-0.03em] sm:text-6xl">Your first prompt is waiting.</h2>
              <p lang="ar" className="mt-3 text-center text-lg text-white/70">طلبك الأول بانتظارك.</p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink to="/path" size="lg" className="bg-white text-black hover:bg-white/90">
                  Start learning — it’s free
                </ButtonLink>
                <button
                  onClick={() => setPanelOpen(true)}
                  className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full px-6 text-[17px] font-medium text-white/90 hover:bg-white/10"
                >
                  <Languages className="size-5" /> Open the translator
                </button>
              </div>
            </div>
          </div>
        </BlurFade>
      </section>
    </>
  )
}

/** First visit → two quick questions; afterwards straight to the path. */
function StartButton() {
  const { profile } = useProfile()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => (profile.onboarded ? navigate('/path') : setOpen(true))}
        className={buttonClass('primary', 'lg')}
      >
        Start learning — it’s free <ArrowRight className="size-5" />
      </button>
      {open && (
        <Suspense fallback={null}>
          <Onboarding open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  )
}
