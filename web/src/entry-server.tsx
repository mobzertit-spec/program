/**
 * Build-time prerender entry (see scripts/prerender.ts): renders a URL of the app to static HTML.
 * The browser shows that HTML at once; the app then loads and takes over the page.
 */
import { prerender } from 'react-dom/static'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom'
import { basename, Providers, routes } from './App'
import { loadWordBank } from './data/dictionary'
import { lessons, tracks } from './data/lessons'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, pageTitle, ROUTE_META } from './lib/meta'

export type Page = { path: string; title: string; description: string; index: boolean; module?: string }

/** Source module of each page's code, so the prerendered HTML can preload it. */
const MODULES: Record<string, string> = {
  '/': 'src/pages/home/HomeLessons.tsx',
  '/path': 'src/pages/Path.tsx',
  '/lessons': 'src/pages/Lessons.tsx',
  '/vocabulary': 'src/pages/Vocabulary.tsx',
  '/practice': 'src/pages/Practice.tsx',
  '/lab': 'src/pages/PromptLab.tsx',
  '/library': 'src/pages/Library.tsx',
  '/account': 'src/pages/Account.tsx',
}

/** Every URL that gets its own HTML file. Private or progress-based pages (account, certificates) are left out of the sitemap. */
export function pages(): Page[] {
  const statics = Object.entries(ROUTE_META).map(([path, m]) => ({
    path,
    title: m.title ? pageTitle(m.title) : DEFAULT_TITLE,
    description: m.description,
    index: path !== '/account',
    module: MODULES[path],
  }))
  const lessonPages = lessons.map((l) => ({
    path: `/lessons/${l.id}`,
    title: pageTitle(l.title),
    description: `Lesson ${l.number}: ${l.summary.en} Simple English with Arabic help, key words and a short quiz.`,
    index: true,
    module: 'src/pages/LessonPage.tsx',
  }))
  return [...statics, ...lessonPages]
}

/** llms.txt (https://llmstxt.org): a plain map of the site for AI assistants and agents. */
export function llmsTxt(site: string): string {
  const link = (p: string) => site + (p === '/' ? '' : p.slice(1) + '/')
  const lines = [
    '# CE — Learn Claude, speak better English',
    '',
    `> ${DEFAULT_DESCRIPTION} ${lessons.length} lessons in ${tracks.length} tracks. Every English word can be tapped for an Arabic translation.`,
    '',
    'CE is a free learning site for Arabic speakers. Lessons are written in simple (B1) English, link only to official Anthropic sources',
    '(Claude Academy, Claude Docs, the Claude Help Center and Anthropic on YouTube) and end with key vocabulary and a short quiz.',
    '',
    '## Pages',
    '',
    ...Object.entries(ROUTE_META)
      .filter(([p]) => p !== '/account')
      .map(([p, m]) => `- [${m.title ?? 'Home'}](${link(p)}): ${m.description}`),
  ]
  for (const t of tracks) {
    lines.push('', `## ${t.title}`, '', t.description, '')
    for (const l of lessons.filter((x) => x.track === t.id)) lines.push(`- [${l.title}](${link(`/lessons/${l.id}`)}): ${l.summary.en}`)
  }
  return lines.join('\n') + '\n'
}

export async function render(path: string): Promise<string> {
  await loadWordBank() // pages show the word of the day and word lists in their final layout
  const { query, dataRoutes } = createStaticHandler(routes, { basename })
  const url = new URL((basename === '/' ? '' : basename) + path, 'http://localhost')
  const context = await query(new Request(url))
  if (context instanceof Response) throw new Error(`${path} redirects — nothing to prerender`)
  const router = createStaticRouter(dataRoutes, context)
  const { prelude } = await prerender(
    <Providers>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </Providers>,
  )
  return new Response(prelude).text()
}
