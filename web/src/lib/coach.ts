/** Client for the prompt-coach Edge Function (supabase/functions/prompt-coach). */

type Bilingual = { en: string; ar: string }
export type CoachFeedback = {
  score: number
  summary: Bilingual
  strengths: Bilingual[]
  improvements: Bilingual[]
  english_fixes: { wrong: string; right: string; why_en: string; why_ar: string }[]
  improved_prompt: string
}
export type CoachError = 'not_configured' | 'rate_limited' | 'refused' | 'invalid' | 'failed' | 'offline'
export type CoachResult = { ok: true; feedback: CoachFeedback } | { ok: false; error: CoachError }

export const COACH_TASKS = [
  { id: 'email', en: 'A polite email to your manager', ar: 'بريد مهذب إلى مديرك' },
  { id: 'grammar', en: 'Correct my English', ar: 'صحّح إنجليزيتي' },
  { id: 'trip', en: 'Plan a short trip', ar: 'خطّط لرحلة قصيرة' },
  { id: 'code', en: 'Fix a coding error', ar: 'أصلح خطأ برمجيًا' },
  { id: 'summary', en: 'Summarize an article', ar: 'لخّص مقالًا' },
  { id: 'free', en: 'My own task', ar: 'مهمتي الخاصة' },
] as const
export type CoachTaskId = (typeof COACH_TASKS)[number]['id']

export const COACH_MIN = 10
export const COACH_MAX = 1200

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const coachAvailable = !!(url && key)

const KNOWN: CoachError[] = ['not_configured', 'rate_limited', 'refused', 'invalid']

export async function askCoach(task: CoachTaskId, prompt: string): Promise<CoachResult> {
  if (!coachAvailable) return { ok: false, error: 'not_configured' }
  try {
    const res = await fetch(`${url}/functions/v1/prompt-coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key! },
      body: JSON.stringify({ task, prompt }),
    })
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; feedback?: CoachFeedback; error?: string }
    if (res.ok && data.ok && data.feedback) return { ok: true, feedback: data.feedback }
    // the function is not deployed yet → treat like "not switched on"
    if (res.status === 404) return { ok: false, error: 'not_configured' }
    return { ok: false, error: KNOWN.includes(data.error as CoachError) ? (data.error as CoachError) : 'failed' }
  } catch {
    return { ok: false, error: 'offline' }
  }
}
