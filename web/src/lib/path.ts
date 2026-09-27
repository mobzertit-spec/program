import { lessons, type Lesson, type TrackId } from '@/data/lessons'

/** The first lesson of every track is open; the others open when the previous lesson in the track is done. */
export function isUnlocked(lesson: Lesson, completed: string[]) {
  const track = lessons.filter((l) => l.track === lesson.track)
  const i = track.findIndex((l) => l.id === lesson.id)
  return i <= 0 || completed.includes(track[i - 1].id) || completed.includes(lesson.id)
}

/** The next lesson to study: the first unlocked, unfinished lesson in path order. */
/**
 * The next lesson to study: the first unlocked, unfinished lesson — inside the learner's
 * preferred track when they chose one, otherwise in path order.
 */
export function nextLesson(completed: string[], preferredTrack?: TrackId | null) {
  const open = (l: Lesson) => !completed.includes(l.id) && isUnlocked(l, completed)
  return (preferredTrack && lessons.find((l) => l.track === preferredTrack && open(l))) || lessons.find(open)
}
