import type { User } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authEnabled, getSupabase, redirectUrl } from '@/lib/supabase'

type AuthState = {
  enabled: boolean
  loading: boolean
  user: User | null
  signInWithGoogle: () => Promise<string | null>
  sendMagicLink: (email: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthState | null>(null)

/** Turn technical errors into messages a learner can act on. */
function friendly(message: string) {
  if (/fetch|network|load failed/i.test(message)) return 'Could not reach the sign-in server. Check your internet connection and try again.'
  if (/rate limit|too many/i.test(message)) return 'Too many attempts. Please wait a minute and try again.'
  return message
}

/** Remove ?code=… / ?error=… left by the OAuth / magic-link redirect, keeping the hash route. */
function cleanAuthParams() {
  const url = new URL(window.location.href)
  let changed = false
  for (const k of ['code', 'error', 'error_code', 'error_description']) {
    if (url.searchParams.has(k)) {
      url.searchParams.delete(k)
      changed = true
    }
  }
  if (changed) window.history.replaceState(null, '', url.toString())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(authEnabled)

  useEffect(() => {
    const pending = getSupabase()
    if (!pending) return
    let active = true
    let unsubscribe = () => {}
    pending.then((supabase) => {
      if (!active) return
      supabase.auth.getSession().then(({ data }) => {
        if (!active) return
        setUser(data.session?.user ?? null)
        setLoading(false)
        cleanAuthParams()
      })
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        cleanAuthParams()
      })
      unsubscribe = () => data.subscription.unsubscribe()
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const pending = getSupabase()
    if (!pending) return 'Sign-in is not configured.'
    const supabase = await pending
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl() } })
    return error ? friendly(error.message) : null
  }, [])

  const sendMagicLink = useCallback(async (email: string) => {
    const pending = getSupabase()
    if (!pending) return 'Sign-in is not configured.'
    try {
      const supabase = await pending
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectUrl() } })
      return error ? friendly(error.message) : null
    } catch (e) {
      return friendly((e as Error).message)
    }
  }, [])

  const signOut = useCallback(async () => {
    const pending = getSupabase()
    if (pending) await (await pending).auth.signOut()
  }, [])

  const value = useMemo(
    () => ({ enabled: authEnabled, loading, user, signInWithGoogle, sendMagicLink, signOut }),
    [loading, user, signInWithGoogle, sendMagicLink, signOut],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export function displayName(user: User) {
  const meta = user.user_metadata as { full_name?: string; name?: string; avatar_url?: string }
  return meta.full_name || meta.name || user.email?.split('@')[0] || 'Learner'
}

export function avatarUrl(user: User) {
  return (user.user_metadata as { avatar_url?: string }).avatar_url
}
