import type { TrackId } from '@/data/lessons'
import { usePersistentState } from './storage'

export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced'
export type Goal = 'daily' | 'work' | 'code' | 'study'

export type Profile = { level: EnglishLevel | null; goal: Goal | null; onboarded: boolean }

export const GOAL_TRACK: Record<Goal, TrackId> = {
  daily: 'foundations',
  work: 'english',
  code: 'prompting',
  study: 'students',
}

export const EMPTY_PROFILE: Profile = { level: null, goal: null, onboarded: false }

export function useProfile() {
  const [profile, setProfile] = usePersistentState<Profile>('pe:profile', EMPTY_PROFILE)
  const track = profile.goal ? GOAL_TRACK[profile.goal] : null
  return { profile, setProfile, track }
}
