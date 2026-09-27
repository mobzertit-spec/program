import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Briefcase, Code2, GraduationCap, MessageCircle, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { isServer } from '@/lib/boot'
import { useNavigate } from 'react-router-dom'
import { Mascot } from '@/components/mascot/Mascot'
import { useApp } from '@/context/AppContext'
import { nextLesson } from '@/lib/path'
import { GOAL_TRACK, useProfile, type EnglishLevel, type Goal } from '@/lib/profile'
import { cn } from '@/lib/utils'

const LEVELS: { id: EnglishLevel; en: string; ar: string; hint: string }[] = [
  { id: 'beginner', en: 'Beginner', ar: 'مبتدئ', hint: 'I know some words. Long texts are hard.' },
  { id: 'intermediate', en: 'Intermediate', ar: 'متوسط', hint: 'I understand most texts, but I make mistakes.' },
  { id: 'advanced', en: 'Advanced', ar: 'متقدم', hint: 'I read English easily.' },
]

const GOALS: { id: Goal; en: string; ar: string; icon: typeof MessageCircle }[] = [
  { id: 'daily', en: 'Use Claude in daily life', ar: 'استخدام Claude في حياتي اليومية', icon: MessageCircle },
  { id: 'work', en: 'English and AI for work', ar: 'الإنجليزية والذكاء الاصطناعي للعمل', icon: Briefcase },
  { id: 'code', en: 'Better prompts for coding', ar: 'طلبات أفضل للبرمجة', icon: Code2 },
  { id: 'study', en: 'Study and exams', ar: 'الدراسة والامتحانات', icon: GraduationCap },
]

/** Two quick questions on the first visit — they pick your track and whether Arabic help is on. */
export function Onboarding({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile, setProfile } = useProfile()
  const { setArabicHelp, completed } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [level, setLevel] = useState<EnglishLevel | null>(profile.level)
  const [goal, setGoal] = useState<Goal | null>(profile.goal)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && skip()
    window.addEventListener('keydown', onKey)
    window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('button[aria-pressed]')?.focus(), 60)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step])

  const skip = () => {
    setProfile({ ...profile, onboarded: true })
    onClose()
  }

  const finish = () => {
    if (!level || !goal) return
    setProfile({ level, goal, onboarded: true })
    // beginners keep the Arabic subtitles; others get a cleaner, English-first page
    setArabicHelp(level === 'beginner')
    onClose()
    const first = nextLesson(completed, GOAL_TRACK[goal])
    navigate(first ? `/lessons/${first.id}` : '/path')
  }

  if (isServer) return null
  // portal: page transitions use transforms, which would trap a fixed overlay inside the page
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-end bg-black/40 backdrop-blur-sm sm:place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="onb-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[32px] bg-surface p-6 shadow-pop sm:max-w-lg sm:rounded-[32px] sm:p-8"
          >
            <button onClick={skip} aria-label="Skip" className="absolute right-4 top-4 grid size-10 cursor-pointer place-items-center rounded-full text-fg-muted hover:bg-bg-alt">
              <X className="size-5" />
            </button>
            <div className="flex items-center gap-3 pr-10">
              <Mascot pose={step === 0 ? 'wave' : 'think'} size={76} />
              <div className="min-w-0">
                <p className="rounded-2xl rounded-bl-md bg-bg-alt px-4 py-2 text-sm font-medium leading-snug">
                  {step === 0 ? 'Hi, I’m Cee! Two quick questions and I’ll pick your first lesson.' : 'Nice! One more question.'}
                </p>
                <p lang="ar" data-ar-help className="mt-1 text-xs text-fg-muted">
                  {step === 0 ? 'مرحبًا، أنا «سي»! سؤالان سريعان وأختار لك أول درس.' : 'رائع! سؤال واحد بعد.'}
                </p>
                <div className="mt-2 flex gap-1.5" role="img" aria-label={`Step ${step + 1} of 2`}>
                  {[0, 1].map((i) => (
                    <span key={i} className={cn('h-1.5 w-8 rounded-full', i <= step ? 'bg-primary' : 'bg-border-soft')} />
                  ))}
                </div>
              </div>
            </div>

            {step === 0 ? (
              <>
                <h2 id="onb-title" className="mt-6 text-2xl font-bold tracking-tight">How is your English?</h2>
                <p lang="ar" className="text-fg-muted">ما مستواك في الإنجليزية؟</p>
                <div className="mt-5 space-y-2.5">
                  {LEVELS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLevel(l.id)}
                      aria-pressed={level === l.id}
                      className={cn(
                        'flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors',
                        level === l.id ? 'border-primary bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]' : 'border-border-soft hover:border-fg-subtle',
                      )}
                    >
                      <span>
                        <span className="block font-semibold">{l.en}</span>
                        <span className="block text-sm text-fg-muted">{l.hint}</span>
                      </span>
                      <span lang="ar" className="shrink-0 text-fg-muted">{l.ar}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(1)}
                  disabled={!level}
                  className="mt-6 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary font-medium text-on-primary disabled:opacity-40"
                >
                  Next <ArrowRight className="size-4" />
                </button>
              </>
            ) : (
              <>
                <h2 id="onb-title" className="mt-6 text-2xl font-bold tracking-tight">What do you want to do with Claude?</h2>
                <p lang="ar" className="text-fg-muted">ماذا تريد أن تفعل مع Claude؟</p>
                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      aria-pressed={goal === g.id}
                      className={cn(
                        'flex cursor-pointer flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-colors',
                        goal === g.id ? 'border-primary bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]' : 'border-border-soft hover:border-fg-subtle',
                      )}
                    >
                      <g.icon className="size-5 text-clay" aria-hidden />
                      <span className="font-semibold leading-snug">{g.en}</span>
                      <span lang="ar" className="text-sm text-fg-muted">{g.ar}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setStep(0)} className="min-h-12 cursor-pointer rounded-full border border-border px-5 font-medium hover:bg-bg-alt">
                    Back
                  </button>
                  <button
                    onClick={finish}
                    disabled={!goal}
                    className="flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary font-medium text-on-primary disabled:opacity-40"
                  >
                    Start my first lesson <ArrowRight className="size-4" />
                  </button>
                </div>
              </>
            )}
            <p className="mt-4 text-center text-xs text-fg-subtle">You can change this later on the Path page.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
