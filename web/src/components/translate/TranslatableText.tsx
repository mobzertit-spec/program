import { useMemo, type KeyboardEvent, type MouseEvent } from 'react'
import { useApp } from '@/context/AppContext'
import { rectOf, useTranslator } from '@/context/TranslatorContext'
import { lemmatize } from '@/lib/translate'
import { cn } from '@/lib/utils'

const TOKEN = /([A-Za-z]+(?:['’][A-Za-z]+)*)|([^A-Za-z]+)/g
/** Proper names we never translate. */
const SKIP = new Set(['claude', 'anthropic'])

type Props = {
  text: string
  className?: string
  /** base forms to highlight with a dotted underline (e.g. the lesson's key vocabulary) */
  highlight?: Set<string>
  as?: 'p' | 'span' | 'div' | 'h2' | 'h3'
}

/**
 * Renders English text where every word can be clicked (or tapped) for an instant Arabic
 * translation. Highlighted vocabulary words are also keyboard-focusable.
 */
export function TranslatableText({ text, className, highlight, as: Tag = 'p' }: Props) {
  const { open } = useTranslator()
  const { isSaved } = useApp()

  const tokens = useMemo(() => {
    const out: { t: string; word: boolean; base: string }[] = []
    for (const m of text.matchAll(TOKEN)) {
      if (m[1]) out.push({ t: m[1], word: !SKIP.has(m[1].toLowerCase()), base: lemmatize(m[1]) })
      else out.push({ t: m[2], word: false, base: '' })
    }
    return out
  }, [text])

  const activate = (el: HTMLElement) => {
    const w = el.dataset.w
    if (!w) return
    open({ text: w, kind: 'word', rect: rectOf(el), anchor: el })
  }

  const onClick = (e: MouseEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-w]')
    if (!el) return
    // don't hijack a text selection — the selection translator handles that
    if ((window.getSelection()?.toString().trim().length ?? 0) > 0) return
    activate(el)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-w]')
    if (!el) return
    e.preventDefault()
    activate(el)
  }

  return (
    <Tag className={className} onClick={onClick} onKeyDown={onKeyDown} data-translatable>
      {tokens.map((tok, i) => {
        if (!tok.word) return <span key={i}>{tok.t}</span>
        const hi = highlight?.has(tok.base) ?? false
        const saved = isSaved(tok.base) || isSaved(tok.t)
        return (
          <span
            key={i}
            data-w={tok.t}
            data-saved={saved || undefined}
            className={cn('tw', !hi && !saved && 'tw-plain', hi && 'font-medium')}
            {...(hi ? { tabIndex: 0, role: 'button', 'aria-label': `Translate “${tok.t}”` } : {})}
          >
            {tok.t}
          </span>
        )
      })}
    </Tag>
  )
}
