import type { Resource } from '../resources'

export type Level = 'Beginner' | 'Intermediate' | 'Advanced'

export type Bilingual = { en: string; ar: string }

export type VocabItem = {
  word: string
  ar: string
  pos: string
  example: string
}

export type QuizQuestion = {
  q: string
  qAr: string
  options: string[]
  answer: number
  explain: Bilingual
}

export type TrackId = 'foundations' | 'prompting' | 'features' | 'english'

export type LessonIconName =
  | 'sparkles' | 'target' | 'layers' | 'quote' | 'user' | 'code' | 'brain' | 'refresh' | 'graduation' | 'file'
  | 'app' | 'shield' | 'list' | 'book' | 'link' | 'folder' | 'layout' | 'globe' | 'plug' | 'puzzle'
  | 'terminal' | 'mail' | 'briefcase' | 'presentation' | 'mic' | 'bug'

export type LessonInput = {
  id: string
  track: TrackId
  title: string
  titleAr: string
  summary: Bilingual
  level: Level
  minutes: number
  icon: LessonIconName
  sections: { heading: string; headingAr: string; paragraphs: Bilingual[] }[]
  example?: { bad: string; good: string; why: Bilingual }
  tip: Bilingual
  /** "Go deeper" links — official sources only (Claude Academy, Docs, Help Center, Anthropic YouTube) */
  resources: Resource[]
  /** Optional official video embedded in the lesson */
  video?: Resource
  vocab: VocabItem[]
  quiz: QuizQuestion[]
}

export type Lesson = LessonInput & { number: number }

export type Track = {
  id: TrackId
  title: string
  titleAr: string
  description: string
  descriptionAr: string
}
