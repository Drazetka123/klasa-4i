/* Offline cache dla platformy 4i; increment CACHE_NAME with each release. */
const CACHE_NAME = 'klasa4i-v4-teoria-programowania-20261024';
const CORE = [
  './', './index.html', './css/portal.css', './js/portal.js', './subjects/catalog.js', './subjects/witryny/tematy.js',
  './subjects/witryny/', './subjects/witryny/index.html',
  './subjects/witryny/tematy.js', './subjects/witryny/js/topics.js', './subjects/witryny/css/topics.css',
  './subjects/witryny/tematy/protokoly-http-https-i-aplikacje-internetowe/',
  './subjects/witryny/tematy/protokoly-http-https-i-aplikacje-internetowe/index.html',
  './subjects/witryny/css/styles.css', './subjects/witryny/css/extra.css',
  './subjects/witryny/js/data.js', './subjects/witryny/js/labs.js',
  './subjects/witryny/js/app.js', './subjects/witryny/js/pwa.js',
  './subjects/teoria-programowania/index.html', './subjects/teoria-programowania/tematy.js',
  './subjects/teoria-programowania/css/topics.css', './subjects/teoria-programowania/js/topics.js',
  './subjects/teoria-programowania/tematy/metody-math-array-string/index.html',
  './subjects/teoria-programowania/tematy/metody-math-array-string/css/methods.css',
  './subjects/teoria-programowania/tematy/metody-math-array-string/js/methods.js',
  './subjects/teoria-programowania/tematy/metody-math-array-string/js/app.js',
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
      const fallback = url.pathname.includes('/subjects/teoria-programowania/tematy/')
        ? './subjects/teoria-programowania/tematy/metody-math-array-string/index.html'
        : url.pathname.includes('/subjects/teoria-programowania/') ? './subjects/teoria-programowania/index.html'
        : url.pathname.includes('/subjects/witryny/tematy/')
        ? './subjects/witryny/tematy/protokoly-http-https-i-aplikacje-internetowe/index.html'
        : url.pathname.includes('/subjects/witryny/') ? './subjects/witryny/index.html' : './index.html';
      return (await caches.match(fallback)) || Response.error();
    }
    return Response.error();
  }));
});
