import {
  AppWindow, BookOpenText, CalendarDays, ClipboardCheck, PenLine, Search, Brain, Briefcase, Bug, Code2, FileText, FolderKanban, Globe, GraduationCap, Layers,
  LayoutTemplate, Link2, ListChecks, Mail, Mic, Plug, Presentation, Puzzle, Quote, RefreshCw, ShieldCheck, Sparkles,
  Target, Terminal, UserRound, type LucideProps,
} from 'lucide-react'
import type { Lesson, LessonIconName } from '@/data/lessons'

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
  app: AppWindow,
  shield: ShieldCheck,
  list: ListChecks,
  book: BookOpenText,
  link: Link2,
  folder: FolderKanban,
  layout: LayoutTemplate,
  globe: Globe,
  plug: Plug,
  puzzle: Puzzle,
  terminal: Terminal,
  mail: Mail,
  briefcase: Briefcase,
  presentation: Presentation,
  mic: Mic,
  bug: Bug,
  calendar: CalendarDays,
  search: Search,
  pen: PenLine,
  check: ClipboardCheck,
} satisfies Record<LessonIconName, unknown>

export function LessonIcon({ name, ...props }: { name: LessonIconName } & LucideProps) {
  const Icon = map[name]
  return <Icon aria-hidden {...props} />
}

export const levelTone = (l: Lesson['level']): 'success' | 'primary' | 'clay' =>
  l === 'Beginner' ? 'success' : l === 'Intermediate' ? 'primary' : 'clay'
