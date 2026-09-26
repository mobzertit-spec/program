import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { applyLocal, collectLocal, mergeProgress, sameProgress, type ProgressData } from '@/lib/sync'

type Status = 'off' | 'syncing' | 'synced' | 'error'
type SyncState = { status: Status; lastSynced: number | null; error: string | null; syncNow: () => Promise<void> }

const Ctx = createContext<SyncState>({ status: 'off', lastSynced: null, error: null, syncNow: async () => {} })

/**
 * Keeps progress in the cloud for signed-in learners:
 * on sign-in it merges this device with the cloud copy, then uploads every change (debounced).
 */
export function SyncProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const app = useApp()
  const [status, setStatus] = useState<Status>('off')
  const [lastSynced, setLastSynced] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const ready = useRef(false)

  const upload = useCallback(
    async (data: ProgressData) => {
      if (!supabase || !user) return
      setStatus('syncing')
      const { error: err } = await supabase
        .from('progress')
        .upsert({ user_id: user.id, data, updated_at: new Date().toISOString() })
      if (err) {
        setStatus('error')
        setError(err.message)
      } else {
        setStatus('synced')
        setError(null)
        setLastSynced(Date.now())
      }
    },
    [user],
  )

  const pullAndMerge = useCallback(async () => {
    if (!supabase || !user) return
    setStatus('syncing')
    const { data, error: err } = await supabase.from('progress').select('data').eq('user_id', user.id).maybeSingle()
    if (err) {
      setStatus('error')
      setError(err.message)
      return
    }
    const local = collectLocal()
    const merged = data?.data ? mergeProgress(local, data.data as ProgressData) : local
    if (!sameProgress(merged, local)) applyLocal(merged)
    ready.current = true
    await upload(merged)
  }, [user, upload])

  // first sync after sign-in (or when switching accounts)
  useEffect(() => {
    ready.current = false
    if (!user) {
      setStatus('off')
      return
    }
    void pullAndMerge()
  }, [user, pullAndMerge])

  // upload changes a moment after they happen
  const { saved, completed, quizScores, xpLog, bestStreak, dailyGoal, reviewsDone, pronunciationHits } = app
  useEffect(() => {
    if (!user || !ready.current) return
    const t = window.setTimeout(() => void upload(collectLocal()), 1500)
    return () => window.clearTimeout(t)
  }, [user, upload, saved, completed, quizScores, xpLog, bestStreak, dailyGoal, reviewsDone, pronunciationHits])

  const value = useMemo(() => ({ status, lastSynced, error, syncNow: pullAndMerge }), [status, lastSynced, error, pullAndMerge])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useSync = () => useContext(Ctx)
