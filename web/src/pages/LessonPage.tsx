import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Copy,
  Lightbulb,
  MousePointerClick,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { LessonIcon, levelTone } from '@/components/LessonIcon'
import { Parallax, TrackArt } from '@/components/art/TrackArt'
import { ResourceCard } from '@/components/learn/ResourceCard'
import { SpeakCheck } from '@/components/learn/SpeakCheck'
import { VideoEmbed } from '@/components/learn/VideoEmbed'
import { TranslatableText } from '@/components/translate/TranslatableText'
import { Badge } from '@/components/ui/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { useApp } from '@/context/AppContext'
import { POS_AR } from '@/data/dictionary'
import { getLesson, lessons, lessonsByTrack, trackOf, type Bilingual, type Lesson, type QuizQuestion, type VocabItem } from '@/data/lessons'
import { isUnlocked } from '@/lib/path'
import { canSpeak, speak } from '@/lib/speech'
import { LessonFeedback } from '@/components/learn/LessonFeedback'
import { useDocumentTitle } from '@/lib/meta'
import { cn } from '@/lib/utils'

export default function LessonPage() {
  const { id = '' } = useParams()
  const lesson = getLesson(id)
  if (!lesson) return <Navigate to="/lessons" replace />
  return <LessonView key={lesson.id} lesson={lesson} />
}

function LessonView({ lesson }: { lesson: Lesson }) {
  useDocumentTitle(lesson.title)
  const { completed, markComplete, showArabic, setShowArabic } = useApp()
  const highlight = useMemo(() => new Set(lesson.vocab.map((v) => v.word)), [lesson])
  const idx = lessons.findIndex((l) => l.id === lesson.id)
  const prev = lessons[idx - 1]
  const next = lessons[idx + 1]
  const isDone = completed.includes(lesson.id)
  const track = trackOf(lesson.track)
  const locked = !isUnlocked(lesson, completed)
  const trackLessons = lessonsByTrack(lesson.track)
  const prevInTrack = trackLessons[trackLessons.findIndex((l) => l.id === lesson.id) - 1]

  return (
    <article>

      {/* Header */}
      <header className="relative overflow-hidden border-b border-border-soft bg-bg-alt">
        <Parallax className="absolute right-[max(1.5rem,calc((100vw-1180px)/2))] top-20 hidden w-[230px] xl:block" distance={24}>
          <TrackArt track={lesson.track} />
        </Parallax>
        <div className="mx-auto max-w-[760px] px-4 pb-12 pt-8 sm:px-6 sm:pt-10">
          <Link to="/path" className="inline-flex items-center gap-1 text-sm text-link hover:underline">
            <ChevronLeft className="size-4" /> Learning path
          </Link>
          <BlurFade>
            <div className="mt-8 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-surface shadow-card">
                <LessonIcon name={lesson.icon} className="size-6 text-clay" />
              </span>
              <span className="text-sm font-medium text-fg-muted">
                Lesson {lesson.number} of {lessons.length} · {track.title} <span lang="ar" data-ar-help className="text-fg-subtle">{track.titleAr}</span>
              </span>
            </div>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-[-0.03em] sm:text-6xl">{lesson.title}</h1>
            <p lang="ar" className="mt-2 text-xl text-fg-muted">{lesson.titleAr}</p>
            <TranslatableText text={lesson.summary.en} className="mt-5 text-lg leading-relaxed text-fg-muted sm:text-xl" highlight={highlight} />
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge tone={levelTone(lesson.level)}>{lesson.level}</Badge>
              <Badge>
                <Clock className="size-3" /> {lesson.minutes} min read
              </Badge>
              {isDone && (
                <Badge tone="success">
                  <CheckCircle2 className="size-3" /> Completed
                </Badge>
              )}
            </div>
          </BlurFade>
        </div>
      </header>

      <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6">
        {locked && prevInTrack && (
          <p className="mb-4 rounded-2xl bg-clay-soft px-4 py-3 text-sm text-fg">
            On your path, this lesson comes after{' '}
            <Link to={`/lessons/${prevInTrack.id}`} className="font-medium text-link hover:underline">
              {prevInTrack.title}
            </Link>
            . You can still read it now.
          </p>
        )}
        <div className="mb-12 flex items-start gap-3 rounded-2xl border border-border-soft bg-surface p-4 text-sm text-fg-muted shadow-card">
          <MousePointerClick className="mt-0.5 size-5 shrink-0 text-primary" />
          <p>
            <strong className="text-fg">Click any word</strong> to translate it. <strong className="text-fg">Select a sentence</strong> to
            translate the whole phrase. Tap <span className="font-arabic font-semibold text-fg">ع</span> to see the Arabic version of a paragraph.
            <span lang="ar" data-ar-help dir="rtl" className="mt-1 block text-right text-fg-subtle">
              اضغط على أي كلمة لترجمتها، أو حدّد جملة كاملة لترجمتها.
            </span>
            <button
              onClick={() => setShowArabic(!showArabic)}
              aria-pressed={showArabic}
              className="mt-3 inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full border border-border-soft px-3 text-sm font-medium text-fg hover:bg-bg-alt"
            >
              <span className="font-arabic">ع</span> {showArabic ? 'Hide all Arabic translations' : 'Show all Arabic translations'}
            </button>
          </p>
        </div>

        {/* Reading */}
        {lesson.sections.map((s, i) => (
          <section key={i} className="mb-12">
            <BlurFade>
              <TranslatableText as="h2" text={s.heading} className="text-2xl font-semibold tracking-tight sm:text-3xl" highlight={highlight} />
              <p lang="ar" data-ar-help className="mt-1 text-sm text-fg-subtle">{s.headingAr}</p>
            </BlurFade>
            <div className="mt-5 space-y-5">
              {s.paragraphs.map((p, j) => (
                <Paragraph key={j} p={p} highlight={highlight} />
              ))}
            </div>
          </section>
        ))}

        {lesson.video && (
          <section className="my-14" aria-labelledby="watch-title">
            <h2 id="watch-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Watch</h2>
            <p lang="ar" data-ar-help className="mt-1 text-sm text-fg-subtle">شاهد — فيديو رسمي من Anthropic (فعّل الترجمة الإنجليزية)</p>
            <VideoEmbed video={lesson.video} className="mt-6" />
          </section>
        )}

        {lesson.example && <PromptCompare example={lesson.example} highlight={highlight} />}

        {/* Tip */}
        <BlurFade>
          <aside className="my-14 rounded-3xl bg-clay-soft p-6 sm:p-8">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-clay">
              <Lightbulb className="size-4" /> Pro tip
            </p>
            <TranslatableText text={lesson.tip.en} className="mt-3 text-lg leading-relaxed text-fg" highlight={highlight} />
            <p lang="ar" data-ar-help dir="rtl" className="mt-2 text-right text-fg-muted">{lesson.tip.ar}</p>
          </aside>
        </BlurFade>

        {/* Vocabulary */}
        <section className="my-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Key vocabulary</h2>
          <p lang="ar" data-ar-help className="mt-1 text-sm text-fg-subtle">مفردات الدرس</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {lesson.vocab.map((v, i) => (
              <BlurFade key={v.word} delay={i * 0.05}>
                <VocabCard v={v} />
              </BlurFade>
            ))}
          </div>
        </section>

        {/* Quiz */}
        <Quiz lesson={lesson} />

        {/* Go deeper */}
        <section className="my-16" aria-labelledby="deeper-title">
          <h2 id="deeper-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Go deeper</h2>
          <p lang="ar" data-ar-help className="mt-1 text-sm text-fg-subtle">تعمّق أكثر — مصادر رسمية من Anthropic</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {lesson.resources.map((r) => (
              <ResourceCard key={r.url} r={r} />
            ))}
          </div>
        </section>

        {/* Complete + nav */}
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-border-soft pt-10 text-center">
          {isDone ? (
            <p className="inline-flex items-center gap-2 text-lg font-medium text-success">
              <CheckCircle2 className="size-6" /> Lesson completed
            </p>
          ) : (
            <Button
              size="lg"
              onClick={() => markComplete(lesson.id)}
            >
              <Check className="size-5" /> Mark lesson as complete
            </Button>
          )}
        </div>

        <LessonFeedback lessonId={lesson.id} />

        <nav aria-label="Lesson navigation" className="mt-10 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link to={`/lessons/${prev.id}`} className="group rounded-2xl border border-border-soft p-5 transition-colors hover:bg-bg-alt">
              <span className="flex items-center gap-1 text-sm text-fg-muted">
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" /> Previous
              </span>
              <span className="mt-1 block font-semibold">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/lessons/${next.id}`} className="group rounded-2xl border border-border-soft p-5 text-right transition-colors hover:bg-bg-alt">
              <span className="flex items-center justify-end gap-1 text-sm text-fg-muted">
                Next <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 block font-semibold">{next.title}</span>
            </Link>
          )}
        </nav>
      </div>
    </article>
  )
}

function Paragraph({ p, highlight }: { p: Bilingual; highlight: Set<string> }) {
  const { showArabic } = useApp()
  const [local, setLocal] = useState(false)
  const visible = showArabic || local
  return (
    <BlurFade>
      <div className="group relative">
        <TranslatableText text={p.en} className="pr-10 text-[19px] leading-[1.75] text-fg" highlight={highlight} />
        <button
          onClick={() => setLocal(!local)}
          aria-pressed={visible}
          aria-label={visible ? 'Hide Arabic translation' : 'Show Arabic translation'}
          className={cn(
            'absolute right-0 top-0.5 grid size-9 cursor-pointer place-items-center rounded-full font-arabic text-base transition-all',
            visible ? 'bg-fg text-bg' : 'text-fg-subtle opacity-70 hover:bg-bg-alt hover:text-fg group-hover:opacity-100',
          )}
        >
          ع
        </button>
        <AnimatePresence initial={false}>
          {visible && (
            <motion.p
              lang="ar"
              dir="rtl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden text-right text-[17px] leading-loose text-fg-muted"
            >
              <span className="mt-2 block border-r-2 border-clay pr-4">{p.ar}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </BlurFade>
  )
}

function PromptCompare({ example, highlight }: { example: NonNullable<Lesson['example']>; highlight: Set<string> }) {
  const toast = useToast()
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(example.good)
      toast('Prompt copied')
    } catch {
      toast('Could not copy — select the text instead')
    }
  }
  return (
    <section className="my-14">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">See the difference</h2>
      <p lang="ar" data-ar-help className="mt-1 text-sm text-fg-subtle">لاحظ الفرق</p>
      <div className="mt-6 grid gap-3">
        <BlurFade>
          <div className="rounded-3xl border border-border-soft bg-bg-alt p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-danger">
              <ThumbsDown className="size-4" /> Weak prompt
            </p>
            <TranslatableText text={example.bad} className="mt-3 whitespace-pre-line font-mono text-[15px] leading-relaxed text-fg-muted" />
          </div>
        </BlurFade>
        <BlurFade delay={0.08}>
          <div className="rounded-3xl border border-success/30 bg-surface p-6 shadow-card">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-success">
                <ThumbsUp className="size-4" /> Strong prompt
              </p>
              <button
                onClick={copy}
                className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-primary hover:bg-bg-alt"
              >
                <Copy className="size-4" /> Copy
              </button>
            </div>
            <TranslatableText text={example.good} className="mt-3 whitespace-pre-line font-mono text-[15px] leading-relaxed" highlight={highlight} />
          </div>
        </BlurFade>
        <BlurFade delay={0.12}>
          <div className="px-2 text-[15px]">
            <TranslatableText text={example.why.en} className="text-fg-muted" highlight={highlight} />
            <p lang="ar" data-ar-help dir="rtl" className="mt-1 text-right text-fg-subtle">{example.why.ar}</p>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

function VocabCard({ v }: { v: VocabItem }) {
  const { isSaved, toggleSave } = useApp()
  const toast = useToast()
  const saved = isSaved(v.word)
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border-soft bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xl font-semibold tracking-tight">{v.word}</p>
          <p className="text-xs text-fg-muted">
            {v.pos} <span className="font-arabic">· {POS_AR[v.pos]}</span>
          </p>
        </div>
        <div className="flex">
          {canSpeak() && (
            <button
              onClick={() => speak(v.word)}
              aria-label={`Pronounce ${v.word}`}
              className="grid size-9 cursor-pointer place-items-center rounded-full text-primary hover:bg-bg-alt"
            >
              <Volume2 className="size-[18px]" />
            </button>
          )}
          <button
            onClick={() => {
              const added = toggleSave({ word: v.word, ar: v.ar, pos: v.pos, example: v.example })
              toast(added ? `“${v.word}” saved` : `Removed “${v.word}”`)
            }}
            aria-label={saved ? `Remove ${v.word} from saved words` : `Save ${v.word}`}
            aria-pressed={saved}
            className="grid size-9 cursor-pointer place-items-center rounded-full text-clay hover:bg-bg-alt"
          >
            {saved ? <BookmarkCheck className="size-[18px]" /> : <Bookmark className="size-[18px]" />}
          </button>
        </div>
      </div>
      <p lang="ar" dir="rtl" className="mt-3 text-right text-xl font-semibold">{v.ar}</p>
      <p className="pt-3 text-sm italic text-fg-muted">“{v.example}”</p>
      <div className="mt-auto pt-2">
        <SpeakCheck word={v.word} showLabel />
      </div>
    </div>
  )
}

function Quiz({ lesson }: { lesson: Lesson }) {
  const { setQuizScore, markComplete } = useApp()
  const [answers, setAnswers] = useState<(number | null)[]>(() => lesson.quiz.map(() => null))
  const finished = answers.every((a) => a !== null)
  const score = answers.filter((a, i) => a === lesson.quiz[i].answer).length

  const choose = (qi: number, oi: number) => {
    if (answers[qi] !== null) return
    const nextAnswers = answers.map((a, i) => (i === qi ? oi : a))
    setAnswers(nextAnswers)
    if (nextAnswers.every((a) => a !== null)) {
      const s = nextAnswers.filter((a, i) => a === lesson.quiz[i].answer).length
      setQuizScore(lesson.id, s)
      if (s === lesson.quiz.length) markComplete(lesson.id)
    }
  }

  return (
    <section className="my-16 rounded-[28px] border border-border-soft bg-bg-alt p-5 sm:p-8" aria-labelledby="quiz-title">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="quiz-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Quick check</h2>
          <p lang="ar" data-ar-help className="mt-1 text-sm text-fg-subtle">اختبر نفسك</p>
        </div>
        {finished && (
          <button
            onClick={() => setAnswers(lesson.quiz.map(() => null))}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-primary hover:bg-surface"
          >
            <RotateCcw className="size-4" /> Retry
          </button>
        )}
      </div>
      <ol className="mt-6 space-y-8">
        {lesson.quiz.map((q, qi) => (
          <QuizItem key={qi} q={q} index={qi} picked={answers[qi]} onPick={(oi) => choose(qi, oi)} />
        ))}
      </ol>
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mt-8 rounded-2xl p-5 text-center',
              score === lesson.quiz.length ? 'bg-success-soft text-success' : 'bg-surface text-fg',
            )}
            aria-live="polite"
          >
            <p className="text-2xl font-bold">
              {score} / {lesson.quiz.length}
            </p>
            <p className="text-sm">
              {score === lesson.quiz.length ? 'Perfect! Lesson marked as complete.' : 'Good try — read the explanations and retry.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function QuizItem({ q, index, picked, onPick }: { q: QuizQuestion; index: number; picked: number | null; onPick: (i: number) => void }) {
  const answered = picked !== null
  const correct = picked === q.answer
  return (
    <li>
      <TranslatableText as="div" text={`${index + 1}. ${q.q}`} className="text-lg font-medium" />
      <p lang="ar" data-ar-help dir="rtl" className="text-right text-sm text-fg-subtle">{q.qAr}</p>
      <div className="mt-3 grid gap-2" role="group" aria-label={`Question ${index + 1} options`}>
        {q.options.map((o, oi) => {
          const isAnswer = oi === q.answer
          const isPicked = oi === picked
          return (
            <button
              key={oi}
              onClick={() => onPick(oi)}
              disabled={answered}
              className={cn(
                'flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] transition-all duration-200',
                !answered && 'border-border-soft bg-surface hover:border-primary hover:shadow-card',
                answered && isAnswer && 'border-success bg-success-soft text-fg',
                answered && isPicked && !isAnswer && 'border-danger bg-danger-soft text-fg',
                answered && !isAnswer && !isPicked && 'border-border-soft bg-surface opacity-60',
              )}
            >
              <span dir="auto">{o}</span>
              {answered && isAnswer && <Check className="size-5 shrink-0 text-success" aria-label="Correct answer" />}
              {answered && isPicked && !isAnswer && <X className="size-5 shrink-0 text-danger" aria-label="Your answer — incorrect" />}
            </button>
          )
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
            aria-live="polite"
          >
            <p className={cn('mt-3 text-sm font-medium', correct ? 'text-success' : 'text-danger')}>{correct ? 'Correct!' : 'Not quite.'}</p>
            <p className="text-sm text-fg-muted">{q.explain.en}</p>
            <p lang="ar" data-ar-help dir="rtl" className="text-right text-sm text-fg-subtle">{q.explain.ar}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
