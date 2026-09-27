import { useEffect, useSyncExternalStore } from 'react'
import { isWordBankLoaded, loadWordBank, subscribeWordBank, wordBank } from '@/data/dictionary'

/** The CEFR word bank, loaded on demand; re-renders once it has arrived. */
export function useWordBank() {
  const ready = useSyncExternalStore(subscribeWordBank, isWordBankLoaded, isWordBankLoaded)
  useEffect(() => {
    void loadWordBank()
  }, [])
  return { ready, words: wordBank }
}
