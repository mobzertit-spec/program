import { AnimatePresence, motion } from 'motion/react'
import { Award, Flame, PartyPopper, Trophy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Mascot } from '@/components/mascot/Mascot'
import { useApp } from '@/context/AppContext'
import { lessons } from '@/data/lessons'
import { achievements } from '@/lib/achievements'
import { celebrate, confetti } from '@/lib/confetti'
import { readStorage, STORAGE_SYNC_EVENT, writeStorage } from '@/lib/storage'

type Moment =
  | { kind: 'level'; level: number }
  | { kind: 'badge'; title: string; titleAr: string; description: string }

const SEEN_KEY = 'pe:badges-seen'

/**
 * Watches learning progress and celebrates the moments that matter:
 * lesson done and perfect quiz → confetti; daily goal → a banner; new level or badge → a small party card.
 * Only changes made on this device count — progress restored from the cloud never triggers a party.
 */
export function Celebrations() {
  const app = useApp()
  const [queue, setQueue] = useState<Moment[]>([])
  const [goalBanner, setGoalBanner] = useState(false)
  const earned = achievements.filter((a) => a.earned(app)).map((a) => a.id)

  const prev = useRef({
    level: app.level.level,
    completed: app.completed.length,
    xpToday: app.xpToday,
    perfect: perfectCount(app.quizScores),
  })
  const quiet = useRef(false)

  // restored from the cloud → move the baseline, no party
  useEffect(() => {
    const onSync = () => {
      quiet.current = true
      window.setTimeout(() => (quiet.current = false), 1500)
    }
    window.addEventListener(STORAGE_SYNC_EVENT, onSync)
    return () => window.removeEventListener(STORAGE_SYNC_EVENT, onSync)
  }, [])

  // badges: remember which ones were already shown (first run: everything current counts as seen)
  useEffect(() => {
    const seen = readStorage<string[] | null>(SEEN_KEY, null)
    if (seen === null || quiet.current) return writeStorage(SEEN_KEY, earned)
    const fresh = earned.filter((id) => !seen.includes(id))
    if (!fresh.length) return
    writeStorage(SEEN_KEY, [...seen, ...fresh])
    setQueue((q) => [
      ...q,
      ...fresh.map((id) => {
        const a = achievements.find((x) => x.id === id)!
        return { kind: 'badge' as const, title: a.title, titleAr: a.titleAr, description: a.description }
      }),
    ])
  }, [earned.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const p = prev.current
    const now = { level: app.level.level, completed: app.completed.length, xpToday: app.xpToday, perfect: perfectCount(app.quizScores) }
    prev.current = now
    if (quiet.current) return

    if (now.level > p.level) setQueue((q) => [...q, { kind: 'level', level: now.level }])
    else if (now.completed > p.completed || now.perfect > p.perfect) confetti({ count: 140 })

    if (p.xpToday < app.dailyGoal && now.xpToday >= app.dailyGoal) {
      setGoalBanner(true)
      window.setTimeout(() => setGoalBanner(false), 4500)
    }
  }, [app.level.level, app.completed.length, app.xpToday, app.quizScores, app.dailyGoal])

  const current = queue[0]
  useEffect(() => {
    if (current) celebrate()
  }, [current])
  const close = () => setQueue((q) => q.slice(1))

  useEffect(() => {
    if (!current) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current])

  return createPortal(
    <>
      <AnimatePresence>
        {goalBanner && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24 }}
            className="fixed inset-x-0 top-20 z-[90] mx-auto flex w-fit items-center gap-3 rounded-full bg-fg px-5 py-3 text-bg shadow-pop"
          >
            <Mascot pose="cheer" size={36} className="-my-2" />
            <Flame className="size-5 fill-clay text-clay" aria-hidden />
            <span className="font-semibold">Daily goal reached!</span>
            <span lang="ar" data-ar-help className="text-sm opacity-70">حققت هدفك اليومي</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {current && (
          <motion.div
            key={queue.length + (current.kind === 'level' ? `l${current.level}` : current.title)}
            className="fixed inset-0 z-[110] grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="celebration-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.45, duration: 0.6 }}
              className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-surface p-8 text-center shadow-pop"
            >
              <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-brand opacity-15" />
              <motion.div
                initial={{ y: 30, scale: 0.5 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.55, delay: 0.1 }}
                className="relative mx-auto w-fit"
              >
                <Mascot pose="cheer" size={132} />
                {/* the reward, held up by Cee */}
                <span className="absolute -bottom-1 -right-3 grid size-12 place-items-center rounded-full bg-brand text-white shadow-pop ring-4 ring-surface">
                  {current.kind === 'level' ? <Trophy className="size-6" aria-hidden /> : <Award className="size-6" aria-hidden />}
                </span>
              </motion.div>

              {current.kind === 'level' ? (
                <>
                  <p className="relative mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-clay">Level up</p>
                  <h2 id="celebration-title" className="text-5xl font-bold tracking-tight">
                    Level <CountUp to={current.level} />
                  </h2>
                  <p lang="ar" className="mt-1 text-center text-fg-muted">وصلت إلى المستوى {current.level}!</p>
                  <p className="mt-3 text-fg-muted">Great work. Every lesson makes your English — and your prompts — stronger.</p>
                </>
              ) : (
                <>
                  <p className="relative mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-clay">New badge</p>
                  <h2 id="celebration-title" className="text-3xl font-bold tracking-tight">{current.title}</h2>
                  <p lang="ar" className="mt-1 text-center text-fg-muted">{current.titleAr}</p>
                  <p className="mt-3 text-fg-muted">{current.description}.</p>
                </>
              )}

              <div className="mt-7 flex flex-col gap-2">
                <button
                  onClick={close}
                  autoFocus
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary font-medium text-on-primary hover:bg-primary-hover"
                >
                  <PartyPopper className="size-5" aria-hidden /> Keep going
                </button>
                {current.kind === 'badge' && (
                  <Link to="/path" onClick={close} className="min-h-11 rounded-full py-3 text-sm font-medium text-fg-muted hover:bg-bg-alt">
                    See all badges
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  )
}

function perfectCount(scores: Record<string, number>) {
  return lessons.filter((l) => scores[l.id] === l.quiz.length).length
}

/** The level number rolls up to its value. */
function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(Math.max(1, to - 1))
  useEffect(() => {
    const t = window.setTimeout(() => setN(to), 450)
    return () => window.clearTimeout(t)
  }, [to])
  return (
    <motion.span key={n} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block tabular-nums">
      {n}
    </motion.span>
  )
}
