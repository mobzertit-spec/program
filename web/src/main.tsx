// must run before the router reads the URL — keep this the first import
import './legacy-hash'
import './prerender-guard'
import { startTransition, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App, { preloadRoute } from './App.tsx'
import { loadWordBank } from './data/dictionary'
import { isTakeover } from './lib/boot'

// Pages are prerendered at build time. Load this page's code first, then the live app replaces the HTML in one step.
// Over prerendered HTML the render runs as a transition: React works in small slices and the page stays responsive.
const start = () => {
  const root = createRoot(document.getElementById('root')!)
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  )
  if (isTakeover()) startTransition(() => root.render(app))
  else root.render(app)
}
preloadRoute(window.location.pathname).then(start, start)

// Installable app + offline support (production builds only). The app may start after `load` (prerendered pages boot late).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const register = () =>
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }).catch(() => {
      /* offline support is optional */
    })
  if (document.readyState === 'complete') register()
  else window.addEventListener('load', register, { once: true })
}

// fetch the full offline dictionary once the page is idle
const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1200))
idle(() => void loadWordBank())
