/** Run with `npm run test:sync` — checks that merging two devices never loses progress. */
import assert from 'node:assert/strict'
import { mergeProgress } from '../src/lib/sync'

const phone = {
  'pe:saved': [
    { word: 'context', ar: 'سياق', box: 3, due: 100, addedAt: 1 },
    { word: 'fluent', ar: 'طليق', box: 0, due: 5, addedAt: 2 },
  ],
  'pe:completed': ['meet-claude', 'be-specific'],
  'pe:quiz': { 'meet-claude': 2, 'be-specific': 1 },
  'pe:xp': { '2026-09-25': 40, '2026-09-26': 10 },
  'pe:best-streak': 2,
  'pe:goal': 50,
  'pe:reviews': 12,
  'pe:pron': 1,
}
const laptop = {
  'pe:saved': [
    { word: 'context', ar: 'سياق', box: 1, due: 50, addedAt: 1 },
    { word: 'draft', ar: 'مسودة', box: 2, due: 9, addedAt: 3 },
  ],
  'pe:completed': ['meet-claude', 'claude-apps'],
  'pe:quiz': { 'be-specific': 2 },
  'pe:xp': { '2026-09-26': 70 },
  'pe:best-streak': 5,
  'pe:reviews': 3,
}

const m = mergeProgress(phone, laptop)
assert.deepEqual(new Set(m['pe:completed'] as string[]), new Set(['meet-claude', 'be-specific', 'claude-apps']))
assert.deepEqual(m['pe:quiz'], { 'meet-claude': 2, 'be-specific': 2 })
assert.deepEqual(m['pe:xp'], { '2026-09-25': 40, '2026-09-26': 70 })
assert.equal(m['pe:best-streak'], 5)
assert.equal(m['pe:goal'], 50, 'local goal wins')
assert.equal(m['pe:reviews'], 12)
const words = m['pe:saved'] as { word: string; box: number }[]
assert.equal(words.length, 3)
assert.equal(words.find((w) => w.word === 'context')!.box, 3, 'stronger memory box kept')
assert.deepEqual(words.map((w) => w.word), ['draft', 'fluent', 'context'], 'newest first')
// merging is stable: merging the result again changes nothing
assert.deepEqual(mergeProgress(m, laptop), mergeProgress(m, laptop))
assert.deepEqual(mergeProgress({}, {})['pe:completed'], [])
console.log('sync merge: all tests passed')
