import { english } from './english'
import { features } from './features'
import { foundations } from './foundations'
import { prompting } from './prompting'
import type { Lesson, Track, TrackId } from './types'

export type * from './types'

export const tracks: Track[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    titleAr: 'الأساسيات',
    description: 'Meet Claude, write clear requests, and use AI wisely.',
    descriptionAr: 'تعرّف على Claude، واكتب طلبات واضحة، واستخدم الذكاء الاصطناعي بحكمة.',
  },
  {
    id: 'prompting',
    title: 'Prompting craft',
    titleAr: 'فن كتابة الطلبات',
    description: 'Examples, roles, tags, thinking, formats, and prompt chains.',
    descriptionAr: 'الأمثلة، والأدوار، والوسوم، والتفكير، والتنسيقات، وتسلسل الطلبات.',
  },
  {
    id: 'features',
    title: 'Claude’s toolbox',
    titleAr: 'أدوات Claude',
    description: 'Projects, Artifacts, files, Research, Connectors, Skills, and Claude Code.',
    descriptionAr: 'المشاريع، والأعمال، والملفات، والبحث، والموصلات، والمهارات، وClaude Code.',
  },
  {
    id: 'english',
    title: 'English for work',
    titleAr: 'الإنجليزية للعمل',
    description: 'Emails, interviews, meetings, pronunciation, and English for developers.',
    descriptionAr: 'البريد، والمقابلات، والاجتماعات، والنطق، والإنجليزية للمبرمجين.',
  },
]

/** All lessons in path order, numbered 1…n. */
export const lessons: Lesson[] = [...foundations, ...prompting, ...features, ...english].map((l, i) => ({
  ...l,
  number: i + 1,
}))

export const getLesson = (id: string) => lessons.find((l) => l.id === id)

export const lessonsByTrack = (track: TrackId) => lessons.filter((l) => l.track === track)

export const trackOf = (id: TrackId) => tracks.find((t) => t.id === id)!
