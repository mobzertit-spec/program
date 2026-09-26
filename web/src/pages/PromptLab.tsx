import { motion } from 'motion/react'
import { Check, Copy, ExternalLink, RotateCcw, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { BlurFade } from '@/components/ui/blur-fade'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

type Fields = {
  role: string
  task: string
  context: string
  examples: string
  format: string
  tone: string
}

const EMPTY: Fields = { role: '', task: '', context: '', examples: '', format: '', tone: '' }

const TEMPLATES: { name: string; ar: string; fields: Fields }[] = [
  {
    name: 'English tutor',
    ar: 'معلم إنجليزية',
    fields: {
      role: 'You are a patient English teacher for Arabic speakers.',
      task: 'Have a short conversation with me about my weekend. Ask one question at a time.',
      context: 'I am an intermediate learner. I want to speak more naturally and fix common grammar mistakes.',
      examples: '',
      format: 'After each of my answers, show my corrected sentence first, then continue the conversation.',
      tone: 'Friendly',
    },
  },
  {
    name: 'Professional email',
    ar: 'بريد احترافي',
    fields: {
      role: 'You are an expert business writer.',
      task: 'Write an email to a client to say our project will be delivered one week late.',
      context: 'The delay is because of a technical problem we already fixed. The client is important to us.',
      examples: '',
      format: 'Under 120 words, with a clear subject line.',
      tone: 'Formal',
    },
  },
  {
    name: 'Explain code',
    ar: 'شرح الكود',
    fields: {
      role: 'You are a senior JavaScript developer and a great teacher.',
      task: 'Explain what the code below does, line by line.',
      context: 'I am a beginner programmer. Use simple English and avoid difficult technical words.',
      examples: '',
      format: 'A numbered list, then a one-sentence summary.',
      tone: 'Encouraging',
    },
  },
  {
    name: 'New word practice',
    ar: 'تدريب على كلمة',
    fields: {
      role: '',
      task: 'Create 3 example sentences for the word "achieve".',
      context: 'I am learning English and I want sentences I can use at work.',
      examples: 'Word: "improve" → "I read every day to improve my vocabulary."',
      format: 'A numbered list. Add the Arabic meaning of the word at the end.',
      tone: 'Casual',
    },
  },
]

const TONES = ['Friendly', 'Formal', 'Casual', 'Encouraging', 'Funny', 'Direct']

const FIELD_META: { key: keyof Fields; label: string; ar: string; hint: string; placeholder: string; rows: number; required?: boolean }[] = [
  { key: 'role', label: 'Role', ar: 'الدور', hint: 'Who should Claude be?', placeholder: 'You are a friendly English teacher…', rows: 2 },
  { key: 'task', label: 'Task', ar: 'المهمة', hint: 'What exactly do you want?', placeholder: 'Write / Explain / Summarize / Correct…', rows: 3, required: true },
  { key: 'context', label: 'Context', ar: 'السياق', hint: 'Why do you need it? Who will read it?', placeholder: 'I am… I need this for…', rows: 3 },
  { key: 'examples', label: 'Examples', ar: 'أمثلة', hint: 'Show the style you want (optional).', placeholder: 'Example: …', rows: 2 },
  { key: 'format', label: 'Format', ar: 'التنسيق', hint: 'Length, list, table, paragraphs…', placeholder: 'A numbered list, under 100 words…', rows: 2 },
]

export default function PromptLab() {
  const [f, setF] = useState<Fields>(EMPTY)
  const [useTags, setUseTags] = useState(false)
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const set = (k: keyof Fields, v: string) => setF((p) => ({ ...p, [k]: v }))

  const prompt = useMemo(() => buildPrompt(f, useTags), [f, useTags])

  const checks = [
    { ok: f.task.trim().split(/\s+/).length >= 5, en: 'A clear task (5+ words)', ar: 'مهمة واضحة' },
    { ok: !!f.role.trim(), en: 'A role for Claude', ar: 'دور لـ Claude' },
    { ok: f.context.trim().length >= 20, en: 'Useful context', ar: 'سياق مفيد' },
    { ok: !!f.format.trim(), en: 'An output format', ar: 'تنسيق للناتج' },
    { ok: !!f.tone, en: 'A tone', ar: 'أسلوب محدد' },
    { ok: !!f.examples.trim(), en: 'An example (bonus)', ar: 'مثال (إضافي)' },
  ]
  const score = checks.filter((c) => c.ok).length
  const pct = Math.round((score / checks.length) * 100)
  const verdict = pct >= 80 ? 'Excellent prompt' : pct >= 50 ? 'Good — add a little more' : pct > 0 ? 'Getting started' : 'Fill in the fields'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      toast('Prompt copied')
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      toast('Could not copy — select the text instead')
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <BlurFade>
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">Practice</p>
        <h1 className="mt-2 text-5xl font-bold tracking-[-0.035em] sm:text-7xl">Prompt Lab.</h1>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted sm:text-xl">
          Build a great prompt piece by piece. Write in English — the lab scores your prompt as you type.
        </p>
        <p lang="ar" dir="rtl" className="mt-1 text-left text-fg-subtle">ابنِ طلبًا ممتازًا خطوة بخطوة واكتب بالإنجليزية.</p>
      </BlurFade>

      <div className="mt-8 flex flex-wrap gap-2">
        <span className="self-center pr-1 text-sm text-fg-muted">Start from:</span>
        {TEMPLATES.map((t) => (
          <button
            key={t.name}
            onClick={() => setF(t.fields)}
            className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full border border-border-soft bg-surface px-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            {t.name} <span lang="ar" className="text-xs text-fg-subtle">{t.ar}</span>
          </button>
        ))}
        <button
          onClick={() => setF(EMPTY)}
          className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm text-fg-muted hover:text-fg"
        >
          <RotateCcw className="size-3.5" /> Clear
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Builder */}
        <div className="space-y-5">
          {FIELD_META.map((m) => (
            <div key={m.key}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label htmlFor={`f-${m.key}`} className="text-[15px] font-semibold">
                  {m.label} {m.required && <span className="text-danger" aria-hidden>*</span>}
                  <span lang="ar" className="ml-2 text-xs font-normal text-fg-subtle">{m.ar}</span>
                </label>
                <span className="text-xs text-fg-muted" id={`h-${m.key}`}>{m.hint}</span>
              </div>
              <textarea
                id={`f-${m.key}`}
                aria-describedby={`h-${m.key}`}
                rows={m.rows}
                value={f[m.key]}
                onChange={(e) => set(m.key, e.target.value)}
                placeholder={m.placeholder}
                className="block w-full resize-y rounded-2xl border border-border bg-surface px-4 py-3 text-[15px] leading-relaxed outline-none transition-shadow placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/15 focus-visible:outline-none"
              />
            </div>
          ))}
          <fieldset>
            <legend className="mb-2 text-[15px] font-semibold">
              Tone <span lang="ar" className="ml-2 text-xs font-normal text-fg-subtle">الأسلوب</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={f.tone === t}
                  onClick={() => set('tone', f.tone === t ? '' : t)}
                  className={cn(
                    'min-h-9 cursor-pointer rounded-full border px-4 text-sm font-medium transition-all',
                    f.tone === t ? 'border-fg bg-fg text-bg' : 'border-border-soft bg-surface hover:border-fg-subtle',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-[28px] border border-border-soft bg-surface shadow-card">
            <div className="border-b border-border-soft p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Prompt score</p>
                <p className={cn('text-sm font-semibold', pct >= 80 ? 'text-success' : pct >= 50 ? 'text-primary' : 'text-fg-muted')}>{verdict}</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-alt" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Prompt score">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-clay via-[#8a5cf6] to-primary"
                  animate={{ width: `${pct}%` }}
                  transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
                />
              </div>
              <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
                {checks.map((c) => (
                  <li key={c.en} className={cn('flex items-start gap-2 text-sm transition-colors', c.ok ? 'text-fg' : 'text-fg-subtle')}>
                    <span
                      className={cn(
                        'mt-px grid size-5 shrink-0 place-items-center rounded-full transition-colors',
                        c.ok ? 'bg-success text-white dark:text-black' : 'border border-border',
                      )}
                    >
                      {c.ok && <Check className="size-3" strokeWidth={3} />}
                    </span>
                    <span className="leading-tight">
                      {c.en}
                      <span lang="ar" className="block text-xs text-fg-subtle">{c.ar}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between px-5 pt-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={useTags} onChange={(e) => setUseTags(e.target.checked)} className="size-4 accent-[var(--primary)]" />
                Use XML tags
              </label>
              <span className="text-xs text-fg-subtle">{prompt.split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <pre
              data-translatable
              className="m-5 mt-3 max-h-[420px] min-h-40 overflow-auto whitespace-pre-wrap rounded-2xl bg-bg-alt p-4 font-mono text-[13.5px] leading-relaxed text-fg"
            >
              {prompt || <span className="text-fg-subtle">Your prompt will appear here…</span>}
            </pre>
            <div className="flex flex-col gap-2 border-t border-border-soft p-4 sm:flex-row">
              <button
                onClick={copy}
                disabled={!prompt}
                className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 font-medium text-on-primary transition-opacity disabled:opacity-40"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? 'Copied' : 'Copy prompt'}
              </button>
              <a
                href={prompt ? `https://claude.ai/new?q=${encodeURIComponent(prompt)}` : undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!prompt}
                className={cn(
                  'inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border px-5 font-medium transition-colors hover:bg-bg-alt',
                  !prompt && 'pointer-events-none opacity-40',
                )}
              >
                <Sparkles className="size-4 text-clay" /> Try it in Claude <ExternalLink className="size-3.5 opacity-60" />
              </a>
            </div>
          </div>
          <p className="mt-3 px-2 text-xs text-fg-subtle">Tip: select any part of the preview to translate it.</p>
        </div>
      </div>
    </div>
  )
}

function buildPrompt(f: Fields, tags: boolean): string {
  const parts: string[] = []
  const t = (s: string) => s.trim()
  if (tags) {
    if (t(f.role)) parts.push(t(f.role))
    if (t(f.context)) parts.push(`<context>\n${t(f.context)}\n</context>`)
    if (t(f.examples)) parts.push(`<examples>\n${t(f.examples)}\n</examples>`)
    if (t(f.task)) parts.push(`<task>\n${t(f.task)}\n</task>`)
    const fmt = [t(f.format), f.tone && `Use a ${f.tone.toLowerCase()} tone.`].filter(Boolean).join(' ')
    if (fmt) parts.push(`<format>\n${fmt}\n</format>`)
  } else {
    if (t(f.role)) parts.push(t(f.role))
    if (t(f.context)) parts.push(t(f.context))
    if (t(f.task)) parts.push(t(f.task))
    if (t(f.examples)) parts.push(`Here is an example of what I want:\n${t(f.examples)}`)
    const fmt = [t(f.format), f.tone && `Use a ${f.tone.toLowerCase()} tone.`].filter(Boolean).join(' ')
    if (fmt) parts.push(fmt)
  }
  return parts.join('\n\n')
}
