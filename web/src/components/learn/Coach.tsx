import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, Copy, ExternalLink, Loader2, RotateCcw, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mascot, type MascotPose } from '@/components/mascot/Mascot'
import { TranslatableText } from '@/components/translate/TranslatableText'
import { ProgressRing } from '@/components/ui/progress-ring'
import { useToast } from '@/components/ui/toast'
import { useApp } from '@/context/AppContext'
import { askCoach, COACH_MAX, COACH_MIN, COACH_TASKS, type CoachError, type CoachFeedback, type CoachTaskId } from '@/lib/coach'
import { cn } from '@/lib/utils'

const PLACEHOLDER: Record<CoachTaskId, string> = {
  email: 'Write an email to my manager. I need Friday off because...',
  grammar: 'You are an English teacher. Please correct...',
  trip: 'Plan a 2-day trip to...',
  code: 'My React app shows this error: ...',
  summary: 'Summarize this article for...',
  free: 'Write your prompt for Claude here...',
}

const ERRORS: Record<CoachError, { pose: MascotPose; en: string; ar: string }> = {
  not_configured: { pose: 'sleep', en: 'The coach is resting — it will be switched on soon. Until then, the Prompt Lab gives you an instant score.', ar: 'المدرّب يستريح وسيعمل قريبًا. حتى ذلك الحين يمنحك مختبر الطلبات تقييمًا فوريًا.' },
  rate_limited: { pose: 'sleep', en: 'You used today’s free feedback. Come back tomorrow — Cee will be ready!', ar: 'استخدمت ملاحظات اليوم المجانية. عُد غدًا!' },
  refused: { pose: 'think', en: 'Cee can’t review this prompt. Please try a different topic.', ar: 'لا يستطيع المدرّب مراجعة هذا الطلب. جرّب موضوعًا آخر.' },
  invalid: { pose: 'think', en: `Write between ${COACH_MIN} and ${COACH_MAX} characters, in English.`, ar: `اكتب بين ${COACH_MIN} و${COACH_MAX} حرفًا بالإنجليزية.` },
  failed: { pose: 'think', en: 'Something went wrong on our side. Please try again in a minute.', ar: 'حدث خطأ من جهتنا. حاول مجددًا بعد دقيقة.' },
  offline: { pose: 'sleep', en: 'You seem to be offline. Check your connection and try again.', ar: 'يبدو أنك غير متصل بالإنترنت.' },
}

/** Prompt coach: the learner writes a prompt, Claude (via our Edge Function) reviews it and fixes the English. */
export function Coach() {
  const { addXp } = useApp()
  const [task, setTask] = useState<CoachTaskId>('email')
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null)
  const [error, setError] = useState<CoachError | null>(null)
  const length = prompt.trim().length

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (length < COACH_MIN || length > COACH_MAX) return setError('invalid')
    setBusy(true)
    setError(null)
    const res = await askCoach(task, prompt.trim())
    setBusy(false)
    if (res.ok) {
      setFeedback(res.feedback)
      addXp(5, 'Coach feedback')
    } else setError(res.error)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={submit} className="rounded-[28px] border border-border-soft bg-surface p-5 shadow-card sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">1 · Choose a task</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Practice task">
          {COACH_TASKS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTask(t.id)}
              aria-pressed={task === t.id}
              className={cn(
                'inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors',
                task === t.id ? 'border-fg bg-fg text-bg' : 'border-border-soft hover:bg-bg-alt',
              )}
            >
              {t.en} <span lang="ar" data-ar-help className={cn('text-xs', task === t.id ? 'opacity-70' : 'text-fg-subtle')}>{t.ar}</span>
            </button>
          ))}
        </div>

        <label htmlFor="coach-prompt" className="mt-6 block text-sm font-semibold uppercase tracking-[0.08em] text-clay">
          2 · Write your prompt in English
        </label>
        <textarea
          id="coach-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={COACH_MAX}
          rows={7}
          placeholder={PLACEHOLDER[task]}
          className="mt-3 w-full resize-y rounded-2xl border border-border bg-bg-alt px-4 py-3 text-base leading-relaxed outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
        <div className="mt-1.5 flex items-center justify-between text-xs text-fg-muted">
          <span>Mistakes are fine — Cee will fix your English too.</span>
          <span className="tabular-nums">{length}/{COACH_MAX}</span>
        </div>

        <button
          type="submit"
          disabled={busy || length < COACH_MIN}
          className="mt-5 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary font-medium text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
          {busy ? 'Cee is reading…' : 'Get feedback from Claude'}
        </button>
        <p className="mt-3 text-center text-xs text-fg-muted">
          Your text is sent to Claude to create the feedback and is not stored.{' '}
          <Link to="/privacy" className="font-medium text-link hover:underline">Privacy</Link>
        </p>
      </form>

      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {busy ? (
            <Panel key="busy" pose="think" title="Cee is reading your prompt…" ar="«سي» يقرأ طلبك…" />
          ) : error ? (
            <Panel key={`e-${error}`} pose={ERRORS[error].pose} title={ERRORS[error].en} ar={ERRORS[error].ar}>
              {error === 'not_configured' && (
                <Link to="/lab" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-5 font-medium shadow-card">
                  Open the Prompt Lab <ArrowRight className="size-4" />
                </Link>
              )}
            </Panel>
          ) : feedback ? (
            <Result
              key="result"
              feedback={feedback}
              onUse={() => {
                setPrompt(feedback.improved_prompt)
                setFeedback(null)
              }}
            />
          ) : (
            <Panel
              key="intro"
              pose="wave"
              title="Hi, I’m Cee — your prompt coach."
              ar="مرحبًا، أنا «سي» مدرّبك على كتابة الطلبات."
            >
              <p className="mt-2 max-w-sm text-center text-fg-muted">
                Write a prompt for Claude. I’ll tell you what works, what to add, and I’ll fix your English.
              </p>
            </Panel>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Panel({ pose, title, ar, children }: { pose: MascotPose; title: string; ar: string; children?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex h-full min-h-80 flex-col items-center justify-center rounded-[28px] bg-bg-alt px-6 py-10 text-center"
    >
      <Mascot pose={pose} size={120} />
      <p className="mt-3 max-w-md text-lg font-semibold tracking-tight">{title}</p>
      <p lang="ar" data-ar-help className="mt-1 text-center text-sm text-fg-muted">{ar}</p>
      {children}
    </motion.div>
  )
}

function Result({ feedback: f, onUse }: { feedback: CoachFeedback; onUse: () => void }) {
  const toast = useToast()
  const pose: MascotPose = f.score >= 8 ? 'cheer' : f.score >= 5 ? 'wave' : 'think'
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(f.improved_prompt)
      toast('Improved prompt copied')
    } catch {
      toast('Could not copy — select the text instead')
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-[28px] border border-border-soft bg-surface p-5 shadow-card sm:p-6"
    >
      <div className="flex items-center gap-4">
        <Mascot pose={pose} size={84} />
        <div className="relative grid place-items-center">
          <ProgressRing value={f.score / 10} size={64} stroke={6} label={`Score ${f.score} out of 10`} />
          <span className="absolute text-lg font-bold tabular-nums">{f.score}</span>
        </div>
        <div className="min-w-0 flex-1">
          <TranslatableText text={f.summary.en} className="font-semibold leading-snug" />
          <p lang="ar" data-ar-help className="text-sm text-fg-muted">{f.summary.ar}</p>
        </div>
      </div>

      <Section title="What works" ar="ما هو جيد" items={f.strengths} icon={<Check className="size-4 text-success" strokeWidth={3} />} />
      <Section title="Make it better" ar="كيف تحسّنه" items={f.improvements} icon={<ArrowRight className="size-4 text-primary" />} />

      {f.english_fixes.length > 0 && (
        <div className="mt-5">
          <h3 className="font-semibold">Your English <span lang="ar" data-ar-help className="text-sm font-normal text-fg-muted">· لغتك الإنجليزية</span></h3>
          <ul className="mt-2 space-y-2">
            {f.english_fixes.map((x, i) => (
              <li key={i} className="rounded-2xl bg-bg-alt px-4 py-3 text-sm">
                <span className="text-danger line-through decoration-2">{x.wrong}</span>
                <ArrowRight className="mx-2 inline size-3.5 text-fg-subtle" aria-label="should be" />
                <span className="font-semibold text-success">{x.right}</span>
                <span className="mt-1 block text-fg-muted">{x.why_en}</span>
                <span lang="ar" data-ar-help className="block text-fg-subtle">{x.why_ar}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5">
        <h3 className="font-semibold">A stronger version <span lang="ar" data-ar-help className="text-sm font-normal text-fg-muted">· نسخة أقوى</span></h3>
        <p className="mt-2 rounded-2xl border border-primary/25 bg-bg-alt p-4 font-mono text-sm leading-relaxed">{f.improved_prompt}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={copy} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-sm font-medium hover:bg-bg-alt">
            <Copy className="size-4" /> Copy
          </button>
          <a
            href={`https://claude.ai/new?q=${encodeURIComponent(f.improved_prompt)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"
          >
            Try it in Claude <ExternalLink className="size-4" />
          </a>
          <button onClick={onUse} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium text-fg-muted hover:bg-bg-alt">
            <RotateCcw className="size-4" /> Edit it and try again
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function Section({ title, ar, items, icon }: { title: string; ar: string; items: { en: string; ar: string }[]; icon: React.ReactNode }) {
  if (!items.length) return null
  return (
    <div className="mt-5">
      <h3 className="font-semibold">{title} <span lang="ar" data-ar-help className="text-sm font-normal text-fg-muted">· {ar}</span></h3>
      <ul className="mt-2 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-[15px]">
            <span className="mt-1 shrink-0">{icon}</span>
            <span>
              <TranslatableText as="span" text={it.en} />
              <span lang="ar" data-ar-help className="block text-sm text-fg-subtle">{it.ar}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
