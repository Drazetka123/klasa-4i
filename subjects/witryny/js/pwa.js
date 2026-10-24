/* Instalacja PWA jest opcjonalna. Sama aplikacja działa też przy otwarciu pliku HTML. */
(() => {
  'use strict';
  function updateConnection() {
    const el = document.getElementById('networkStatus');
    if (!el) return;
    el.innerHTML = navigator.onLine ? '<i></i> Zapis lokalny' : '<i></i> Tryb offline';
    el.title = 'Postępy są zapisane w tej przeglądarce i nie synchronizują się z innymi urządzeniami.';
  }
  window.addEventListener('online', updateConnection);
  window.addEventListener('offline', updateConnection);
  updateConnection();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('../../../../sw.js').catch(() => {
        // Aplikacja nadal działa; PWA jest dodatkową funkcją.
      });
    });
  }
})();
