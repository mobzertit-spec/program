import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase powers sign-in (email magic link + Google) and cloud sync.
 * The library is loaded on demand, and only when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set —
 * without them the site works fully offline and never downloads it.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const authEnabled = !!(url && anonKey)

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

/** Where Google / the magic link send the user back: the site root. */
export const redirectUrl = () => window.location.origin + import.meta.env.BASE_URL
