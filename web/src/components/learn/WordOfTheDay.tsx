import { Bookmark, BookmarkCheck, CalendarDays, Volume2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { LEVEL_INFO, type DictEntry } from '@/data/dictionary'
import { useWordBank } from '@/lib/useWordBank'
import { POS_AR } from '@/data/dictionary'
import { dayKey } from '@/lib/progress'
import { canSpeak, speak } from '@/lib/speech'
import { useToast } from '@/components/ui/toast'
import { SpeakCheck } from './SpeakCheck'


function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

function pick(words: DictEntry[]) {
  const pool = words.filter((w) => w.level === 'B1' || w.level === 'B2')
  return pool[hash(dayKey()) % pool.length]
}

export function WordOfTheDay() {
  const { isSaved, toggleSave } = useApp()
  const toast = useToast()
  const { ready, words } = useWordBank()
  if (!ready) return <div className="h-full min-h-56 animate-pulse rounded-3xl bg-bg-alt" aria-label="Loading word of the day" />
  const w = pick(words)
  const saved = isSaved(w.word)
  return (
    <div className="flex h-full flex-col rounded-3xl border border-border-soft bg-surface p-5 shadow-card">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-clay">
        <CalendarDays className="float-icon size-3.5" /> Word of the day
      </p>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-3xl font-bold tracking-tight">{w.word}</p>
          <p className="text-xs text-fg-muted">
            {w.pos} <span className="font-arabic">· {POS_AR[w.pos]}</span> · {w.level} {w.level && LEVEL_INFO[w.level].en}
          </p>
        </div>
        <div className="flex">
          {canSpeak() && (
            <button
              onClick={() => speak(w.word)}
              aria-label={`Pronounce ${w.word}`}
              className="grid size-9 cursor-pointer place-items-center rounded-full text-primary hover:bg-bg-alt"
            >
              <Volume2 className="size-[18px]" />
            </button>
          )}
          <button
            onClick={() => {
              const added = toggleSave({ word: w.word, ar: w.ar, pos: w.pos })
              toast(added ? `“${w.word}” saved` : `Removed “${w.word}”`)
            }}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${w.word}` : `Save ${w.word}`}
            className="grid size-9 cursor-pointer place-items-center rounded-full text-clay hover:bg-bg-alt"
          >
            {saved ? <BookmarkCheck className="size-[18px]" /> : <Bookmark className="size-[18px]" />}
          </button>
        </div>
      </div>
      <p lang="ar" dir="rtl" className="mt-3 text-right text-2xl font-semibold">
        {w.ar}
      </p>
      <div className="mt-auto pt-4">
        <SpeakCheck word={w.word} showLabel />
      </div>
    </div>
  )
}
