/* Ballistic Visualizer service worker: the app works offline after the first visit. */
const VERSION = 'bv-2026-10-23-3';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './maskable-192.png', './maskable-512.png',
  './apple-touch-icon.png', './favicon-32.png'
];
const FONT_CACHE = 'bv-fonts';
const ICON_CACHE = 'bv-icons';   // weapon, barrel and ammo pictures from tarkov.dev

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION && k !== FONT_CACHE && k !== ICON_CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

// The page asks for the update to take over when the user taps "Reload".
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: serve from cache, refresh in the background.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith((async () => {
      const cache = await caches.open(FONT_CACHE);
      const hit = await cache.match(req);
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) cache.put(req, r.clone()); return r; }).catch(() => null);
      return hit || (await net) || new Response('', { status: 504 });
    })());
    return;
  }
  // Item pictures: once seen, they stay available offline.
  if (url.hostname === 'assets.tarkov.dev') {
    e.respondWith(caches.open(ICON_CACHE).then(async cache => (await cache.match(req)) ||
      fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) cache.put(req, r.clone()); return r; })));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // App page: network first (so updates arrive), cached copy when offline.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const r = await fetch(req);
        const cache = await caches.open(VERSION); cache.put('./index.html', r.clone());
        return r;
      } catch (_) {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Icons, manifest: cache first.
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => {
    if (r.ok) caches.open(VERSION).then(c => c.put(req, r.clone()));
    return r;
  })));
});
