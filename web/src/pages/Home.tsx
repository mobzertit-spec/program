import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { ArrowRight, BookmarkCheck, ChevronRight, Languages, MousePointerClick, TextSelect, Volume2, Wand2 } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { LessonIcon, levelTone } from '@/components/LessonIcon'
import { TranslatableText } from '@/components/translate/TranslatableText'
import { Badge } from '@/components/ui/badge'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { BlurFade } from '@/components/ui/blur-fade'
import { ButtonLink } from '@/components/ui/button'
import { Marquee } from '@/components/ui/marquee'
import { WordReveal } from '@/components/ui/word-reveal'
import { useTranslator } from '@/context/TranslatorContext'
import { lessons } from '@/data/lessons'

const demoPrompt =
  'You are a patient English teacher. Correct my paragraph below and explain each mistake in one simple sentence.'
const demoHighlight = new Set(['patient', 'correct', 'paragraph', 'explain', 'mistake', 'simple', 'sentence'])

const allVocab = lessons.flatMap((l) => l.vocab)

export default function Home() {
  const { setPanelOpen } = useTranslator()
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const demoScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.92])
  const demoOpacity = useTransform(scrollYProgress, [0, 0.9], [1, reduce ? 1 : 0.4])

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-18rem] h-[36rem] w-[64rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl dark:opacity-25"
          style={{ background: 'radial-gradient(closest-side, #f3c3ad, transparent), radial-gradient(closest-side at 70% 60%, #c7d7fe, transparent)' }}
        />
        <div className="relative mx-auto max-w-[1024px] px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-24">
          <BlurFade>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/70 px-3 py-1 text-[13px] font-medium text-fg-muted backdrop-blur">
              <span className="size-1.5 rounded-full bg-clay" />
              Learn Claude · Learn English
              <span lang="ar" className="text-fg-subtle">· تعلّم الاثنين معًا</span>
            </p>
          </BlurFade>
          <WordReveal
            text="Talk to AI. Speak better English."
            className="mx-auto max-w-4xl text-balance text-[44px] font-bold leading-[1.05] tracking-[-0.035em] sm:text-7xl md:text-[84px]"
            wordClassName={(_, i) => (i >= 3 ? 'headline-gradient' : undefined)}
          />
          <BlurFade delay={0.45}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-fg-muted sm:text-[21px]">
              Short, beautiful lessons that teach you how to use Claude — written in simple English, with an instant Arabic
              translation for every single word.
            </p>
            <p lang="ar" dir="rtl" className="mx-auto mt-3 max-w-xl text-center text-base text-fg-subtle">
              دروس قصيرة تعلّمك استخدام Claude بإنجليزية بسيطة، مع ترجمة عربية فورية لكل كلمة.
            </p>
          </BlurFade>
          <BlurFade delay={0.6}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink to="/lessons/meet-claude" size="lg">
                Start the first lesson <ArrowRight className="size-5" />
              </ButtonLink>
              <ButtonLink to="/lessons" size="lg" variant="link" className="text-[17px]">
                Browse all lessons <ChevronRight className="size-4" />
              </ButtonLink>
            </div>
          </BlurFade>
        </div>

        {/* Interactive demo */}
        <motion.div style={{ scale: demoScale, opacity: demoOpacity }} className="relative mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <BlurFade delay={0.75} y={32}>
            <div className="overflow-hidden rounded-[28px] border border-border-soft bg-surface shadow-pop">
              <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2 px-4 py-3">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs font-medium text-fg-subtle">Try it — click any word</span>
              </div>
              <div className="space-y-5 p-5 text-left sm:p-8">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-3xl rounded-br-md bg-primary px-5 py-3.5 text-[17px] leading-relaxed text-on-primary">
                    <TranslatableText as="span" text={demoPrompt} className="[&_.tw:hover]:bg-white/20 [&_.tw]:decoration-white/60" highlight={demoHighlight} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-clay-soft">
                    <Wand2 className="size-4 text-clay" />
                  </div>
                  <div className="max-w-[85%] rounded-3xl rounded-tl-md bg-bg-alt px-5 py-3.5 text-[17px] leading-relaxed">
                    <TranslatableText
                      as="span"
                      text="Of course! Please share your paragraph. I will be encouraging and keep every explanation short."
                      highlight={new Set(['share', 'encouraging', 'explanation'])}
                    />
                  </div>
                </div>
                <p className="flex items-center justify-center gap-2 pt-2 text-sm text-fg-muted">
                  <MousePointerClick className="size-4" /> Click an underlined word to see its Arabic meaning
                  <span lang="ar" className="hidden text-fg-subtle sm:inline">· اضغط على أي كلمة</span>
                </p>
              </div>
            </div>
          </BlurFade>
        </motion.div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="border-y border-border-soft bg-bg-alt">
        <div className="mx-auto grid max-w-[1024px] grid-cols-2 gap-y-8 px-4 py-12 text-center sm:px-6 md:grid-cols-4">
          {[
            { n: `${lessons.length}`, l: 'bite-sized lessons', ar: 'دروس قصيرة' },
            { n: `${allVocab.length}`, l: 'key words to master', ar: 'كلمة أساسية' },
            { n: '1 tap', l: 'to translate any word', ar: 'لترجمة أي كلمة' },
            { n: '100%', l: 'free, no sign-up', ar: 'مجاني بلا تسجيل' },
          ].map((s, i) => (
            <BlurFade key={s.l} delay={i * 0.08}>
              <p className="text-4xl font-bold tracking-tight sm:text-5xl">{s.n}</p>
              <p className="mt-1 text-sm text-fg-muted">{s.l}</p>
              <p lang="ar" className="text-center text-xs text-fg-subtle">{s.ar}</p>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ---------------- Bento features ---------------- */}
      <section className="mx-auto max-w-[1024px] px-4 py-24 sm:px-6">
        <BlurFade>
          <h2 className="max-w-3xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-6xl">
            Everything you need. <span className="text-fg-subtle">Nothing you don’t.</span>
          </h2>
          <p lang="ar" dir="rtl" className="mt-3 text-left text-fg-muted">كل ما تحتاجه، ولا شيء زائد.</p>
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
                        className="h-full rounded-full bg-gradient-to-r from-clay to-primary"
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

      {/* ---------------- Vocabulary marquee ---------------- */}
      <section className="overflow-hidden bg-bg-alt py-20">
        <BlurFade className="mx-auto mb-10 max-w-[1024px] px-4 sm:px-6">
          <h2 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Words you will actually use.</h2>
          <p className="mt-3 max-w-xl text-lg text-fg-muted">
            Every lesson teaches five practical English words — the same words you need to write great prompts.
          </p>
        </BlurFade>
        <div className="space-y-4">
          {[0, 1].map((row) => (
            <Marquee key={row} reverse={row === 1} duration={row ? 55 : 45}>
              {allVocab
                .filter((_, i) => i % 2 === row)
                .map((v) => (
                  <div key={v.word} className="flex items-center gap-3 rounded-full border border-border-soft bg-surface px-5 py-3 shadow-card">
                    <span className="font-semibold">{v.word}</span>
                    <span className="h-4 w-px bg-border" />
                    <span lang="ar" className="text-fg-muted">{v.ar}</span>
                  </div>
                ))}
            </Marquee>
          ))}
        </div>
      </section>

      {/* ---------------- Lesson lineup ---------------- */}
      <section className="py-24">
        <div className="mx-auto flex max-w-[1024px] items-end justify-between gap-4 px-4 sm:px-6">
          <BlurFade>
            <h2 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Explore the lessons.</h2>
            <p lang="ar" className="mt-2 text-fg-muted">اكتشف الدروس</p>
          </BlurFade>
          <Link to="/lessons" className="hidden shrink-0 items-center gap-1 text-link hover:underline sm:inline-flex">
            View all <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-6 sm:scroll-px-6 sm:px-6 lg:px-[max(1.5rem,calc((100vw-1024px)/2+1.5rem))]">
          {lessons.map((l, i) => (
            <BlurFade key={l.id} delay={Math.min(i, 4) * 0.06} className="snap-start">
              <Link
                to={`/lessons/${l.id}`}
                className="group flex h-[360px] w-[280px] flex-col justify-between rounded-[28px] border border-border-soft bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-pop"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-bg-alt">
                      <LessonIcon name={l.icon} className="size-6 text-clay" />
                    </span>
                    <span className="text-sm font-medium text-fg-subtle">{String(l.number).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight">{l.title}</h3>
                  <p lang="ar" className="mt-1 text-sm text-fg-muted">{l.titleAr}</p>
                  <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-fg-muted">{l.summary.en}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge tone={levelTone(l.level)}>{l.level}</Badge>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-link">
                    {l.minutes} min <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>

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
          <div className="relative mx-auto max-w-[1024px] overflow-hidden rounded-[36px] bg-[#1d1d1f] px-6 py-20 text-center text-white dark:bg-surface">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ background: 'radial-gradient(600px circle at 20% 0%, rgba(201,100,66,.45), transparent 60%), radial-gradient(500px circle at 90% 100%, rgba(0,113,227,.4), transparent 60%)' }}
            />
            <div className="relative">
              <h2 className="text-balance text-4xl font-bold tracking-[-0.03em] sm:text-6xl">Your first prompt is waiting.</h2>
              <p lang="ar" className="mt-3 text-center text-lg text-white/70">طلبك الأول بانتظارك.</p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink to="/lessons/meet-claude" size="lg" className="bg-white text-black hover:bg-white/90">
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
