/** Download / restore everything the site stores (all "pe:" keys) as a JSON file. */
const PREFIX = 'pe:'

export function exportProgress() {
  const data: Record<string, unknown> = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(PREFIX) && k !== 'pe:online-cache') data[k] = JSON.parse(localStorage.getItem(k) ?? 'null')
    }
  } catch {
    /* storage unavailable */
  }
  const blob = new Blob([JSON.stringify({ app: 'prompt-english', version: 1, exportedAt: new Date().toISOString(), data }, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ce-progress-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importProgress(file: File) {
  const parsed = JSON.parse(await file.text()) as { app?: string; data?: Record<string, unknown> }
  if (parsed.app !== 'prompt-english' || !parsed.data) throw new Error('This is not a CE backup file.')
  for (const [k, v] of Object.entries(parsed.data)) {
    if (k.startsWith(PREFIX)) localStorage.setItem(k, JSON.stringify(v))
  }
}
