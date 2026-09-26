import { lessons, tracks } from '@/data/lessons'
import { isMastered } from './srs'

export type AchievementState = {
  completed: string[]
  quizScores: Record<string, number>
  saved: { box: number }[]
  xp: number
  bestStreak: number
  reviewsDone: number
  pronunciationHits: number
}

export type Achievement = {
  id: string
  title: string
  titleAr: string
  description: string
  icon: 'rocket' | 'flame' | 'star' | 'book' | 'trophy' | 'crown' | 'mic' | 'layers' | 'zap' | 'medal'
  earned: (s: AchievementState) => boolean
}

const perfectQuizzes = (s: AchievementState) =>
  lessons.filter((l) => (s.quizScores[l.id] ?? -1) === l.quiz.length).length

export const achievements: Achievement[] = [
  { id: 'first-lesson', title: 'First step', titleAr: 'الخطوة الأولى', description: 'Complete your first lesson', icon: 'rocket', earned: (s) => s.completed.length >= 1 },
  { id: 'five-lessons', title: 'On a roll', titleAr: 'انطلاقة قوية', description: 'Complete 5 lessons', icon: 'zap', earned: (s) => s.completed.length >= 5 },
  ...tracks.map<Achievement>((t) => ({
    id: `track-${t.id}`,
    title: `${t.title} graduate`,
    titleAr: `خرّيج ${t.titleAr}`,
    description: `Finish every lesson in “${t.title}”`,
    icon: 'medal',
    earned: (s) => lessons.filter((l) => l.track === t.id).every((l) => s.completed.includes(l.id)),
  })),
  { id: 'all-lessons', title: 'Prompt master', titleAr: 'أستاذ الطلبات', description: 'Complete every lesson', icon: 'crown', earned: (s) => s.completed.length >= lessons.length },
  { id: 'perfect-5', title: 'Sharp mind', titleAr: 'عقل حاد', description: 'Get 5 perfect quiz scores', icon: 'star', earned: (s) => perfectQuizzes(s) >= 5 },
  { id: 'words-10', title: 'Word collector', titleAr: 'جامع الكلمات', description: 'Save 10 words', icon: 'book', earned: (s) => s.saved.length >= 10 },
  { id: 'words-50', title: 'Word hoarder', titleAr: 'كنز الكلمات', description: 'Save 50 words', icon: 'layers', earned: (s) => s.saved.length >= 50 },
  { id: 'mastered-10', title: 'Memory builder', titleAr: 'بنّاء الذاكرة', description: 'Master 10 words with reviews', icon: 'trophy', earned: (s) => s.saved.filter((w) => isMastered(w.box)).length >= 10 },
  { id: 'reviews-100', title: 'Review pro', titleAr: 'محترف المراجعة', description: 'Do 100 flashcard reviews', icon: 'layers', earned: (s) => s.reviewsDone >= 100 },
  { id: 'speaker', title: 'Clear speaker', titleAr: 'نطق واضح', description: 'Pronounce 10 words correctly', icon: 'mic', earned: (s) => s.pronunciationHits >= 10 },
  { id: 'streak-3', title: '3-day streak', titleAr: 'سلسلة 3 أيام', description: 'Learn 3 days in a row', icon: 'flame', earned: (s) => s.bestStreak >= 3 },
  { id: 'streak-7', title: 'One full week', titleAr: 'أسبوع كامل', description: 'Learn 7 days in a row', icon: 'flame', earned: (s) => s.bestStreak >= 7 },
  { id: 'streak-30', title: 'Unstoppable', titleAr: 'لا يتوقف', description: 'Learn 30 days in a row', icon: 'flame', earned: (s) => s.bestStreak >= 30 },
  { id: 'xp-1000', title: '1,000 XP', titleAr: '1000 نقطة', description: 'Earn 1,000 XP', icon: 'trophy', earned: (s) => s.xp >= 1000 },
]
