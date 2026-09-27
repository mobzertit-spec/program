/**
 * CE prompt coach — Supabase Edge Function.
 *
 * Secrets / settings (Supabase → Edge Functions → Secrets):
 * - ANTHROPIC_API_KEY   required; the coach answers 503 "not_configured" until it is set
 * - COACH_MODEL         optional, default "claude-opus-5" (e.g. "claude-haiku-4-5" costs about 5× less)
 * - COACH_IP_LIMIT      optional, requests per visitor per day (default 15)
 * - COACH_DAILY_LIMIT   optional, requests for the whole site per day (default 200) — caps the bill
 * - COACH_ORIGINS       optional, comma-separated site origins allowed to call the coach
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase automatically.
 */
import Anthropic from 'npm:@anthropic-ai/sdk@0.128.0'
import { handle, FEEDBACK_SCHEMA, type AskResult } from './coach.ts'

const env = (k: string) => Deno.env.get(k) ?? ''
const apiKey = env('ANTHROPIC_API_KEY')
const model = env('COACH_MODEL') || 'claude-opus-5'
const perVisitor = Number(env('COACH_IP_LIMIT')) || 15
const perDay = Number(env('COACH_DAILY_LIMIT')) || 200
const origins = (env('COACH_ORIGINS') || 'https://mobzertit-spec.github.io,http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

const client = apiKey ? new Anthropic({ apiKey, maxRetries: 1, timeout: 60_000 }) : null
// Haiku 4.5 takes neither the effort setting nor server-side fallbacks
const haiku = model.startsWith('claude-haiku')

async function ask(system: string, user: string): Promise<AskResult> {
  try {
    const response = await client!.beta.messages.create({
      model,
      max_tokens: 4000,
      system,
      messages: [{ role: 'user', content: user }],
      // a short review task: low effort keeps it fast and cheap; the JSON schema fixes the answer's shape
      output_config: { ...(haiku ? {} : { effort: 'low' as const }), format: { type: 'json_schema', schema: FEEDBACK_SCHEMA } },
      // if a safety classifier declines, Anthropic re-runs the request on its recommended fallback model
      ...(haiku ? {} : { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const }),
    })
    if (response.stop_reason === 'refusal') return { status: 'refused' }
    if (response.stop_reason === 'max_tokens') return { status: 'error' }
    const text = response.content.find((b) => b.type === 'text')
    return text && text.type === 'text' ? { status: 'ok', data: JSON.parse(text.text) } : { status: 'error' }
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) console.error('coach: rate limited by the Claude API')
    else if (error instanceof Anthropic.APIError) console.error(`coach: Claude API error ${error.status}`, error.message)
    else console.error('coach: unexpected error', error)
    return { status: 'error' }
  }
}

/** Daily counters live in the database (see supabase/migrations/004_prompt_coach.sql). */
async function hit(key: string): Promise<boolean> {
  const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY')
  const res = await fetch(`${env('SUPABASE_URL')}/rest/v1/rpc/coach_hit`, {
    method: 'POST',
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_key: key, p_per_key: perVisitor, p_global: perDay }),
  })
  if (!res.ok) throw new Error(`usage counter failed (${res.status})`)
  return (await res.json()) === true
}

Deno.serve((req) =>
  handle(req, {
    configured: !!client,
    ask,
    hit,
    origins,
    salt: env('COACH_SALT') || env('SUPABASE_SERVICE_ROLE_KEY'),
  }),
)
