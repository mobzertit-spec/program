import { useEffect, useState } from 'react'

/** localStorage can throw (private mode, blocked storage) — never let it break the page. */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

/** `initial` may be a function that builds the first value itself (e.g. to migrate old data). */
export function usePersistentState<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() =>
    typeof initial === 'function' ? (initial as () => T)() : readStorage(key, initial),
  )
  useEffect(() => writeStorage(key, value), [key, value])
  return [value, setValue] as const
}
