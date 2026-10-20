/* Offline cache dla platformy 4i; increment CACHE_NAME with each release. */
const CACHE_NAME = 'klasa4i-v1-20261020';
const CORE = [
  './', './index.html', './css/portal.css', './js/portal.js', './subjects/catalog.js',
  './subjects/witryny/', './subjects/witryny/index.html',
  './subjects/witryny/css/styles.css', './subjects/witryny/css/extra.css',
  './subjects/witryny/js/data.js', './subjects/witryny/js/labs.js',
  './subjects/witryny/js/app.js', './subjects/witryny/js/pwa.js',
  './assets/icon.svg', './assets/icon-192.png', './assets/icon-512.png', './manifest.webmanifest'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('klasa4i-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(resp => {
    if (resp.ok) { const clone=resp.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(req,clone)).catch(()=>{}); }
    return resp;
  }).catch(async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    if (req.mode === 'navigate') {
      const url = new URL(req.url);
      const fallback = url.pathname.includes('/subjects/witryny/') ? './subjects/witryny/index.html' : './index.html';
      return (await caches.match(fallback)) || Response.error();
    }
    return Response.error();
  }));
});
