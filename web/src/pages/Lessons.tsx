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
import { lessons, tracks, type TrackId } from '@/data/lessons'
import { nextLesson } from '@/lib/progress'
import { PageHeader } from '@/components/ui/page-header'

type Filter = 'all' | TrackId

export default function Lessons() {
  const { completed, quizScores } = useApp()
  const [filter, setFilter] = useState<Filter>('all')
  const shown = lessons.filter((l) => filter === 'all' || l.track === filter)
  const done = completed.length
  const next = nextLesson(completed)

  return (
    <div className="mx-auto max-w-[1024px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <PageHeader eyebrow={{ en: 'The course', ar: 'الدورة' }} title={{ en: 'Lessons.', ar: 'الدروس' }} intro={{ en: `${lessons.length} short lessons in ${tracks.length} tracks — from your very first message to Skills and Claude Code. Every word is translatable.`, ar: `${lessons.length} درسًا قصيرًا في ${tracks.length} مسارات، من رسالتك الأولى حتى الاحتراف. كل كلمة قابلة للترجمة.` }} />

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
          label="Filter by track"
          value={filter}
          onChange={setFilter}
          options={[{ value: 'all', label: 'All' }, ...tracks.map((t) => ({ value: t.id, label: t.title }))]}
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
