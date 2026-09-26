import { AnimatePresence, motion, Reorder } from 'motion/react'
import {
  ArrowDown, ArrowRight, ArrowUp, Check, CheckCircle2, FlaskConical, GripVertical, Headphones, Lightbulb, RotateCcw,
  Turtle, Volume2, Wrench, X, XCircle,
} from 'lucide-react'
import { useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TranslatableText } from '@/components/translate/TranslatableText'
import { Segmented } from '@/components/ui/segmented'
import { useApp } from '@/context/AppContext'
import { LEVELS, wordBank, type CefrLevel } from '@/data/dictionary'
import { fixTasks, orderTasks } from '@/data/practice'
import { canSpeak, speak } from '@/lib/speech'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'

type Game = 'order' | 'fix' | 'dictation'
const GAMES: Game[] = ['order', 'fix', 'dictation']

function shuffle<T>(a: T[]) {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

export default function Practice() {
  const [params, setParams] = useSearchParams()
  const g = params.get('game') as Game | null
  const game: Game = g && GAMES.includes(g) ? g : 'order'

  return (
    <div className="mx-auto max-w-[1024px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <PageHeader eyebrow={{ en: 'Practice', ar: 'تدرّب' }} title={{ en: 'Play & practise.', ar: 'العب وتدرّب' }} intro={{ en: 'Short games that train your prompting and your English at the same time. Every correct answer earns XP.', ar: 'ألعاب قصيرة تدرّب مهارة كتابة الطلبات ولغتك الإنجليزية معًا. كل إجابة صحيحة تمنحك نقاطًا.' }} />

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar overflow-x-auto">
          <Segmented
            label="Choose a game"
            value={game}
            onChange={(v) => setParams({ game: v }, { replace: true })}
            options={[
              { value: 'order', label: 'Order the prompt' },
              { value: 'fix', label: 'Fix the prompt' },
              { value: 'dictation', label: 'Dictation' },
            ]}
          />
        </div>
        <Link to="/lab" className="inline-flex items-center gap-2 text-sm font-medium text-link hover:underline">
          <FlaskConical className="size-4" /> Build your own in the Prompt Lab
        </Link>
      </div>

      <div className="mt-8">
        {game === 'order' && <OrderGame />}
        {game === 'fix' && <FixGame />}
        {game === 'dictation' && <Dictation />}
      </div>
    </div>
  )
}

/* ---------------- Order the prompt ---------------- */

function OrderGame() {
  const { addXp } = useApp()
  const [index, setIndex] = useState(0)
  const task = orderTasks[index % orderTasks.length]
  const initial = useMemo(() => {
    const items = task.parts.map((p, i) => ({ ...p, id: `${task.id}-${i}`, correct: i }))
    let s = shuffle(items)
    while (s.length > 1 && s.every((x, i) => x.correct === i)) s = shuffle(items)
    return s
  }, [task])
  const [items, setItems] = useState(initial)
  const [checked, setChecked] = useState(false)
  const awarded = useRef(new Set<string>())

  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    setItems(next)
    setChecked(false)
  }
  const allRight = items.every((x, i) => x.correct === i)

  const check = () => {
    setChecked(true)
    if (allRight && !awarded.current.has(task.id)) {
      awarded.current.add(task.id)
      addXp(10, 'Perfect order')
    }
  }
  const next = () => {
    const n = index + 1
    const t = orderTasks[n % orderTasks.length]
    setIndex(n)
    setItems(shuffle(t.parts.map((p, i) => ({ ...p, id: `${t.id}-${i}`, correct: i }))))
    setChecked(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="rounded-[28px] border border-border-soft bg-surface p-5 shadow-card sm:p-7">
        <p className="text-sm text-fg-muted">
          Task {(index % orderTasks.length) + 1} of {orderTasks.length}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{task.goal}</h2>
        <p lang="ar" data-ar-help className="text-sm text-fg-subtle">{task.goalAr}</p>
        <p className="mt-3 text-sm text-fg-muted">Drag the parts (or use the arrows) to build the clearest prompt.</p>

        <Reorder.Group axis="y" values={items} onReorder={(v) => { setItems(v); setChecked(false) }} className="mt-5 space-y-2.5">
          {items.map((it, i) => {
            const ok = it.correct === i
            return (
              <Reorder.Item
                key={it.id}
                value={it}
                className={cn(
                  'flex cursor-grab items-center gap-3 rounded-2xl border bg-surface p-3 shadow-card active:cursor-grabbing',
                  checked ? (ok ? 'border-success bg-success-soft' : 'border-danger bg-danger-soft') : 'border-border-soft',
                )}
              >
                <GripVertical className="size-5 shrink-0 text-fg-subtle" aria-hidden />
                <span className="flex-1 text-[15px]">
                  {checked && (
                    <span className={cn('mr-2 rounded-full px-2 py-0.5 text-xs font-semibold', ok ? 'bg-success text-white dark:text-black' : 'bg-danger text-white')}>
                      {it.label}
                    </span>
                  )}
                  {it.text}
                </span>
                <span className="flex shrink-0 flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move “${it.text}” up`} className="grid size-7 cursor-pointer place-items-center rounded-lg text-fg-muted hover:bg-bg-alt disabled:opacity-30">
                    <ArrowUp className="size-4" />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move “${it.text}” down`} className="grid size-7 cursor-pointer place-items-center rounded-lg text-fg-muted hover:bg-bg-alt disabled:opacity-30">
                    <ArrowDown className="size-4" />
                  </button>
                </span>
              </Reorder.Item>
            )
          })}
        </Reorder.Group>

        <div className="mt-6 flex flex-wrap items-center gap-3" aria-live="polite">
          {!checked || !allRight ? (
            <button onClick={check} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 font-medium text-on-primary">
              <Check className="size-4" /> Check order
            </button>
          ) : (
            <button onClick={next} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 font-medium text-on-primary">
              Next task <ArrowRight className="size-4" />
            </button>
          )}
          {checked && (allRight ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-success"><CheckCircle2 className="size-5" /> Perfect prompt!</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-medium text-danger"><XCircle className="size-5" /> Not yet — the red parts are in the wrong place.</span>
          ))}
        </div>
      </div>

      <aside className="h-fit rounded-[28px] bg-clay-soft p-6">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-clay">
          <Lightbulb className="size-4" /> A good order
        </p>
        <ol className="mt-4 space-y-2 text-[15px]">
          {['Role — who Claude should be', 'Context — the background and why', 'Task — what you want', 'Example — optional', 'Format — length, list, tone'].map((t, i) => (
            <li key={t} className="flex gap-2">
              <span className="font-bold text-clay">{i + 1}.</span> {t}
            </li>
          ))}
        </ol>
        <p lang="ar" data-ar-help className="mt-4 text-sm text-fg-muted">الدور ← السياق ← المهمة ← المثال ← التنسيق</p>
      </aside>
    </div>
  )
}

/* ---------------- Fix the prompt ---------------- */

function FixGame() {
  const { addXp } = useApp()
  const [index, setIndex] = useState(0)
  const task = fixTasks[index % fixTasks.length]
  const [picked, setPicked] = useState<Set<number>>(new Set())
  const [checked, setChecked] = useState(false)
  const score = task.options.filter((o, i) => o.good === picked.has(i)).length
  const perfect = score === task.options.length

  const toggle = (i: number) => {
    if (checked) return
    const n = new Set(picked)
    if (n.has(i)) n.delete(i)
    else n.add(i)
    setPicked(n)
  }
  const check = () => {
    setChecked(true)
    addXp(score * 2, perfect ? 'Great edits' : undefined)
  }
  const next = () => {
    setIndex(index + 1)
    setPicked(new Set())
    setChecked(false)
  }

  return (
    <div className="rounded-[28px] border border-border-soft bg-surface p-5 shadow-card sm:p-7">
      <p className="text-sm text-fg-muted">
        Prompt {(index % fixTasks.length) + 1} of {fixTasks.length}
      </p>
      <div className="mt-3 rounded-2xl bg-bg-alt p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-danger">
          <Wrench className="size-4" /> Weak prompt
        </p>
        <p className="mt-2 font-mono text-lg">“{task.weak}”</p>
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-tight">Which changes make it better? Choose all that help.</h2>
      <p lang="ar" data-ar-help className="text-sm text-fg-subtle">اختر كل التعديلات التي تحسّن الطلب.</p>

      <ul className="mt-4 space-y-2.5">
        {task.options.map((o, i) => {
          const on = picked.has(i)
          const right = o.good === on
          return (
            <li key={o.text}>
              <button
                onClick={() => toggle(i)}
                aria-pressed={on}
                disabled={checked}
                className={cn(
                  'flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition-colors',
                  !checked && (on ? 'border-primary bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]' : 'border-border-soft hover:border-fg-subtle'),
                  checked && (o.good ? 'border-success bg-success-soft' : on ? 'border-danger bg-danger-soft' : 'border-border-soft opacity-70'),
                )}
              >
                <span className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border', on ? 'border-primary bg-primary text-on-primary' : 'border-border')}>
                  {on && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span className="flex-1">
                  <span className="block text-[15px]">{o.text}</span>
                  {checked && (
                    <span className="mt-1 block text-sm">
                      <span className={cn('font-medium', right ? 'text-success' : 'text-danger')}>
                        {o.good ? 'Helps. ' : 'Does not help. '}
                      </span>
                      <span className="text-fg-muted">{o.why}</span>
                      <span lang="ar" data-ar-help className="block text-xs text-fg-subtle">{o.whyAr}</span>
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <AnimatePresence>
        {checked && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-success/30 bg-surface p-4" aria-live="polite">
            <p className="text-sm font-semibold text-success">
              {score}/{task.options.length} correct — here is a strong version:
            </p>
            <TranslatableText text={task.strong} className="mt-2 font-mono text-[15px] leading-relaxed" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6">
        {checked ? (
          <button onClick={next} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 font-medium text-on-primary">
            Next prompt <ArrowRight className="size-4" />
          </button>
        ) : (
          <button onClick={check} disabled={picked.size === 0} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 font-medium text-on-primary disabled:opacity-40">
            <Check className="size-4" /> Check my choices
          </button>
        )}
      </div>
    </div>
  )
}

/* ---------------- Dictation ---------------- */

const ROUNDS = 10

function Dictation() {
  const { addXp } = useApp()
  const voice = canSpeak()
  const [level, setLevel] = useState<CefrLevel>('A2')
  const [mode, setMode] = useState<'listen' | 'translate'>(voice ? 'listen' : 'translate')
  const [round, setRound] = useState(0)
  const deck = useMemo(
    () => shuffle(wordBank.filter((w) => w.level === level && /^[a-z]{3,12}$/.test(w.word))).slice(0, ROUNDS),
    // a fresh deck for every round, level or mode
    [level, mode, round],
  )
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<null | boolean>(null)
  const [score, setScore] = useState(0)
  const [hint, setHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const w = deck[i]

  const restart = (l = level, m = mode) => {
    setLevel(l)
    setMode(m)
    setRound((r) => r + 1)
    setI(0)
    setScore(0)
    setAnswer('')
    setResult(null)
    setHint(false)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (result !== null) {
      setI(i + 1)
      setAnswer('')
      setResult(null)
      setHint(false)
      window.setTimeout(() => inputRef.current?.focus(), 30)
      return
    }
    const ok = answer.trim().toLowerCase() === w.word
    setResult(ok)
    if (ok) {
      setScore((s) => s + 1)
      addXp(hint ? 1 : 2)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-[28px] border border-border-soft bg-surface p-5 shadow-card sm:p-7">
        {i >= deck.length ? (
          <div className="py-10 text-center">
            <p className="text-6xl font-bold tracking-tight">
              {score}/{deck.length}
            </p>
            <p className="mt-2 text-fg-muted">words spelled correctly</p>
            <button onClick={() => restart()} className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 font-medium text-on-primary">
              <RotateCcw className="size-4" /> Play again
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="flex items-center justify-between text-sm text-fg-muted">
              <span>
                Word {i + 1} / {deck.length}
              </span>
              <span>Score {score}</span>
            </div>
            <div className="mt-6 flex flex-col items-center text-center">
              {mode === 'listen' ? (
                <>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => speak(w.word)} className="bg-brand grid size-20 cursor-pointer place-items-center rounded-full text-white shadow-pop transition-transform hover:scale-105" aria-label="Play the word">
                      <Volume2 className="size-9" />
                    </button>
                    <button type="button" onClick={() => speak(w.word, 0.6)} className="grid size-12 cursor-pointer place-items-center self-end rounded-full bg-bg-alt text-fg-muted hover:text-fg" aria-label="Play slowly">
                      <Turtle className="size-5" />
                    </button>
                  </div>
                  <p className="mt-4 text-fg-muted">Listen and type the word you hear.</p>
                  <p lang="ar" data-ar-help className="text-center text-sm text-fg-subtle">استمع واكتب الكلمة.</p>
                </>
              ) : (
                <>
                  <p lang="ar" dir="rtl" className="text-4xl font-bold">{w.ar}</p>
                  <p className="mt-3 text-fg-muted">Type the English word ({w.pos}).</p>
                </>
              )}
              {hint && <p className="mt-3 font-mono text-lg tracking-[0.3em] text-fg-muted">{w.word[0] + ' _'.repeat(w.word.length - 1)}</p>}
            </div>

            <label htmlFor="dictation-input" className="sr-only">Your answer</label>
            <input
              id="dictation-input"
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              readOnly={result !== null}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Type here…"
              className={cn(
                'mt-6 h-14 w-full rounded-2xl border bg-bg-alt px-5 text-center text-xl outline-none focus:ring-4 focus:ring-primary/15 focus-visible:outline-none',
                result === null ? 'border-border focus:border-primary' : result ? 'border-success' : 'border-danger',
              )}
            />
            <div aria-live="polite" className="mt-3 min-h-12 text-center">
              {result === true && <p className="inline-flex items-center gap-1.5 font-medium text-success"><Check className="size-5" /> Correct — {w.word} = <span lang="ar">{w.ar}</span></p>}
              {result === false && (
                <p className="font-medium text-danger">
                  <X className="mr-1 inline size-5" /> The word was <strong>{w.word}</strong> — <span lang="ar">{w.ar}</span>
                </p>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {result === null && (
                <button type="button" onClick={() => setHint(true)} disabled={hint} className="min-h-11 cursor-pointer rounded-full border border-border px-5 text-sm font-medium hover:bg-bg-alt disabled:opacity-40">
                  Hint
                </button>
              )}
              <button type="submit" disabled={result === null && !answer.trim()} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 font-medium text-on-primary disabled:opacity-40">
                {result === null ? 'Check' : <>Next <ArrowRight className="size-4" /></>}
              </button>
            </div>
          </form>
        )}
      </div>

      <aside className="h-fit space-y-5 rounded-[28px] border border-border-soft bg-surface p-5 shadow-card">
        <div>
          <p className="text-sm font-semibold">Mode</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => restart(level, 'listen')}
              disabled={!voice}
              aria-pressed={mode === 'listen'}
              className={cn('flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl border text-sm font-medium disabled:opacity-40', mode === 'listen' ? 'border-fg bg-fg text-bg' : 'border-border-soft')}
            >
              <Headphones className="size-4" /> Listen
            </button>
            <button
              onClick={() => restart(level, 'translate')}
              aria-pressed={mode === 'translate'}
              className={cn('flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl border text-sm font-medium', mode === 'translate' ? 'border-fg bg-fg text-bg' : 'border-border-soft')}
            >
              <span className="font-arabic">ع</span> → En
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Level</p>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => restart(l, mode)}
                aria-pressed={level === l}
                className={cn('min-h-10 cursor-pointer rounded-xl border text-sm font-medium', level === l ? 'border-fg bg-fg text-bg' : 'border-border-soft hover:bg-bg-alt')}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-fg-subtle">2 XP per word (1 XP with a hint). Press Enter to check and continue.</p>
      </aside>
    </div>
  )
}
