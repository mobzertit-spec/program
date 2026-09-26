let cachedVoice: SpeechSynthesisVoice | null | undefined

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice
  const voices = window.speechSynthesis?.getVoices() ?? []
  if (!voices.length) return null
  cachedVoice =
    voices.find((v) => /en[-_]US/i.test(v.lang) && /samantha|google|natural/i.test(v.name)) ??
    voices.find((v) => /en[-_](US|GB)/i.test(v.lang)) ??
    voices.find((v) => v.lang.startsWith('en')) ??
    null
  return cachedVoice
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text: string, rate = 0.92) {
  if (!canSpeak()) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rate
  const voice = pickVoice()
  if (voice) u.voice = voice
  window.speechSynthesis.speak(u)
}
