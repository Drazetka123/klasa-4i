/* Offline cache dla platformy Klasa 4i. Zwiększ CACHE_NAME przy każdym wydaniu. */
const CACHE_NAME = 'klasa4i-v9-sql-fallback-20261105';
const SQL_CDNS = [
  'https://cdn.jsdelivr.net/npm/sql.js@1.15.2/dist/',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.15.2/',
  'https://unpkg.com/sql.js@1.15.2/dist/',
  'https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.14.2/'
];
const CORE = [
  './', './index.html', './css/portal.css', './js/portal.js', './subjects/catalog.js',
  './assets/pdf/notatki-geografia-rolnictwo-i-lesnictwo.pdf',
  './assets/pdf/notatki-systemy-baz-danych.pdf',
  './subjects/witryny/tematy.js',
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
  './subjects/teoria-programowania/tematy/metody-math-array-string/js/lab.js',
  './subjects/teoria-programowania/tematy/metody-math-array-string/css/lab.css',
  './subjects/geografia/index.html', './subjects/geografia/tematy.js',
  './subjects/geografia/css/topics.css', './subjects/geografia/js/topics.js',
  './subjects/geografia/tematy/rolnictwo-na-swiecie/index.html',
  './subjects/geografia/tematy/rolnictwo-na-swiecie/data.js',
  './subjects/systemy-baz-danych/index.html', './subjects/systemy-baz-danych/tematy.js',
  './subjects/systemy-baz-danych/css/topics.css', './subjects/systemy-baz-danych/js/topics.js',
  './subjects/systemy-baz-danych/tematy/zapytania-zagniezdzone-zlaczenia-widoki/index.html',
  './subjects/systemy-baz-danych/tematy/zapytania-zagniezdzone-zlaczenia-widoki/data.js',
  './subjects/systemy-baz-danych/tematy/zapytania-zagniezdzone-zlaczenia-widoki/js/app.js',
  './subjects/systemy-baz-danych/tematy/zapytania-zagniezdzone-zlaczenia-widoki/js/sql-worker.js',
  './subjects/systemy-baz-danych/tematy/zapytania-zagniezdzone-zlaczenia-widoki/css/sbd.css',
  './subjects/systemy-baz-danych/tematy/zapytania-zagniezdzone-zlaczenia-widoki/sql-seed.sql',
  './css/course-template.css', './js/course-template.js',
  './assets/icon.svg', './assets/icon-192.png', './assets/icon-512.png', './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.startsWith('klasa4i-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Local alias lets the service worker cache the SQL.js loader and WebAssembly
  // binary. Several CDN sources are tried if one host is unavailable.
  const sqlMatch = url.pathname.match(/\/vendor\/sqljs\/(sql-wasm\.js|sql-wasm\.wasm)$/);
  if (sqlMatch) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      const failures = [];
      for (const cdn of SQL_CDNS) {
        try {
          const response = await fetch(cdn + sqlMatch[1], { mode: 'cors', cache: 'no-cache' });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          await cache.put(request, response.clone());
          return response;
        } catch (error) {
          failures.push(`${cdn}: ${error && error.message ? error.message : 'błąd pobierania'}`);
        }
      }
      return new Response('Nie udało się pobrać biblioteki SQL.js z dostępnych źródeł. ' + failures.join(' | '), {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })());
    return;
  }

  event.respondWith(
    fetch(request).then(response => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone)).catch(() => {});
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const path = url.pathname;
        const fallback = path.includes('/subjects/systemy-baz-danych/tematy/')
          ? './subjects/systemy-baz-danych/tematy/zapytania-zagniezdzone-zlaczenia-widoki/index.html'
          : path.includes('/subjects/systemy-baz-danych/')
            ? './subjects/systemy-baz-danych/index.html'
            : path.includes('/subjects/geografia/tematy/')
              ? './subjects/geografia/tematy/rolnictwo-na-swiecie/index.html'
              : path.includes('/subjects/geografia/')
                ? './subjects/geografia/index.html'
                : path.includes('/subjects/teoria-programowania/tematy/')
                  ? './subjects/teoria-programowania/tematy/metody-math-array-string/index.html'
                  : path.includes('/subjects/teoria-programowania/')
                    ? './subjects/teoria-programowania/index.html'
                    : path.includes('/subjects/witryny/tematy/')
                      ? './subjects/witryny/tematy/protokoly-http-https-i-aplikacje-internetowe/index.html'
                      : path.includes('/subjects/witryny/')
                        ? './subjects/witryny/index.html'
                        : './index.html';
        return (await caches.match(fallback)) || Response.error();
      }
      return Response.error();
    })
  );
});
