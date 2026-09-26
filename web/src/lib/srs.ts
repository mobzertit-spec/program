/**
 * Leitner-style spaced repetition.
 * Each correct answer moves a word to the next box and pushes its next review further away;
 * a miss sends it back to box 1 and shows it again soon.
 */
const DAY = 24 * 60 * 60 * 1000
/** days until the next review, indexed by box */
export const INTERVAL_DAYS = [0, 1, 2, 4, 8, 16, 32]
export const MAX_BOX = INTERVAL_DAYS.length - 1

export function nextReview(box: number, known: boolean, now = Date.now()) {
  if (!known) return { box: 1, due: now + 10 * 60 * 1000 }
  const next = Math.min(box + 1, MAX_BOX)
  return { box: next, due: now + INTERVAL_DAYS[next] * DAY }
}

export const isMastered = (box: number) => box >= 4

export function formatDue(due: number, now = Date.now()) {
  const diff = due - now
  if (diff <= 0) return 'now'
  const hours = Math.round(diff / (60 * 60 * 1000))
  if (hours < 1) return 'in a few minutes'
  if (hours < 24) return `in ${hours} h`
  const days = Math.round(diff / DAY)
  return days === 1 ? 'tomorrow' : `in ${days} days`
}
