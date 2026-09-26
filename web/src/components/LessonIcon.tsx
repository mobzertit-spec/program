import { Brain, Code2, FileText, GraduationCap, Layers, Quote, RefreshCw, Sparkles, Target, UserRound, type LucideProps } from 'lucide-react'
import type { Lesson } from '@/data/lessons'

const map = {
  sparkles: Sparkles,
  target: Target,
  layers: Layers,
  quote: Quote,
  user: UserRound,
  code: Code2,
  brain: Brain,
  refresh: RefreshCw,
  graduation: GraduationCap,
  file: FileText,
} satisfies Record<Lesson['icon'], unknown>

export function LessonIcon({ name, ...props }: { name: Lesson['icon'] } & LucideProps) {
  const Icon = map[name]
  return <Icon aria-hidden {...props} />
}

export const levelTone = (l: Lesson['level']): 'success' | 'primary' | 'clay' =>
  l === 'Beginner' ? 'success' : l === 'Intermediate' ? 'primary' : 'clay'
