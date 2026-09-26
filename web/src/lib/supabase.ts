import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase powers sign-in (email magic link + Google) and cloud sync.
 * Without VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY the site still works fully offline —
 * the account page simply explains that sign-in is not configured.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          // PKCE returns ?code=… (not #tokens), which plays well with the hash router
          flowType: 'pkce',
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null

export const authEnabled = supabase !== null

/** Where Google / the magic link send the user back: the site root, without the hash route. */
export const redirectUrl = () => window.location.origin + window.location.pathname
