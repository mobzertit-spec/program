import { useEffect } from 'react'

/** Page titles and descriptions — used for the browser tab, prerendered HTML and search results. */
export const DEFAULT_TITLE = 'CE — Learn Claude, speak better English'
export const DEFAULT_DESCRIPTION =
  'Short lessons on using Claude, in simple English, with instant Arabic translation for every word. Free.'

export type PageMeta = { title?: string; description: string }

export const ROUTE_META: Record<string, PageMeta> = {
  '/': { description: DEFAULT_DESCRIPTION },
  '/path': {
    title: 'Learning path',
    description: 'Five tracks, one step at a time: from your first chat with Claude to prompting, features, English for work and study.',
  },
  '/lessons': {
    title: 'Lessons',
    description: 'Every CE lesson in one place: short, practical lessons on Claude in simple English, each with Arabic help, vocabulary and a quiz.',
  },
  '/vocabulary': {
    title: 'Vocabulary',
    description: 'Save words while you read, review them with spaced repetition and practise your pronunciation.',
  },
  '/practice': {
    title: 'Practice',
    description: 'Quick games to practise prompting: build a prompt in the right order and fix weak prompts.',
  },
  '/lab': {
    title: 'Prompt Lab',
    description: 'Build a clear prompt for Claude step by step: role, context, task, examples and format.',
  },
  '/library': {
    title: 'Library',
    description: 'The best free material about Claude from Anthropic: Claude Academy courses, official videos, docs and Help Center guides.',
  },
  '/account': {
    title: 'Account',
    description: 'Sign in with email or Google to keep your CE progress on every device.',
  },
}

export const pageTitle = (title?: string) => (title ? `${title.replace(/\.$/, '')} · CE` : DEFAULT_TITLE)

/** Keep the browser tab in sync with the page. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = pageTitle(title)
  }, [title])
}
