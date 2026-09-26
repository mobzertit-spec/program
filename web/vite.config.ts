import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Hosting settings (all optional):
 * - VITE_BASE: the path the site lives under, e.g. "/program/" on GitHub Pages (default "/").
 * - VITE_SITE_URL: the full public URL, used for the share image (e.g. https://user.github.io/program/).
 */
function hosting(base: string, siteUrl: string | undefined): Plugin {
  let outDir = 'dist'
  return {
    name: 'ce-hosting',
    configResolved: (c) => {
      outDir = c.build.outDir
    },
    // social networks need an absolute image URL
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl ? siteUrl.replace(/\/?$/, '/') : base),
    // static hosts (GitHub Pages) serve 404.html for unknown paths → the app router takes over
    closeBundle: () => {
      const index = path.join(outDir, 'index.html')
      if (existsSync(index)) copyFileSync(index, path.join(outDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const base = env.VITE_BASE ? env.VITE_BASE.replace(/\/?$/, '/') : '/'
  return {
    base,
    plugins: [react(), tailwindcss(), hosting(base, env.VITE_SITE_URL)],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
  }
})
