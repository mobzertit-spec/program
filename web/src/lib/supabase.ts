import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase powers lesson feedback, the weekly leaderboard, sign-in (email magic link + Google) and cloud sync.
 * - VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY: the project (the publishable key is public by design;
 *   Row Level Security protects every table — see supabase/migrations).
 * - VITE_AUTH_PROVIDERS: sign-in methods to offer, e.g. "email,google". Leave empty until Supabase Auth is set up
 *   (site URL, redirect URLs, SMTP, Google) — feedback and the leaderboard work without it.
 * The supabase-js library is only downloaded for sign-in and signed-in learners.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export type AuthProviderId = 'email' | 'google'

export const supabaseEnabled = !!(url && anonKey)
export const authProviders: AuthProviderId[] = supabaseEnabled
  ? ((import.meta.env.VITE_AUTH_PROVIDERS as string | undefined) ?? '')
      .split(',')
      .map((p) => p.trim().toLowerCase())
      .filter((p): p is AuthProviderId => p === 'email' || p === 'google')
  : []
export const authEnabled = authProviders.length > 0

let client: Promise<SupabaseClient> | null = null

export function getSupabase(): Promise<SupabaseClient> | null {
  if (!authEnabled) return null
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(url!, anonKey!, {
      auth: {
        // PKCE returns ?code=… (not #tokens), which is safe with client-side routing
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    }),
  )
  return client
}

/** A saved session or a sign-in redirect in the URL — only then does the page need the auth library at start. */
export function hasAuthState() {
  if (!authEnabled) return false
  if (/[?&](code|error_description)=/.test(window.location.search)) return true
  try {
    return Object.keys(window.localStorage).some((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))
  } catch {
    return false
  }
}

/** Where Google / the magic link send the user back: the site root. */
export const redirectUrl = () => window.location.origin + import.meta.env.BASE_URL

/**
 * Small REST call to the project's database API (PostgREST) — no library needed.
 * Without `token` it runs as an anonymous visitor; with a signed-in user's token, as that user.
 */
export async function rest<T = unknown>(path: string, init: RequestInit & { token?: string | null } = {}): Promise<T> {
  if (!supabaseEnabled) throw new Error('Supabase is not configured')
  const { token, headers, ...rest } = init
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...rest,
    headers: {
      apikey: anonKey!,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}
