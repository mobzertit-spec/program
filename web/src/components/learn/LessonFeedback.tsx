import { useInView } from 'motion/react'
import { Loader2, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { fetchLessonStats, sendLessonFeedback, type LessonStats } from '@/lib/community'
import { usePersistentState } from '@/lib/storage'
import { supabaseEnabled } from '@/lib/supabase'
import { cn } from '@/lib/utils'

/** Show the share of "helpful" answers only once enough learners have answered. */
const MIN_ANSWERS = 5

type Step = 'ask' | 'comment' | 'sending' | 'done'

/** "Was this lesson helpful?" — anonymous feedback the author reads in Supabase, plus the public helpful share. */
export function LessonFeedback({ lessonId }: { lessonId: string }) {
  const [answers, setAnswers] = usePersistentState<Record<string, boolean>>('pe:feedback', {})
  const answered = answers[lessonId]
  const [step, setStep] = useState<Step>(answered === undefined ? 'ask' : 'done')
  const [comment, setComment] = useState('')
  const [failed, setFailed] = useState(false)
  const [stats, setStats] = useState<LessonStats | null>(null)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '200px' })

  useEffect(() => {
    if (!inView || !supabaseEnabled) return
    let active = true
    fetchLessonStats(lessonId).then((s) => active && setStats(s), () => {})
    return () => {
      active = false
    }
  }, [inView, lessonId])

  if (!supabaseEnabled) return null

  const send = async (helpful: boolean, text?: string) => {
    setStep('sending')
    setFailed(false)
    try {
      await sendLessonFeedback(lessonId, helpful, text)
      setAnswers((a) => ({ ...a, [lessonId]: helpful }))
      setStats((s) => ({
        helpful: (s?.helpful ?? 0) + (helpful ? 1 : 0),
        not_helpful: (s?.not_helpful ?? 0) + (helpful ? 0 : 1),
      }))
      setStep('done')
    } catch {
      setFailed(true)
      setStep(helpful ? 'ask' : 'comment')
    }
  }

  const total = stats ? stats.helpful + stats.not_helpful : 0
  const share = total >= MIN_ANSWERS ? Math.round((stats!.helpful / total) * 100) : null

  return (
    <section ref={ref} aria-labelledby="feedback-title" className="mt-12 rounded-3xl border border-border-soft bg-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="feedback-title" className="font-semibold">
            {step === 'done' ? 'Thank you for your feedback!' : 'Was this lesson helpful?'}
          </h2>
          <p lang="ar" data-ar-help className="text-sm text-fg-muted">
            {step === 'done' ? 'شكرًا على رأيك!' : 'هل كان هذا الدرس مفيدًا؟'}
          </p>
        </div>
        {step === 'ask' && (
          <div className="flex gap-2">
            <button onClick={() => send(true)} className="lift inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-4 font-medium hover:bg-bg-alt">
              <ThumbsUp className="size-4" aria-hidden /> Yes
            </button>
            <button onClick={() => setStep('comment')} className="lift inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-4 font-medium hover:bg-bg-alt">
              <ThumbsDown className="size-4" aria-hidden /> Not really
            </button>
          </div>
        )}
        {step === 'sending' && <Loader2 className="size-5 animate-spin text-fg-muted" aria-label="Sending" />}
      </div>

      {(step === 'comment' || (step === 'sending' && comment)) && (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault()
            send(false, comment)
          }}
        >
          <label htmlFor="feedback-comment" className="text-sm font-medium">
            What was hard or unclear? <span className="font-normal text-fg-subtle">(optional)</span>{' '}
            <span lang="ar" data-ar-help className="font-normal text-fg-subtle">· ما الذي كان صعبًا أو غير واضح؟</span>
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="English or Arabic is fine."
            className="mt-1.5 w-full rounded-2xl border border-border bg-bg-alt px-4 py-3 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
          <div className="mt-3 flex gap-2">
            <button type="submit" disabled={step === 'sending'} className="min-h-11 cursor-pointer rounded-full bg-primary px-5 font-medium text-on-primary hover:bg-primary-hover disabled:opacity-60">
              Send
            </button>
            <button type="button" onClick={() => setStep('ask')} className="min-h-11 cursor-pointer rounded-full px-4 font-medium text-fg-muted hover:bg-bg-alt">
              Cancel
            </button>
          </div>
        </form>
      )}

      {failed && (
        <p role="alert" className="mt-3 text-sm text-danger">
          Could not send your answer. Check your connection and try again.
        </p>
      )}

      {share !== null && (
        <p className={cn('mt-4 flex items-center gap-2 text-sm text-fg-muted')}>
          <span className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-alt" aria-hidden>
            <span className="block h-full rounded-full bg-success" style={{ width: `${share}%` }} />
          </span>
          {share}% of {total} learners found this lesson helpful
        </p>
      )}
    </section>
  )
}
