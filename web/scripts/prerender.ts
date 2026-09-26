/**
 * Build step 2 (after `vite build`): prerender every public page to static HTML.
 *
 * Why: visitors and search engines get real content at once, before any JavaScript runs.
 * Output: dist/<page>/index.html for each page, plus robots.txt, sitemap.xml and llms.txt.
 * dist/404.html stays the plain app shell, so unknown URLs still work (the app takes over).
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createServer, loadEnv } from 'vite'

type Page = { path: string; title: string; description: string; index: boolean; module?: string }
type ServerEntry = {
  pages: () => Page[]
  render: (path: string) => Promise<string>
  llmsTxt: (site: string) => string
}
type Manifest = Record<string, { file: string; imports?: string[]; isEntry?: boolean }>

const root = path.resolve(import.meta.dirname, '..')
const dist = path.resolve(root, process.argv[2] ?? 'dist') // optional: another outDir
const env = loadEnv('production', root, 'VITE_')
const site = env.VITE_SITE_URL ? env.VITE_SITE_URL.replace(/\/?$/, '/') : ''
const base = env.VITE_BASE ? env.VITE_BASE.replace(/\/?$/, '/') : '/'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const urlFor = (p: string) => site + (p === '/' ? '' : p.slice(1) + '/')

// 404.html is the untouched app shell written by `vite build` (see vite.config.ts) — the template for every page
const template = readFileSync(path.join(dist, '404.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) throw new Error('dist/404.html has no empty #root — run `vite build` first')

// JS chunks each page needs right away (from the Vite manifest), so the browser fetches them in parallel with the HTML
const manifestFile = path.join(dist, '.vite', 'manifest.json')
const manifest: Manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, 'utf8')) : {}
function chunksFor(src: string | undefined, seen = new Set<string>()): string[] {
  const entry = src ? manifest[src] : undefined
  if (!entry || seen.has(src!)) return []
  seen.add(src!)
  return [entry.file, ...(entry.imports ?? []).filter((i) => !manifest[i]?.isEntry).flatMap((i) => chunksFor(i, seen))]
}

// the main text font: preloaded so it is ready before the app takes over (stable text size, no second LCP paint)
const fontFile = Object.values(manifest)
  .flatMap((e) => (e as { assets?: string[] }).assets ?? [])
  .find((a) => /inter-latin-wght-normal.*\.woff2$/.test(a))

function headFor(page: Page) {
  const tags: string[] = []
  if (fontFile) tags.push(`<link rel="preload" href="${base}${fontFile}" as="font" type="font/woff2" crossorigin />`)
  // which URL this HTML is for; hide it at once if the host served it for another URL (see src/prerender-guard.ts)
  const own = base + (page.path === '/' ? '' : page.path.slice(1))
  tags.push(
    `<meta name="ce-page" content="${own}" />`,
    `<script>if (location.pathname.replace(/\\/+$/, '') !== ${JSON.stringify(own.replace(/\/+$/, ''))}) document.documentElement.setAttribute('data-stale', '')</script>`,
  )
  if (site) tags.push(`<link rel="canonical" href="${urlFor(page.path)}" />`, `<meta property="og:url" content="${urlFor(page.path)}" />`)
  if (!page.index) tags.push('<meta name="robots" content="noindex" />')
  return tags
}

/**
 * Prerendered pages are complete without JavaScript, so the app starts right after the first paint instead of
 * competing with it. The page's own chunks are fetched in parallel with the main bundle.
 */
function deferBoot(html: string, page: Page) {
  const tag = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)
  if (!tag) throw new Error('main script tag not found in the HTML template')
  // Vite's own preload tags for the main bundle move into the boot script as well
  const vitePreloads = [...html.matchAll(/\s*<link rel="modulepreload" crossorigin href="([^"]+)">/g)]
  for (const m of vitePreloads) html = html.replace(m[0], '')
  const chunks = [...new Set([...vitePreloads.map((m) => m[1]), ...chunksFor(page.module).map((f) => base + f)])]
  const boot = `<script type="module">
      // show the prerendered page first, then start the app
      requestAnimationFrame(() => setTimeout(() => {
        for (const href of ${JSON.stringify(chunks)}) document.head.append(Object.assign(document.createElement('link'), { rel: 'modulepreload', href }))
        import('${tag[1]}')
      }))
    </script>`
  return html.replace(tag[0], boot)
}

function fill(html: string, page: Page, app: string) {
  const out = html
    .replace(/<title>.*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(page.description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(page.title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(page.description)}`)
    .replace('</head>', `    ${headFor(page).join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
  return deferBoot(out, page)
}

const vite = await createServer({
  root,
  mode: 'production',
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
})
try {
  const entry = (await vite.ssrLoadModule('/src/entry-server.tsx')) as ServerEntry
  const pages = entry.pages()
  for (const page of pages) {
    const app = await entry.render(page.path)
    if (app.length < 500) throw new Error(`${page.path}: prerendered HTML looks empty`)
    const dir = path.join(dist, page.path)
    mkdirSync(dir, { recursive: true })
    writeFileSync(path.join(dir, 'index.html'), fill(template, page, app))
  }

  // the app shell for unknown URLs gets the font preload too

  writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}sitemap.xml\n` : ''}`)
  if (site) {
    const today = new Date().toISOString().slice(0, 10)
    const urls = pages
      .filter((p) => p.index)
      .map((p) => `  <url><loc>${urlFor(p.path)}</loc><lastmod>${today}</lastmod></url>`)
      .join('\n')
    writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
  }
  writeFileSync(path.join(dist, 'llms.txt'), entry.llmsTxt(site || base))
  rmSync(path.join(dist, '.vite'), { recursive: true, force: true })
  console.log(`prerendered ${pages.length} pages${site ? ` for ${site}` : ''}`)
} finally {
  await vite.close()
}
