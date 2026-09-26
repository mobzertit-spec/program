/* CE service worker — makes the site installable and usable offline after the first visit.
   Pages: network first (fresh content), falling back to the cached copy of that page, then to the app shell
   (404.html: an empty shell that renders any route). Assets (hashed JS/CSS, icons, fonts): cache first.
   Supabase / translation APIs are never cached. */
const VERSION = 'ce-v3'
const SHELL = ['./', './404.html', './manifest.webmanifest', './favicon.svg', './icons/icon-192.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

const CACHEABLE = /\.(js|css|png|svg|webmanifest|woff2?)$/

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  const sameOrigin = url.origin === self.location.origin

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(VERSION).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('./404.html'))),
    )
    return
  }

  if (sameOrigin && CACHEABLE.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok || res.type === 'opaque') {
              const copy = res.clone()
              caches.open(VERSION).then((c) => c.put(req, copy))
            }
            return res
          }),
      ),
    )
  }
})
