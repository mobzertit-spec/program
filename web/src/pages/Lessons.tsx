import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LessonIcon, levelTone } from '@/components/LessonIcon'
import { Badge } from '@/components/ui/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { ProgressRing } from '@/components/ui/progress-ring'
import { Segmented } from '@/components/ui/segmented'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { useApp } from '@/context/AppContext'
import { lessons, type Level } from '@/data/lessons'

type Filter = 'all' | Level

export default function Lessons() {
  const { completed, quizScores } = useApp()
  const [filter, setFilter] = useState<Filter>('all')
  const shown = lessons.filter((l) => filter === 'all' || l.level === filter)
  const done = completed.length
  const next = lessons.find((l) => !completed.includes(l.id))

  return (
    <div className="mx-auto max-w-[1024px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <BlurFade>
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">The course</p>
        <h1 className="mt-2 text-5xl font-bold tracking-[-0.035em] sm:text-7xl">Lessons.</h1>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted sm:text-xl">
          Ten short lessons, from your very first message to advanced prompting. Every word is translatable.
        </p>
        <p lang="ar" dir="rtl" className="mt-1 text-left text-fg-subtle">عشرة دروس قصيرة، من رسالتك الأولى حتى الاحتراف.</p>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="mt-10 flex flex-col gap-5 rounded-3xl border border-border-soft bg-bg-alt p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <ProgressRing value={done / lessons.length} size={56} stroke={5} label={`${done} of ${lessons.length} lessons completed`} />
            <div>
              <p className="font-semibold">
                {done} of {lessons.length} completed
              </p>
              <p className="text-sm text-fg-muted">
                {next ? (
                  <>
                    Up next: <span className="text-fg">{next.title}</span>
                  </>
                ) : (
                  'You finished the course — amazing work!'
                )}
              </p>
            </div>
          </div>
          {next && (
            <Link
              to={`/lessons/${next.id}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[15px] font-medium text-on-primary transition-colors hover:bg-primary-hover"
            >
              {done ? 'Continue' : 'Start'} <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </BlurFade>

      <div className="no-scrollbar mt-10 overflow-x-auto">
        <Segmented
          label="Filter by level"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'Beginner', label: 'Beginner' },
            { value: 'Intermediate', label: 'Intermediate' },
            { value: 'Advanced', label: 'Advanced' },
          ]}
        />
      </div>

      <motion.ul layout className="mt-6 grid gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((l) => {
            const isDone = completed.includes(l.id)
            return (
              <motion.li
                key={l.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/lessons/${l.id}`} className="block h-full rounded-3xl">
                  <SpotlightCard className="h-full p-6 hover:-translate-y-0.5">
                    <div className="flex items-start justify-between">
                      <span className="grid size-12 place-items-center rounded-2xl bg-bg-alt">
                        <LessonIcon name={l.icon} className="size-6 text-clay" />
                      </span>
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
                          <CheckCircle2 className="size-5" /> Done
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-fg-subtle">Lesson {l.number}</span>
                      )}
                    </div>
                    <h2 className="mt-5 text-2xl font-semibold tracking-tight">{l.title}</h2>
                    <p lang="ar" className="text-sm text-fg-muted">{l.titleAr}</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">{l.summary.en}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <Badge tone={levelTone(l.level)}>{l.level}</Badge>
                      <Badge>
                        <Clock className="size-3" /> {l.minutes} min
                      </Badge>
                      {quizScores[l.id] !== undefined && (
                        <Badge tone="success">
                          Quiz {quizScores[l.id]}/{l.quiz.length}
                        </Badge>
                      )}
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}
