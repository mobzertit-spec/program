import { Check, Loader2, Mic, MicOff, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { canListen, listen, matchesWord } from '@/lib/speech'
import { cn } from '@/lib/utils'

type State = { s: 'idle' } | { s: 'listening' } | { s: 'ok' } | { s: 'miss'; heard: string } | { s: 'error'; msg: string }

/** Microphone button: say the word, and the browser's speech recognition checks it. */
export function SpeakCheck({ word, className, showLabel = false }: { word: string; className?: string; showLabel?: boolean }) {
  const { recordPronunciation } = useApp()
  const [state, setState] = useState<State>({ s: 'idle' })
  if (!canListen()) return null

  const run = async () => {
    setState({ s: 'listening' })
    try {
      const guesses = await listen()
      if (!guesses.length) return setState({ s: 'miss', heard: '' })
      const ok = matchesWord(word, guesses)
      recordPronunciation(ok)
      setState(ok ? { s: 'ok' } : { s: 'miss', heard: guesses[0] })
    } catch (e) {
      const code = (e as Error).message
      setState({
        s: 'error',
        msg: code === 'not-allowed' ? 'Allow microphone access to practise.' : 'Could not hear you — try again.',
      })
    }
  }

  const listening = state.s === 'listening'
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <button
        onClick={run}
        disabled={listening}
        aria-label={`Say “${word}” into the microphone`}
        title="Practise pronunciation"
        className={cn(
          'relative grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition-colors',
          listening ? 'bg-danger text-white' : 'text-clay hover:bg-bg-alt',
          state.s === 'ok' && 'bg-success-soft text-success',
        )}
      >
        {listening && <span className="absolute inset-0 animate-ping rounded-full bg-danger/40" aria-hidden />}
        {listening ? <Loader2 className="size-[18px] animate-spin" /> : state.s === 'error' ? <MicOff className="size-[18px]" /> : <Mic className="size-[18px]" />}
      </button>
      <span aria-live="polite" className="text-xs">
        {showLabel && state.s === 'idle' && <span className="text-fg-muted">Say it</span>}
        {listening && <span className="text-fg-muted">Listening…</span>}
        {state.s === 'ok' && (
          <span className="inline-flex items-center gap-1 font-medium text-success">
            <Check className="size-3.5" /> Great!
          </span>
        )}
        {state.s === 'miss' && (
          <span className="inline-flex items-center gap-1 text-danger">
            <X className="size-3.5" /> {state.heard ? `Heard “${state.heard}”` : 'Try again'}
          </span>
        )}
        {state.s === 'error' && <span className="text-fg-muted">{state.msg}</span>}
      </span>
    </span>
  )
}
