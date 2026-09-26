import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Bookmark, BookmarkCheck, Check, Layers, RotateCcw, Search, Shuffle, Trash2, Volume2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { BlurFade } from '@/components/ui/blur-fade'
import { ButtonLink } from '@/components/ui/button'
import { Segmented } from '@/components/ui/segmented'
import { useToast } from '@/components/ui/toast'
import { useApp, type SavedWord } from '@/context/AppContext'
import { useTranslator } from '@/context/TranslatorContext'
import { lessons } from '@/data/lessons'
import { canSpeak, speak } from '@/lib/speech'
import { cn } from '@/lib/utils'

type Tab = 'mine' | 'all' | 'cards'

type Row = { word: string; ar: string; pos?: string; example?: string; lesson?: string }

const lessonWords: Row[] = lessons.flatMap((l) => l.vocab.map((v) => ({ ...v, lesson: l.title })))

export default function Vocabulary() {
  const { saved } = useApp()
  const { setPanelOpen } = useTranslator()
  const [tab, setTab] = useState<Tab>(saved.length ? 'mine' : 'all')
  const [q, setQ] = useState('')

  const rows: Row[] = tab === 'mine' ? saved : lessonWords
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return rows
    return rows.filter((r) => r.word.toLowerCase().includes(s) || r.ar.includes(s))
  }, [rows, q])

  return (
    <div className="mx-auto max-w-[1024px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <BlurFade>
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">Your words</p>
        <h1 className="mt-2 text-5xl font-bold tracking-[-0.035em] sm:text-7xl">Vocabulary.</h1>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted sm:text-xl">
          Save words while you read, then review them with flashcards. A few minutes every day is all it takes.
        </p>
        <p lang="ar" dir="rtl" className="mt-1 text-left text-fg-subtle">احفظ الكلمات وراجعها يوميًا بالبطاقات التعليمية.</p>
      </BlurFade>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar overflow-x-auto">
          <Segmented
            label="Vocabulary view"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'mine', label: `My words (${saved.length})` },
              { value: 'all', label: 'All lesson words' },
              { value: 'cards', label: 'Flashcards' },
            ]}
          />
        </div>
        {tab !== 'cards' && (
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
            <label htmlFor="vocab-search" className="sr-only">Search words</label>
            <input
              id="vocab-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search in English or Arabic"
              className="h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-[15px] outline-none transition-shadow placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/15 focus-visible:outline-none"
            />
          </div>
        )}
      </div>

      <div className="mt-8">
        {tab === 'cards' ? (
          <Flashcards />
        ) : tab === 'mine' && saved.length === 0 ? (
          <EmptyState onTranslate={() => setPanelOpen(true)} />
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-fg-muted">No words match “{q}”.</p>
        ) : (
          <motion.ul layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((r) => (
                <WordRow key={r.word} row={r} />
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </div>
  )
}

function WordRow({ row }: { row: Row }) {
  const { isSaved, toggleSave, removeWord } = useApp()
  const toast = useToast()
  const saved = isSaved(row.word)
  const s = row as Partial<SavedWord>
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      className="flex flex-col rounded-2xl border border-border-soft bg-surface p-5 shadow-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold tracking-tight">{row.word}</p>
          {row.pos && <p className="text-xs text-fg-muted">{row.pos}</p>}
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
          {row.lesson ? (
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
          ) : (
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
          )}
        </div>
      </div>
      <p lang="ar" dir="rtl" className="mt-2 text-right text-lg font-semibold">{row.ar}</p>
      {row.example && <p className="mt-2 text-sm italic text-fg-muted">“{row.example}”</p>}
      <div className="mt-auto flex items-center justify-between pt-3 text-xs text-fg-subtle">
        <span>{row.lesson ?? ''}</span>
        {s.strength !== undefined && (
          <span className="flex items-center gap-1" aria-label={`Mastery ${Math.min(s.strength, 3)} of 3`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={cn('size-1.5 rounded-full', i < s.strength! ? 'bg-success' : 'bg-border')} />
            ))}
          </span>
        )}
      </div>
    </motion.li>
  )
}

function EmptyState({ onTranslate }: { onTranslate: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-[28px] border border-dashed border-border px-6 py-16 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-clay-soft">
        <Bookmark className="size-7 text-clay" />
      </span>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">No saved words yet</h2>
      <p className="mt-2 max-w-sm text-fg-muted">
        Click any word in a lesson and press <strong className="text-fg">Save word</strong>. It will appear here.
      </p>
      <p lang="ar" className="mt-1 text-center text-sm text-fg-subtle">اضغط على أي كلمة في الدروس ثم اختر "حفظ".</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <ButtonLink to="/lessons/meet-claude">
          Open a lesson <ArrowRight className="size-4" />
        </ButtonLink>
        <button onClick={onTranslate} className="min-h-11 cursor-pointer rounded-full px-5 font-medium text-link hover:underline">
          Use the translator
        </button>
      </div>
    </div>
  )
}

function shuffle<T>(a: T[]) {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

function Flashcards() {
  const { saved, rateWord } = useApp()
  const usingSaved = saved.length >= 3
  const source: Row[] = usingSaved ? saved : lessonWords
  const [deck, setDeck] = useState(() => shuffle(source).slice(0, 20))
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const card = deck[i]
  const done = i >= deck.length

  const answer = (k: boolean) => {
    if (usingSaved) rateWord(card.word, k)
    if (k) setKnown((n) => n + 1)
    setFlipped(false)
    setI((n) => n + 1)
  }
  const restart = () => {
    setDeck(shuffle(source).slice(0, 20))
    setI(0)
    setKnown(0)
    setFlipped(false)
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-[28px] bg-bg-alt px-6 py-14 text-center">
        <p className="text-6xl font-bold tracking-tight">
          {known}/{deck.length}
        </p>
        <p className="mt-2 text-lg text-fg-muted">words you already know</p>
        <p lang="ar" className="text-center text-sm text-fg-subtle">كلمات تعرفها</p>
        <button
          onClick={restart}
          className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 font-medium text-on-primary"
        >
          <RotateCcw className="size-4" /> Practise again
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex items-center justify-between text-sm text-fg-muted">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="size-4" /> {usingSaved ? 'Your saved words' : 'Lesson words'}
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
          <span
            className="absolute inset-0 flex flex-col items-center justify-center rounded-[32px] border border-border-soft bg-surface p-8 shadow-pop [backface-visibility:hidden]"
          >
            <span className="text-4xl font-bold tracking-tight">{card.word}</span>
            {card.pos && <span className="mt-2 text-sm text-fg-muted">{card.pos}</span>}
            <span className="absolute bottom-5 text-xs text-fg-subtle">Tap to flip · اضغط للقلب</span>
          </span>
          <span
            className="absolute inset-0 flex flex-col items-center justify-center rounded-[32px] bg-fg p-8 text-bg shadow-pop [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <span lang="ar" dir="rtl" className="text-4xl font-bold">{card.ar}</span>
            {card.example && <span className="mt-4 text-center text-sm italic opacity-70">“{card.example}”</span>}
          </span>
        </motion.button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => answer(false)}
          className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface font-medium transition-colors hover:bg-danger-soft hover:text-danger"
        >
          <X className="size-5" /> Still learning
        </button>
        {canSpeak() && (
          <button
            onClick={() => speak(card.word)}
            aria-label={`Pronounce ${card.word}`}
            className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-border bg-surface text-primary hover:bg-bg-alt"
          >
            <Volume2 className="size-5" />
          </button>
        )}
        <button
          onClick={() => answer(true)}
          className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-success font-medium text-white transition-opacity hover:opacity-90 dark:text-black"
        >
          <Check className="size-5" /> I know it
        </button>
      </div>
      <button onClick={restart} className="mx-auto mt-4 flex cursor-pointer items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
        <Shuffle className="size-4" /> Shuffle
      </button>
      {!usingSaved && (
        <p className="mt-6 text-center text-sm text-fg-subtle">Save at least 3 words to practise your own list.</p>
      )}
    </div>
  )
}
