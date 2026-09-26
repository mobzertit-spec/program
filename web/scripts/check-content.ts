/**
 * Content checks for lessons — run with `npm run check:content`.
 * - every word in lesson text has an offline translation (dictionary / lesson vocab)
 * - vocab words are unique across lessons
 * - quiz answers point at an existing option
 * - resources come only from official sources
 */
import { lessons } from '../src/data/lessons'
import { lemmatize, lookupLocal } from '../src/lib/translate'

const ALLOWED = [
  'https://academy.claude.com/',
  'https://platform.claude.com/docs/',
  'https://code.claude.com/docs/',
  'https://support.claude.com/',
  'https://www.youtube.com/watch?v=',
  'https://github.com/anthropics/',
]
const SKIP = new Set(['claude', 'anthropic'])

const errors: string[] = []
const warnings: string[] = []
const missing = new Map<string, string>()
const seenVocab = new Map<string, string>()
const ids = new Set<string>()

for (const l of lessons) {
  if (ids.has(l.id)) errors.push(`duplicate lesson id: ${l.id}`)
  ids.add(l.id)

  const texts = [l.title, l.summary.en, l.tip.en]
  for (const s of l.sections) texts.push(s.heading, ...s.paragraphs.map((p) => p.en))
  if (l.example) texts.push(l.example.bad, l.example.good, l.example.why.en)
  for (const q of l.quiz) texts.push(q.q, ...q.options, q.explain.en)

  for (const t of texts)
    for (const w of t.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []) {
      if (SKIP.has(w.toLowerCase()) || w.length === 1) continue
      if (!lookupLocal(w)) missing.set(w.toLowerCase(), l.id)
    }

  // readability & completeness
  const reading = [l.summary.en, l.tip.en, ...l.sections.flatMap((s) => s.paragraphs.map((p) => p.en))]
  for (const t of reading)
    for (const sentence of t.split(/(?<=[.!?])\s+/)) {
      const n = sentence.split(/\s+/).length
      if (n > 30) warnings.push(`${l.id}: long sentence (${n} words): "${sentence.slice(0, 60)}…"`)
    }
  const bilingual = [l.summary, l.tip, ...l.sections.flatMap((s) => s.paragraphs), ...(l.example ? [l.example.why] : [])]
  for (const b of bilingual) if (!b.ar.trim() || !/[\u0600-\u06FF]/.test(b.ar)) errors.push(`${l.id}: missing Arabic for "${b.en.slice(0, 40)}"`)
  if (l.sections.length !== 2 || l.sections.some((s) => s.paragraphs.length !== 2)) warnings.push(`${l.id}: expected 2 sections × 2 paragraphs`)
  const textLemmas = new Set(texts.flatMap((t) => (t.match(/[A-Za-z]+/g) ?? []).map((w) => lemmatize(w))))
  for (const v of l.vocab) if (!textLemmas.has(v.word)) warnings.push(`${l.id}: vocab "${v.word}" is not used in the lesson text`)
  for (const q of l.quiz) if (new Set(q.options).size !== q.options.length) errors.push(`${l.id}: duplicate quiz options in "${q.q}"`)

  if (l.vocab.length !== 5) errors.push(`${l.id}: expected 5 vocab words, got ${l.vocab.length}`)
  for (const v of l.vocab) {
    const prev = seenVocab.get(v.word)
    if (prev) errors.push(`vocab "${v.word}" appears in ${prev} and ${l.id}`)
    seenVocab.set(v.word, l.id)
  }
  for (const q of l.quiz)
    if (q.answer < 0 || q.answer >= q.options.length) errors.push(`${l.id}: quiz answer out of range for "${q.q}"`)
  if (!l.resources.length) errors.push(`${l.id}: add at least one official resource`)
  for (const r of [...l.resources, ...(l.video ? [l.video] : [])])
    if (!ALLOWED.some((a) => r.url.startsWith(a))) errors.push(`${l.id}: non-official link ${r.url}`)
}

console.log(`${lessons.length} lessons, ${seenVocab.size} vocab words`)
if (missing.size) {
  console.log(`\n${missing.size} words without offline translation (add them to src/data/dictionary.ts):`)
  console.log([...missing.entries()].map(([w, id]) => `  ${w}  (${id})`).join('\n'))
}
if (warnings.length) console.log('\nWarnings:\n' + warnings.map((w) => '  ' + w).join('\n'))
if (errors.length) console.log('\nErrors:\n' + errors.map((e) => '  ' + e).join('\n'))
if (errors.length || missing.size) process.exit(1)
console.log('All content checks passed.')
