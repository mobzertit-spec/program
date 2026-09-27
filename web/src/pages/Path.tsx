import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight, Award, BookOpen, Check, Crown, Download, Flame, Layers, Lock, Medal, Mic, RotateCcw, Rocket, Star,
  Trophy, Upload, Zap,
} from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { LessonIcon } from '@/components/LessonIcon'
import { Parallax, TrackArt } from '@/components/art/TrackArt'
import { Onboarding } from '@/components/learn/Onboarding'
import { Leaderboard } from '@/components/learn/Leaderboard'
import { WordOfTheDay } from '@/components/learn/WordOfTheDay'
import { useProfile } from '@/lib/profile'
import { trackOf } from '@/data/lessons'
import { BlurFade } from '@/components/ui/blur-fade'
import { ProgressRing } from '@/components/ui/progress-ring'
import { useToast } from '@/components/ui/toast'
import { useApp, XP } from '@/context/AppContext'
import { lessons, lessonsByTrack, tracks, type Lesson, type Track } from '@/data/lessons'
import { achievements, type Achievement } from '@/lib/achievements'
import { exportProgress, importProgress } from '@/lib/backup'
import { isUnlocked, nextLesson } from '@/lib/path'
import { recentDays } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'

const ROW = 150
const NODE = 72
const WIDTH = 340
const OFFSETS = [0, 72, 100, 72, 0, -72, -100, -72]

export default function Path() {
  const app = useApp()
  const { profile, track: preferred } = useProfile()
  const [onboarding, setOnboarding] = useState(!profile.onboarded)
  const next = nextLesson(app.completed, preferred)
  const done = app.completed.length
  const isNew = done === 0 && app.xp === 0

  return (
    <div className="mx-auto max-w-[1024px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <PageHeader eyebrow={{ en: 'Your journey', ar: 'رحلتك' }} title={{ en: 'Learning path.', ar: 'المسار التعليمي' }} intro={{ en: `Five tracks, ${lessons.length} lessons. Finish a lesson to unlock the next one, keep your streak alive, and collect badges.`, ar: `خمسة مسارات و${lessons.length} درسًا. أنهِ درسًا ليُفتح التالي، وحافظ على سلسلة أيامك، واجمع الشارات.` }} />

      <Onboarding open={onboarding} onClose={() => setOnboarding(false)} />

      {next && (
        <BlurFade delay={0.05}>
          <Link
            to={`/lessons/${next.id}`}
            className="group mt-8 flex items-center gap-4 rounded-3xl bg-fg p-5 text-bg shadow-pop transition-transform hover:-translate-y-0.5 sm:p-6"
          >
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-bg/10">
              <LessonIcon name={next.icon} className="float-icon size-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm opacity-70">
                {done ? 'Continue with' : 'Start here'} · {trackOf(next.track).title}
              </span>
              <span className="block text-xl font-semibold leading-tight tracking-tight">{next.title}</span>
              <span lang="ar" data-ar-help className="block text-sm opacity-70">{next.titleAr}</span>
            </span>
            <ArrowRight className="size-6 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-fg-muted">
            {preferred ? (
              <>
                Recommended track: <span className="font-medium text-fg">{trackOf(preferred).title}</span>
              </>
            ) : (
              'Not sure where to start?'
            )}
            <button onClick={() => setOnboarding(true)} className="cursor-pointer font-medium text-link hover:underline">
              {preferred ? 'Change' : 'Get a recommendation'}
            </button>
          </p>
        </BlurFade>
      )}

      {/* stats appear once there is something to show */}
      {!isNew && <Dashboard />}

      <div className="mt-16 space-y-24">
        {tracks.map((t, i) => (
          <TrackMap key={t.id} track={t} index={i} currentId={next?.id} />
        ))}
      </div>

      <Achievements />
      <Leaderboard />
      <DataCard />
    </div>
  )
}

function Dashboard() {
  const { streak, bestStreak, xp, xpToday, xpLog, level, dailyGoal, setDailyGoal, dueWords } = useApp()
  const days = recentDays(xpLog, 7)
  const max = Math.max(dailyGoal, ...days.map((d) => d.xp))
  const goalMet = xpToday >= dailyGoal

  return (
    <div className="mt-10 grid gap-4 md:grid-cols-3">
      <BlurFade className="h-full">
        <div className="flex h-full flex-col rounded-3xl border border-border-soft bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-fg-muted">Streak</p>
            <Flame className={cn('size-5', streak ? 'fill-clay text-clay' : 'text-fg-subtle')} aria-hidden />
          </div>
          <p className="mt-2 text-4xl font-bold tracking-tight">
            {streak} <span className="text-lg font-medium text-fg-muted">{streak === 1 ? 'day' : 'days'}</span>
          </p>
          <p className="text-xs text-fg-subtle">Best: {bestStreak} · <span lang="ar">سلسلة الأيام</span></p>
          <div className="mt-auto flex items-end justify-between gap-1.5 pt-5" aria-label="XP in the last 7 days" role="img">
            {days.map((d) => (
              <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-14 w-full items-end overflow-hidden rounded-md bg-bg-alt">
                  <motion.div
                    className={cn('w-full rounded-md', d.xp >= dailyGoal ? 'bg-clay' : 'bg-primary/60')}
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.xp / max) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[10px] text-fg-subtle">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.05} className="h-full">
        <div className="flex h-full flex-col rounded-3xl border border-border-soft bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-fg-muted">Today’s goal</p>
            {goalMet && <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">Done!</span>}
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="relative">
              <ProgressRing value={xpToday / dailyGoal} size={76} stroke={7} label={`${xpToday} of ${dailyGoal} XP today`} />
              <span className="absolute inset-0 grid place-items-center text-sm font-bold">{Math.min(xpToday, 999)}</span>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">
                {xpToday}/{dailyGoal} <span className="text-base font-medium text-fg-muted">XP</span>
              </p>
              <p lang="ar" data-ar-help className="text-xs text-fg-subtle">هدفك اليومي</p>
            </div>
          </div>
          <div className="mt-auto pt-4">
            <p className="mb-1.5 text-xs text-fg-muted">Daily goal</p>
            <div className="flex gap-1.5" role="group" aria-label="Choose your daily goal">
              {[10, 30, 50, 100].map((g) => (
                <button
                  key={g}
                  onClick={() => setDailyGoal(g)}
                  aria-pressed={dailyGoal === g}
                  className={cn(
                    'min-h-8 flex-1 cursor-pointer rounded-full border text-xs font-medium transition-colors',
                    dailyGoal === g ? 'border-fg bg-fg text-bg' : 'border-border-soft hover:bg-bg-alt',
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.1} className="h-full">
        <div className="flex h-full flex-col rounded-3xl border border-border-soft bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-fg-muted">Level</p>
            <Award className="size-5 text-primary" aria-hidden />
          </div>
          <p className="mt-2 text-4xl font-bold tracking-tight">{level.level}</p>
          <p className="text-xs text-fg-subtle">{xp.toLocaleString()} XP total</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-alt" role="progressbar" aria-valuenow={level.into} aria-valuemin={0} aria-valuemax={level.span} aria-label="Progress to next level">
            <motion.div className="h-full rounded-full bg-brand" animate={{ width: `${(level.into / level.span) * 100}%` }} />
          </div>
          <p className="mt-1 text-xs text-fg-muted">{level.span - level.into} XP to level {level.level + 1}</p>
          <Link
            to="/vocabulary?tab=review"
            className="mt-auto flex items-center justify-between rounded-2xl bg-bg-alt px-4 py-3 text-sm transition-colors hover:bg-border-soft"
          >
            <span>
              <span className="font-semibold">{dueWords.length}</span> words to review
            </span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </BlurFade>
    </div>
  )
}

/** Each unit has its own color, like chapters in a game. Dark enough for white text. */
const UNIT_COLORS: Record<string, [string, string]> = {
  foundations: ['#4338ca', '#6d5dfc'],
  prompting: ['#c2410c', '#ea580c'],
  features: ['#0369a1', '#0ea5e9'],
  english: ['#15803d', '#22c55e'],
  students: ['#a21caf', '#d946ef'],
}

function TrackMap({ track, index, currentId }: { track: Track; index: number; currentId?: string }) {
  const { completed, quizScores } = useApp()
  const toast = useToast()
  const items = lessonsByTrack(track.id)
  const doneCount = items.filter((l) => completed.includes(l.id)).length
  const allDone = doneCount === items.length
  const [c1, c2] = UNIT_COLORS[track.id] ?? UNIT_COLORS.foundations
  const center = WIDTH / 2
  // lessons, then the certificate chest
  const points = [...items, null].map((_, i) => ({ x: center + OFFSETS[i % OFFSETS.length], y: i * ROW + NODE / 2 }))
  const height = points.length * ROW
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section aria-labelledby={`track-${track.id}`} style={{ ['--unit' as string]: c1, ['--unit-2' as string]: c2 }}>
      {/* sticky unit banner */}
      <div className="sticky top-[76px] z-20">
        <div
          className="flex items-center gap-4 rounded-3xl px-5 py-4 text-white shadow-pop sm:px-6"
          style={{ background: `linear-gradient(120deg, ${c1}, ${c2})` }}
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/85">Unit {index + 1}</p>
            <h2 id={`track-${track.id}`} className="truncate text-xl font-bold tracking-tight sm:text-2xl">
              {track.title} <span lang="ar" data-ar-help className="text-base font-medium text-white/85">· {track.titleAr}</span>
            </h2>
          </div>
          <div className="w-24 shrink-0 text-right sm:w-36">
            <p className="text-sm font-semibold">
              {doneCount}/{items.length} <span className="font-normal text-white/85">done</span>
            </p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/25" aria-hidden>
              <div className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${(doneCount / items.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-4 max-w-xl text-center text-fg-muted">{track.description}</p>

      <div className="relative mx-auto mt-12" style={{ width: WIDTH, height }}>
        {/* a friendly illustration beside the path */}
        <div
          aria-hidden
          className={cn('pointer-events-none absolute top-1/3 hidden w-60 lg:block', index % 2 ? 'right-full mr-16' : 'left-full ml-16')}
        >
          <Parallax>
            <TrackArt track={track.id} />
          </Parallax>
        </div>

        <svg className="absolute inset-0" width={WIDTH} height={height} aria-hidden>
          {points.slice(1).map((p, i) => {
            const a = points[i]
            const d = `M ${a.x} ${a.y} C ${a.x} ${a.y + ROW / 2}, ${p.x} ${p.y - ROW / 2}, ${p.x} ${p.y}`
            const lit = completed.includes(items[i].id)
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="var(--border)" strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" />
                {lit && (
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="var(--unit)"
                    strokeWidth={6}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7, delay: 0.1 * i, ease: 'easeOut' }}
                  />
                )}
              </g>
            )
          })}
        </svg>

        {items.map((l, i) => {
          const state = completed.includes(l.id) ? 'done' : l.id === currentId ? 'current' : isUnlocked(l, completed) ? 'open' : 'locked'
          return (
            <PathNode
              key={l.id}
              lesson={l}
              state={state}
              stars={state === 'done' ? Math.min(3, 1 + (quizScores[l.id] ?? 0)) : 0}
              prevTitle={items[i - 1]?.title}
              x={points[i].x}
              y={i * ROW}
              open={open === l.id}
              onToggle={(v) => setOpen(v ? l.id : null)}
            />
          )
        })}

        {/* the treasure at the end of the unit */}
        <div className="absolute flex w-40 flex-col items-center" style={{ left: points[items.length].x - 80, top: items.length * ROW }}>
          {allDone ? (
            <Link
              to={`/certificate/${track.id}`}
              aria-label={`${track.title}: get your certificate`}
              className="relative grid place-items-center rounded-full text-white transition-transform hover:scale-105 active:scale-95"
              style={{ width: NODE + 8, height: NODE + 8, background: 'linear-gradient(135deg, #f5c542, #f07a45)', boxShadow: '0 6px 0 0 #b45309' }}
            >
              <motion.span
                aria-hidden
                className="absolute -inset-2 rounded-full border-4 border-[#f5c542]/50"
                animate={{ scale: [1, 1.15, 1], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <Trophy className="size-9" />
            </Link>
          ) : (
            <button
              onClick={() => toast(`Finish all ${items.length} lessons of “${track.title}” to open your certificate`)}
              aria-label={`${track.title} certificate (locked)`}
              className="grid cursor-pointer place-items-center rounded-full bg-bg-alt text-fg-subtle shadow-[0_6px_0_0_var(--border-soft)] transition-transform hover:scale-105"
              style={{ width: NODE + 8, height: NODE + 8 }}
            >
              <Trophy className="size-8" />
            </button>
          )}
          <p className="mt-3 rounded-md bg-bg px-1.5 py-0.5 text-center text-xs font-semibold">
            Certificate <span lang="ar" data-ar-help className="font-normal text-fg-muted">· الشهادة</span>
          </p>
        </div>
      </div>
    </section>
  )
}

function PathNode({
  lesson,
  state,
  stars,
  prevTitle,
  x,
  y,
  open,
  onToggle,
}: {
  lesson: Lesson
  state: 'done' | 'current' | 'open' | 'locked'
  stars: number
  prevTitle?: string
  x: number
  y: number
  open: boolean
  onToggle: (open: boolean) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  // close on outside click or Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => ref.current && !ref.current.contains(e.target as Node) && onToggle(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onToggle(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onToggle])

  const size = state === 'current' ? NODE + 8 : NODE
  // keep the card inside the path area on small screens; its arrow still points at the node
  const CARD = 288
  const cardLeft = Math.min(Math.max(x - CARD / 2, 0), WIDTH - CARD)
  const circle = cn(
    'relative grid cursor-pointer place-items-center rounded-full transition-transform duration-200 hover:scale-105 active:translate-y-1 active:scale-100',
    (state === 'done' || state === 'current') && 'bg-[var(--unit)] text-white shadow-[0_6px_0_0_color-mix(in_srgb,var(--unit)_55%,black)]',
    state === 'open' && 'border-[3px] border-[var(--unit)] bg-surface text-[var(--unit)] shadow-[0_6px_0_0_var(--border-soft)]',
    state === 'locked' && 'bg-bg-alt text-fg-subtle shadow-[0_6px_0_0_var(--border-soft)]',
  )
  const label = `Lesson ${lesson.number}: ${lesson.title}${state === 'done' ? ' (completed)' : state === 'locked' ? ' (locked)' : ''}`

  return (
    <div ref={ref} className={cn('absolute flex w-40 flex-col items-center', open && 'z-30')} style={{ left: x - 80, top: y - (size - NODE) / 2 }}>
      {state === 'current' && !open && (
        <span className="float-icon absolute -top-9 z-10 rounded-xl bg-fg px-3 py-1 text-xs font-bold uppercase tracking-wide text-bg shadow-card after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-fg">
          Start
        </span>
      )}
      <button onClick={() => onToggle(!open)} aria-label={label} aria-expanded={open} className={circle} style={{ width: size, height: size }}>
        {state === 'current' && (
          <motion.span
            aria-hidden
            className="absolute -inset-2 rounded-full border-4 border-[var(--unit)] opacity-30"
            animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.1, 0.35] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        {state === 'done' ? <Check className="size-8" strokeWidth={3} /> : state === 'locked' ? <Lock className="size-6" /> : <LessonIcon name={lesson.icon} className="size-7" />}
      </button>

      {state === 'done' ? (
        <span className="mt-2 flex gap-0.5" aria-label={`${stars} of 3 stars`}>
          {[0, 1, 2].map((i) => (
            <Star key={i} className={cn('size-4', i < stars ? 'fill-[#f5c542] text-[#f5c542]' : 'text-border')} aria-hidden />
          ))}
        </span>
      ) : null}
      <p className={cn('relative mt-2 line-clamp-2 rounded-md bg-bg px-1.5 py-0.5 text-center text-xs font-medium leading-tight', state === 'locked' ? 'text-fg-muted' : 'text-fg')}>
        {lesson.title}
      </p>

      {/* lesson card, like a level preview in a game */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={lesson.title}
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute top-[calc(100%+8px)] rounded-3xl p-5 text-left text-white shadow-pop"
            style={{
              width: CARD,
              left: cardLeft - (x - 80),
              background: state === 'locked' ? 'var(--fg-muted)' : 'linear-gradient(135deg, var(--unit), var(--unit-2))',
            }}
          >
            <span
              aria-hidden
              className="absolute -top-2 size-4 -translate-x-1/2 rotate-45 rounded-sm"
              style={{ left: x - cardLeft, background: state === 'locked' ? 'var(--fg-muted)' : 'var(--unit)' }}
            />
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/85">
              Lesson {lesson.number} · {lesson.minutes} min · {lesson.level}
            </p>
            <p className="mt-1 text-lg font-bold leading-snug">{lesson.title}</p>
            <p lang="ar" data-ar-help className="text-sm text-white/85">{lesson.titleAr}</p>
            {state === 'locked' ? (
              <p className="mt-2 text-sm text-white/90">Finish “{prevTitle}” to unlock this lesson.</p>
            ) : (
              <p className="mt-2 line-clamp-2 text-sm text-white/90">{lesson.summary.en}</p>
            )}
            <Link
              to={`/lessons/${lesson.id}`}
              className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white font-semibold shadow-[0_4px_0_0_rgb(0_0_0/0.15)] transition-transform active:translate-y-0.5"
              style={{ color: state === 'locked' ? 'var(--fg)' : 'var(--unit)' }}
            >
              {state === 'done' ? 'Review lesson' : state === 'locked' ? 'Preview anyway' : `Start · +${XP.lesson} XP`}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const BADGE_ICONS: Record<Achievement['icon'], typeof Trophy> = {
  rocket: Rocket,
  flame: Flame,
  star: Star,
  book: BookOpen,
  trophy: Trophy,
  crown: Crown,
  mic: Mic,
  layers: Layers,
  zap: Zap,
  medal: Medal,
}

function Achievements() {
  const app = useApp()
  const state = {
    completed: app.completed,
    quizScores: app.quizScores,
    saved: app.saved,
    xp: app.xp,
    bestStreak: app.bestStreak,
    reviewsDone: app.reviewsDone,
    pronunciationHits: app.pronunciationHits,
  }
  const list = achievements.map((a) => ({ ...a, got: a.earned(state) }))
  const count = list.filter((a) => a.got).length
  return (
    <section className="mt-24" aria-labelledby="badges-title">
      <div className="flex items-end justify-between">
        <div>
          <h2 id="badges-title" className="text-3xl font-bold tracking-tight sm:text-4xl">Badges</h2>
          <p lang="ar" data-ar-help className="text-fg-muted">الشارات</p>
        </div>
        <p className="text-sm text-fg-muted">
          <span className="font-semibold text-fg">{count}</span> / {list.length} earned
        </p>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((a) => {
          const Icon = BADGE_ICONS[a.icon]
          return (
            <li
              key={a.id}
              className={cn(
                'flex flex-col items-center rounded-3xl border p-4 text-center transition-colors',
                a.got ? 'border-clay/30 bg-clay-soft' : 'border-dashed border-border bg-surface/60',
              )}
            >
              <span className={cn('grid size-12 place-items-center rounded-full', a.got ? 'bg-clay text-white' : 'bg-bg-alt text-fg-subtle')}>
                {a.got ? <Icon className="float-icon size-6" /> : <Lock className="size-5" />}
              </span>
              <p className="mt-3 text-sm font-semibold leading-tight">{a.title}</p>
              <p lang="ar" data-ar-help className="text-center text-xs text-fg-muted">{a.titleAr}</p>
              <p className="mt-1 text-xs text-fg-subtle">{a.description}</p>
              <span className="sr-only">{a.got ? 'Earned' : 'Not earned yet'}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function DataCard() {
  const { resetProgress } = useApp()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  const onImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importProgress(file)
      toast('Progress restored — reloading…')
      window.setTimeout(() => window.location.reload(), 800)
    } catch (err) {
      toast((err as Error).message || 'Could not read this file')
    }
    e.target.value = ''
  }

  return (
    <section className="mt-16 grid gap-4 md:grid-cols-[1fr_1.2fr]" aria-labelledby="data-title">
      <WordOfTheDay />
      <div className="rounded-3xl border border-border-soft bg-bg-alt p-5">
        <h2 id="data-title" className="text-lg font-semibold">Your progress, your device</h2>
        <p className="mt-1 text-sm text-fg-muted">
          Progress is saved in this browser — no account needed. Download a backup to move it to another device.
        </p>
        <p lang="ar" data-ar-help className="text-xs text-fg-subtle">يُحفظ تقدّمك في هذا المتصفح. نزّل نسخة احتياطية لنقله إلى جهاز آخر.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={exportProgress}
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium shadow-card hover:bg-border-soft"
          >
            <Download className="size-4" /> Download backup
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium shadow-card hover:bg-border-soft"
          >
            <Upload className="size-4" /> Restore backup
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImport} aria-label="Choose a backup file" />
          <button
            onClick={() => {
              if (window.confirm('Reset lessons, quizzes, XP and streak? Saved words stay.')) {
                resetProgress()
                toast('Progress reset')
              }
            }}
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium text-danger hover:bg-danger-soft"
          >
            <RotateCcw className="size-4" /> Reset progress
          </button>
        </div>
      </div>
    </section>
  )
}
