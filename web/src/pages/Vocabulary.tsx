import { motion } from 'motion/react'
import { ArrowRight, Bookmark, BookmarkCheck, Brain, Check, CheckCircle2, Layers, RotateCcw, Search, Trash2, Volume2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SpeakCheck } from '@/components/learn/SpeakCheck'
import { WordOfTheDay } from '@/components/learn/WordOfTheDay'
import { ButtonLink } from '@/components/ui/button'
import { Segmented } from '@/components/ui/segmented'
import { useToast } from '@/components/ui/toast'
import { useApp, type SavedWord } from '@/context/AppContext'
import { LEVEL_INFO, LEVELS, POS_AR, wordBank, type CefrLevel } from '@/data/dictionary'
import { lessons } from '@/data/lessons'
import { canSpeak, speak } from '@/lib/speech'
import { formatDue, isMastered, MAX_BOX } from '@/lib/srs'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'

type Tab = 'review' | 'mine' | 'bank' | 'lessons'
const TABS: Tab[] = ['review', 'mine', 'bank', 'lessons']

type Row = { word: string; ar: string; pos?: string; example?: string; lesson?: string; level?: CefrLevel }

const lessonWords: Row[] = lessons.flatMap((l) => l.vocab.map((v) => ({ ...v, lesson: l.title })))

export default function Vocabulary() {
  const { saved, dueWords } = useApp()
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('tab') as Tab | null
  const tab: Tab = fromUrl && TABS.includes(fromUrl) ? fromUrl : saved.length ? 'review' : 'bank'
  const setTab = (t: Tab) => setParams({ tab: t }, { replace: true })

  return (
    <div className="mx-auto max-w-[1024px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <PageHeader eyebrow={{ en: 'Your words', ar: 'كلماتك' }} title={{ en: 'Vocabulary.', ar: 'المفردات' }} intro={{ en: `${wordBank.length.toLocaleString()} words from beginner to advanced. Save the ones you need — smart reviews bring each word back just before you forget it.`, ar: `أكثر من ${wordBank.length.toLocaleString()} كلمة من المبتدئ إلى المتقدم، مع مراجعة ذكية تعيد الكلمة قبل أن تنساها.` }} />

      <div className="no-scrollbar mt-10 overflow-x-auto">
        <Segmented
          label="Vocabulary view"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'review', label: `Review${dueWords.length ? ` (${dueWords.length})` : ''}` },
            { value: 'mine', label: `My words (${saved.length})` },
            { value: 'bank', label: 'Word bank' },
            { value: 'lessons', label: 'Lesson words' },
          ]}
        />
      </div>

      <div className="mt-8">
        {tab === 'review' && <Review />}
        {tab === 'mine' && <MyWords />}
        {tab === 'bank' && <WordBank />}
        {tab === 'lessons' && <WordList rows={lessonWords} />}
      </div>
    </div>
  )
}

/* ---------------- Review (spaced repetition) ---------------- */

function Review() {
  const { saved, dueWords } = useApp()
  // a running session stays on screen until its summary is closed, even when nothing is due any more
  const [session, setSession] = useState<'review' | 'practice' | null>(() => (dueWords.length ? 'review' : null))

  if (session === 'practice')
    return <Flashcards deck={shuffle(lessonWords).slice(0, 15)} scheduled={false} onDone={() => setSession(null)} />
  if (session === 'review') return <ReviewSession onDone={() => setSession(null)} />
  if (saved.length === 0)
    return (
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <EmptyState />
        <WordOfTheDay />
      </div>
    )
  if (dueWords.length > 0)
    return (
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-bg-alt px-6 py-14 text-center">
          <Brain className="size-12 text-primary" />
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">{dueWords.length} words ready</h2>
          <p lang="ar" data-ar-help className="text-center text-sm text-fg-muted">كلمات جاهزة للمراجعة</p>
          <button
            onClick={() => setSession('review')}
            className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 font-medium text-on-primary"
          >
            Start review <ArrowRight className="size-4" />
          </button>
        </div>
        <WordOfTheDay />
      </div>
    )
  const nextDue = Math.min(...saved.map((s) => s.due))
  return (
    <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col items-center justify-center rounded-[28px] bg-success-soft px-6 py-14 text-center">
        <CheckCircle2 className="size-12 text-success" />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">All caught up!</h2>
        <p lang="ar" data-ar-help className="text-center text-sm text-fg-muted">راجعت كل كلماتك المستحقة.</p>
        <p className="mt-2 text-fg-muted">Next review {formatDue(nextDue)}.</p>
        <button
          onClick={() => setSession('practice')}
          className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-surface px-5 font-medium shadow-card"
        >
          <Layers className="size-4" /> Practise lesson words
        </button>
      </div>
      <WordOfTheDay />
    </div>
  )
}

function ReviewSession({ onDone }: { onDone: () => void }) {
  const { dueWords } = useApp()
  // freeze the deck for this session
  const [deck] = useState(() => dueWords.slice(0, 20))
  return <Flashcards deck={deck} scheduled onDone={onDone} />
}

function shuffle<T>(a: T[]) {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

function Flashcards({ deck, scheduled, onDone }: { deck: Row[]; scheduled: boolean; onDone: () => void }) {
  const { rateWord } = useApp()
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const card = deck[i]

  const answer = (k: boolean) => {
    if (scheduled) rateWord(card.word, k)
    if (k) setKnown((n) => n + 1)
    setFlipped(false)
    setI((n) => n + 1)
  }

  if (i >= deck.length) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-[28px] bg-bg-alt px-6 py-14 text-center">
        <p className="text-6xl font-bold tracking-tight">
          {known}/{deck.length}
        </p>
        <p className="mt-2 text-lg text-fg-muted">words you remembered</p>
        <p lang="ar" data-ar-help className="text-center text-sm text-fg-subtle">كلمات تذكّرتها</p>
        {scheduled && <p className="mt-3 max-w-xs text-sm text-fg-muted">Words you knew will come back later; the others come back soon.</p>}
        <button
          onClick={onDone}
          className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 font-medium text-on-primary"
        >
          <RotateCcw className="size-4" /> Done
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex items-center justify-between text-sm text-fg-muted">
        <span className="inline-flex items-center gap-1.5">
          <Brain className="size-4" /> {scheduled ? 'Smart review' : 'Practice'}
        </span>
        <span>
          {i + 1} / {deck.length}
        </span>
      </div>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-bg-alt">
        <motion.div className="h-full bg-primary" animate={{ width: `${(i / deck.length) * 100}%` }} />
      </div>

      <div className="[perspective:1200px]">
        <motion.button
          key={card.word}
          onClick={() => setFlipped(!flipped)}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0, rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
          aria-label={flipped ? `Meaning: ${card.ar}. Click to flip back.` : `Word: ${card.word}. Click to see the meaning.`}
          className="relative block h-72 w-full cursor-pointer rounded-[32px]"
        >
          <span className="absolute inset-0 flex flex-col items-center justify-center rounded-[32px] border border-border-soft bg-surface p-8 shadow-pop [backface-visibility:hidden]">
            <span className="text-4xl font-bold tracking-tight">{card.word}</span>
            {card.pos && <span className="mt-2 text-sm text-fg-muted">{card.pos}</span>}
            <span className="absolute bottom-5 text-xs text-fg-subtle">Tap to flip · اضغط للقلب</span>
          </span>
          <span className="absolute inset-0 flex flex-col items-center justify-center rounded-[32px] bg-fg p-8 text-bg shadow-pop [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span lang="ar" dir="rtl" className="text-4xl font-bold">
              {card.ar}
            </span>
            {card.example && <span className="mt-4 text-center text-sm italic opacity-70">“{card.example}”</span>}
          </span>
        </motion.button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {canSpeak() && (
          <button
            onClick={() => speak(card.word)}
            aria-label={`Pronounce ${card.word}`}
            className="grid size-9 cursor-pointer place-items-center rounded-full text-primary hover:bg-bg-alt"
          >
            <Volume2 className="size-[18px]" />
          </button>
        )}
        <SpeakCheck key={card.word} word={card.word} showLabel />
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => answer(false)}
          className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface font-medium transition-colors hover:bg-danger-soft hover:text-danger"
        >
          <X className="size-5" /> Still learning
        </button>
        <button
          onClick={() => answer(true)}
          className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-success font-medium text-white transition-opacity hover:opacity-90 dark:text-black"
        >
          <Check className="size-5" /> I know it
        </button>
      </div>
    </div>
  )
}

/* ---------------- My words ---------------- */

function MyWords() {
  const { saved } = useApp()
  if (!saved.length) return <EmptyState />
  const mastered = saved.filter((s) => isMastered(s.box)).length
  return (
    <>
      <p className="mb-4 text-sm text-fg-muted">
        <span className="font-semibold text-fg">{mastered}</span> of {saved.length} words mastered
      </p>
      <WordList rows={saved} />
    </>
  )
}

/* ---------------- Word bank ---------------- */

function WordBank() {
  const [level, setLevel] = useState<CefrLevel | 'all'>('A1')
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by level">
        {(['all', ...LEVELS] as const).map((l) => {
          const count = l === 'all' ? wordBank.length : wordBank.filter((w) => w.level === l).length
          return (
            <button
              key={l}
              onClick={() => setLevel(l)}
              aria-pressed={level === l}
              className={cn(
                'inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors',
                level === l ? 'border-fg bg-fg text-bg' : 'border-border-soft bg-surface hover:bg-bg-alt',
              )}
            >
              {l === 'all' ? 'All' : l}
              {l !== 'all' && <span className={cn('text-xs', level === l ? 'opacity-70' : 'text-fg-subtle')}>{LEVEL_INFO[l].en}</span>}
              <span className={cn('text-xs', level === l ? 'opacity-70' : 'text-fg-subtle')}>{count}</span>
            </button>
          )
        })}
      </div>
      <WordList key={level} rows={level === 'all' ? wordBank : wordBank.filter((w) => w.level === level)} compact />
      <p className="mt-6 text-xs text-fg-subtle">Levels are approximate (CEFR A1–C1). Click the bookmark to add a word to your reviews.</p>
    </>
  )
}

/* ---------------- Shared list ---------------- */

const PAGE = 60

function WordList({ rows, compact }: { rows: Row[]; compact?: boolean }) {
  const [q, setQ] = useState('')
  const [limit, setLimit] = useState(PAGE)
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? rows.filter((r) => r.word.toLowerCase().includes(s) || r.ar.includes(s)) : rows
  }, [rows, q])

  return (
    <>
      <div className="relative mb-5 sm:w-80">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
        <label htmlFor="vocab-search" className="sr-only">
          Search words
        </label>
        <input
          id="vocab-search"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setLimit(PAGE)
          }}
          placeholder="Search in English or Arabic"
          className="h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-[15px] outline-none transition-shadow placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/15 focus-visible:outline-none"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-fg-muted">No words match “{q}”.</p>
      ) : (
        <>
          <ul className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-3', compact && 'lg:grid-cols-4')}>
            {filtered.slice(0, limit).map((r) => (
              <WordRow key={r.word + (r.lesson ?? '')} row={r} compact={compact} />
            ))}
          </ul>
          {filtered.length > limit && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setLimit((n) => n + PAGE * 2)}
                className="min-h-11 cursor-pointer rounded-full border border-border px-6 text-sm font-medium hover:bg-bg-alt"
              >
                Show more ({filtered.length - limit} left)
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}

function WordRow({ row, compact }: { row: Row; compact?: boolean }) {
  const { isSaved, toggleSave, removeWord } = useApp()
  const toast = useToast()
  const saved = isSaved(row.word)
  const s = row as Partial<SavedWord>
  const isMine = s.box !== undefined
  return (
    <li className={cn('flex flex-col rounded-2xl border border-border-soft bg-surface shadow-card', compact ? 'p-4' : 'p-5')}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={cn('truncate font-semibold tracking-tight', compact ? 'text-base' : 'text-lg')}>{row.word}</p>
          <p className="text-xs text-fg-muted">
            {row.pos}
            {row.pos && POS_AR[row.pos] && <span className="font-arabic"> · {POS_AR[row.pos]}</span>}
            {row.level && <span> · {row.level}</span>}
          </p>
        </div>
        <div className="flex shrink-0">
          {canSpeak() && (
            <button
              onClick={() => speak(row.word)}
              aria-label={`Pronounce ${row.word}`}
              className="grid size-9 cursor-pointer place-items-center rounded-full text-primary hover:bg-bg-alt"
            >
              <Volume2 className="size-[18px]" />
            </button>
          )}
          {isMine ? (
            <button
              onClick={() => {
                removeWord(row.word)
                toast(`Removed “${row.word}”`)
              }}
              aria-label={`Remove ${row.word}`}
              className="grid size-9 cursor-pointer place-items-center rounded-full text-fg-subtle hover:bg-danger-soft hover:text-danger"
            >
              <Trash2 className="size-[18px]" />
            </button>
          ) : (
            <button
              onClick={() => {
                const added = toggleSave({ word: row.word, ar: row.ar, pos: row.pos, example: row.example })
                toast(added ? `“${row.word}” saved` : `Removed “${row.word}”`)
              }}
              aria-pressed={saved}
              aria-label={saved ? `Remove ${row.word}` : `Save ${row.word}`}
              className="grid size-9 cursor-pointer place-items-center rounded-full text-clay hover:bg-bg-alt"
            >
              {saved ? <BookmarkCheck className="size-[18px]" /> : <Bookmark className="size-[18px]" />}
            </button>
          )}
        </div>
      </div>
      <p lang="ar" dir="rtl" className={cn('mt-2 text-right font-semibold', compact ? 'text-base' : 'text-lg')}>
        {row.ar}
      </p>
      {row.example && !compact && <p className="mt-2 text-sm italic text-fg-muted">“{row.example}”</p>}
      {(row.lesson || isMine) && (
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-fg-subtle">
          <span>{row.lesson ?? (s.due !== undefined ? `Review ${formatDue(s.due)}` : '')}</span>
          {isMine && (
            <span className="flex items-center gap-1" aria-label={`Memory strength ${s.box} of ${MAX_BOX}`}>
              {Array.from({ length: MAX_BOX }, (_, i) => (
                <span key={i} className={cn('size-1.5 rounded-full', i < s.box! ? 'bg-success' : 'bg-border')} />
              ))}
            </span>
          )}
        </div>
      )}
    </li>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-[28px] border border-dashed border-border px-6 py-16 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-clay-soft">
        <Bookmark className="size-7 text-clay" />
      </span>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">No saved words yet</h2>
      <p className="mt-2 max-w-sm text-fg-muted">
        Click any word in a lesson and press <strong className="text-fg">Save word</strong>, or pick words from the word bank.
      </p>
      <p lang="ar" data-ar-help className="mt-1 text-center text-sm text-fg-subtle">اضغط على أي كلمة في الدروس ثم اختر "حفظ"، أو اختر من بنك الكلمات.</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <ButtonLink to="/path">
          Open your path <ArrowRight className="size-4" />
        </ButtonLink>
        <ButtonLink to="/vocabulary?tab=bank" variant="secondary">
          Browse the word bank
        </ButtonLink>
      </div>
    </div>
  )
}
