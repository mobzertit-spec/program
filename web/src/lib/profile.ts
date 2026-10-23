import type { TrackId } from '@/data/lessons'
import { useCallback } from 'react'
import { usePersistentState, writeStorage } from './storage'

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
  const [profile, setState] = usePersistentState<Profile>('pe:profile', EMPTY_PROFILE)
  // write straight away: the welcome sheet navigates (and unmounts) right after saving
  const setProfile = useCallback(
    (p: Profile) => {
      writeStorage('pe:profile', p)
      setState(p)
    },
    [setState],
  )
  const track = profile.goal ? GOAL_TRACK[profile.goal] : null
  return { profile, setProfile, track }
}
