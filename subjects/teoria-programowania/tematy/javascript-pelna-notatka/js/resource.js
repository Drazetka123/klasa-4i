(() => {
  'use strict';
  const button = document.getElementById('themeToggle');
  let theme = 'dark';
  try { theme = localStorage.getItem('klasa4i-theme') || localStorage.getItem('klasa4i-teoria-metody-v1') && JSON.parse(localStorage.getItem('klasa4i-teoria-metody-v1')).theme || 'dark'; } catch {}
  theme = theme === 'light' ? 'light' : 'dark';
  const setTheme = () => {
    document.documentElement.dataset.theme = theme;
    if (button) {
      button.textContent = theme === 'dark' ? '☼' : '☾';
      button.setAttribute('aria-label', theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw');
    }
  };
  button?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('klasa4i-theme', theme); } catch {}
    setTheme();
  });
  setTheme();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('../../../../sw.js').catch(() => {}));
  }
})();
