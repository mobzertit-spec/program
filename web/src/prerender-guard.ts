/**
 * Prerendered HTML belongs to one URL. Some hosts answer every URL with the home page (SPA fallback), and old
 * `#/` links are rewritten by ./legacy-hash — in both cases the HTML is for another page, so drop it and let the
 * app render the right one. Must run before the app code (imported right after ./legacy-hash).
 */
const page = document.querySelector<HTMLMetaElement>('meta[name="ce-page"]')?.content
const norm = (p: string) => p.replace(/\/+$/, '')
if (page !== undefined && norm(page) !== norm(window.location.pathname)) document.getElementById('root')?.replaceChildren()
document.documentElement.removeAttribute('data-stale')
