import { useInView } from 'motion/react'
import { Loader2, Trophy } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { displayName, useAuth } from '@/context/AuthContext'
import { fetchMyBoardProfile, fetchWeeklyBoard, saveMyBoardProfile, type BoardProfile, type BoardRow } from '@/lib/community'
import { supabaseEnabled } from '@/lib/supabase'
import { cn } from '@/lib/utils'

/**
 * This week's top learners. Opt-in only: a learner appears after they sign in and switch it on,
 * and only their display name and XP of the last 7 days are public.
 */
export function Leaderboard() {
  const { enabled: authEnabled, user, accessToken } = useAuth()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '200px' })
  const [rows, setRows] = useState<BoardRow[] | null>(null)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    try {
      setRows(await fetchWeeklyBoard(await accessToken()))
      setError(false)
    } catch {
      setError(true)
    }
  }, [accessToken])

  useEffect(() => {
    if (inView && supabaseEnabled) void load()
  }, [inView, load])

  if (!supabaseEnabled) return null

  return (
    <section ref={ref} className="mt-24" aria-labelledby="board-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="board-title" className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Trophy className="float-icon size-7 text-clay" aria-hidden /> This week’s top learners
          </h2>
          <p lang="ar" data-ar-help className="text-fg-muted">أكثر المتعلّمين نشاطًا هذا الأسبوع</p>
          <p className="mt-1 text-sm text-fg-muted">XP from the last 7 days. Only learners who choose to join are shown.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className={cn('rounded-3xl border border-border-soft bg-surface p-3 shadow-card sm:p-4', (rows === null || rows.length === 0) && 'min-h-64')}>
          {error ? (
            <p className="p-4 text-sm text-fg-muted">The leaderboard could not load. Check your connection.</p>
          ) : rows === null ? (
            <div className="grid h-56 place-items-center text-fg-subtle" aria-busy="true">
              <Loader2 className="size-6 animate-spin" aria-label="Loading leaderboard" />
            </div>
          ) : rows.length === 0 ? (
            <div className="grid h-56 place-items-center p-4 text-center">
              <p className="text-fg-muted">
                No one is on the board yet this week.
                <span className="block font-medium text-fg">Be the first!</span>
              </p>
            </div>
          ) : (
            <ol className="divide-y divide-border-soft">
              {rows.map((r) => (
                <li key={`${r.rank}-${r.display_name}`} className={cn('flex items-center gap-3 rounded-2xl px-3 py-2.5', r.is_me && 'bg-clay-soft')}>
                  <span
                    className={cn(
                      'grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold',
                      r.rank === 1 ? 'bg-clay text-white' : r.rank <= 3 ? 'bg-primary/15 text-primary' : 'bg-bg-alt text-fg-muted',
                    )}
                  >
                    {r.rank}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {r.display_name}
                    {r.is_me && <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-clay">you</span>}
                  </span>
                  <span className="font-semibold tabular-nums">{r.xp.toLocaleString()} XP</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="rounded-3xl border border-border-soft bg-bg-alt p-5">
          {user ? (
            <JoinBoard defaultName={displayName(user).split(' ')[0]} accessToken={accessToken} onSaved={load} />
          ) : (
            <>
              <h3 className="font-semibold">Join the board</h3>
              <p lang="ar" data-ar-help className="text-sm text-fg-muted">انضمّ إلى لوحة المتصدّرين</p>
              <p className="mt-2 text-sm text-fg-muted">
                {authEnabled
                  ? 'Sign in to save your progress in the cloud and appear on the board with a name you choose.'
                  : 'Accounts are coming soon. Until then, your XP is saved on this device — keep learning!'}
              </p>
              {authEnabled && (
                <Link to="/account" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-primary px-5 font-medium text-on-primary hover:bg-primary-hover">
                  Sign in to join
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function JoinBoard({ defaultName, accessToken, onSaved }: { defaultName: string; accessToken: () => Promise<string | null>; onSaved: () => void }) {
  const [profile, setProfile] = useState<BoardProfile | null>(null)
  const [name, setName] = useState(defaultName)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    accessToken()
      .then((t) => (t ? fetchMyBoardProfile(t) : null))
      .then((p) => {
        if (!active || !p) return
        setProfile(p)
        setName(p.display_name)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [accessToken])

  const save = async (show: boolean, e?: FormEvent) => {
    e?.preventDefault()
    const clean = name.trim()
    if (clean.length < 2 || clean.length > 24) return setMessage('Use 2–24 characters for your name.')
    setBusy(true)
    setMessage(null)
    try {
      const token = await accessToken()
      if (!token) throw new Error('signed out')
      const next = { display_name: clean, show_on_leaderboard: show }
      await saveMyBoardProfile(token, next)
      setProfile(next)
      setMessage(show ? 'You are on the board. Your XP updates when your progress syncs.' : 'You left the board.')
      onSaved()
    } catch {
      setMessage('Could not save. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const joined = profile?.show_on_leaderboard ?? false
  return (
    <form onSubmit={(e) => save(true, e)}>
      <h3 className="font-semibold">{joined ? 'You are on the board' : 'Join the board'}</h3>
      <p lang="ar" data-ar-help className="text-sm text-fg-muted">{joined ? 'أنت في لوحة المتصدّرين' : 'انضمّ إلى لوحة المتصدّرين'}</p>
      <label htmlFor="board-name" className="mt-4 block text-sm font-medium">Display name</label>
      <input
        id="board-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={24}
        autoComplete="nickname"
        className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-surface px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
      <p className="mt-1.5 text-xs text-fg-muted">Only this name and your weekly XP are shown. Leave any time.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-5 font-medium text-on-primary hover:bg-primary-hover disabled:opacity-60">
          {busy && <Loader2 className="size-4 animate-spin" />} {joined ? 'Update name' : 'Join'}
        </button>
        {joined && (
          <button type="button" disabled={busy} onClick={() => save(false)} className="min-h-11 cursor-pointer rounded-full px-4 font-medium text-fg-muted hover:bg-surface">
            Leave the board
          </button>
        )}
      </div>
      {message && (
        <p role="status" className="mt-3 text-sm text-fg-muted">
          {message}
        </p>
      )}
    </form>
  )
}
