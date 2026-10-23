/* CE service worker — makes the site installable and usable offline after the first visit.
   Pages: network first (fresh content), falling back to the cached copy of that page, then to the app shell
   (404.html: an empty shell that renders any route). Build assets (hashed file names in assets/): cache first —
   their name changes with their content. Everything else (favicon, app icons, manifest, art, screenshots): network
   first with the cached copy as fallback, so a new logo or picture shows up on the next visit.
   Supabase / translation APIs are never cached. */
const VERSION = 'ce-v4'
const SHELL = ['./', './404.html', './manifest.webmanifest?v=2', './favicon.svg?v=2', './icons/icon-192.png?v=2']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

const STATIC = /\.(js|css|png|svg|webp|webmanifest|woff2?)$/
const HASHED = /\/assets\//

const remember = (req, res) => {
  if (res.ok) {
    const copy = res.clone()
    caches.open(VERSION).then((c) => c.put(req, copy))
  }
  return res
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  const sameOrigin = url.origin === self.location.origin

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => remember(req, res))
        .catch(() => caches.match(req).then((hit) => hit || caches.match('./404.html'))),
    )
    return
  }

  if (!sameOrigin || !STATIC.test(url.pathname)) return

  if (HASHED.test(url.pathname)) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => remember(req, res))))
    return
  }

  e.respondWith(
    fetch(req)
      .then((res) => remember(req, res))
      .catch(() => caches.match(req).then((hit) => hit || Response.error())),
  )
})
