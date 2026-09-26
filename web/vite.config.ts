import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
/** Social networks need an absolute image URL: set VITE_SITE_URL (e.g. https://user.github.io/program/). */
function siteUrl(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const base = env.VITE_SITE_URL ? env.VITE_SITE_URL.replace(/\/?$/, '/') : './'
  return { name: 'ce-site-url', transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', base) }
}

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), tailwindcss(), siteUrl(mode)],
  build: {
    // the offline dictionary (~3,000 words) and all lessons ship in the main bundle so translation works instantly
    chunkSizeWarningLimit: 700,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
}))
