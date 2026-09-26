import type { User } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { redirectUrl, supabase } from '@/lib/supabase'

type AuthState = {
  enabled: boolean
  loading: boolean
  user: User | null
  signInWithGoogle: () => Promise<string | null>
  sendMagicLink: (email: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthState | null>(null)

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
  const [loading, setLoading] = useState(!!supabase)

  useEffect(() => {
    if (!supabase) return
    let active = true
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
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return 'Sign-in is not configured.'
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl() } })
    return error?.message ?? null
  }, [])

  const sendMagicLink = useCallback(async (email: string) => {
    if (!supabase) return 'Sign-in is not configured.'
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectUrl() } })
    return error?.message ?? null
  }, [])

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
  }, [])

  const value = useMemo(
    () => ({ enabled: !!supabase, loading, user, signInWithGoogle, sendMagicLink, signOut }),
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
