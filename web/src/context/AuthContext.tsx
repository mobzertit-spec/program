import type { User } from '@supabase/supabase-js'
import { isServer } from '@/lib/boot'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authEnabled, authProviders, getSupabase, hasAuthState, redirectUrl, type AuthProviderId } from '@/lib/supabase'

type AuthState = {
  enabled: boolean
  /** sign-in methods this site offers */
  providers: AuthProviderId[]
  loading: boolean
  user: User | null
  signInWithGoogle: () => Promise<string | null>
  sendMagicLink: (email: string) => Promise<string | null>
  signOut: () => Promise<void>
  /** the signed-in user's access token, for database calls made as that user */
  accessToken: () => Promise<string | null>
}

const Ctx = createContext<AuthState | null>(null)

/** Turn technical errors into messages a learner can act on. */
function friendly(message: string) {
  if (/fetch|network|load failed/i.test(message)) return 'Could not reach the sign-in server. Check your internet connection and try again.'
  if (/rate limit|too many/i.test(message)) return 'Too many attempts. Please wait a minute and try again.'
  if (/not authori[sz]ed/i.test(message)) return 'Email sign-in is not open to everyone yet. Please try again later.'
  if (/provider is not enabled|unsupported provider/i.test(message)) return 'This sign-in method is not available yet.'
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
  // the auth library loads at start only for a saved session or a sign-in redirect — new visitors never download it
  const [started, setStarted] = useState(() => !isServer && hasAuthState())
  const [loading, setLoading] = useState(started)

  useEffect(() => {
    const pending = started ? getSupabase() : null
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
  }, [started])

  const signInWithGoogle = useCallback(async () => {
    const pending = getSupabase()
    if (!pending) return 'Sign-in is not configured.'
    const supabase = await pending
    setStarted(true)
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl() } })
    return error ? friendly(error.message) : null
  }, [])

  const sendMagicLink = useCallback(async (email: string) => {
    const pending = getSupabase()
    if (!pending) return 'Sign-in is not configured.'
    try {
      const supabase = await pending
      setStarted(true)
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

  const accessToken = useCallback(async () => {
    const pending = user ? getSupabase() : null
    if (!pending) return null
    const { data } = await (await pending).auth.getSession()
    return data.session?.access_token ?? null
  }, [user])

  const value = useMemo(
    () => ({ enabled: authEnabled, providers: authProviders, loading, user, signInWithGoogle, sendMagicLink, signOut, accessToken }),
    [loading, user, signInWithGoogle, sendMagicLink, signOut, accessToken],
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
