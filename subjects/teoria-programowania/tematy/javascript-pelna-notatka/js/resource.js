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

  const previewFrame = document.getElementById('notePreviewFrame');
  const openPreviewPdf = document.getElementById('openPreviewPdf');
  const previewDescription = document.getElementById('previewDescription');
  const previewButtons = Array.from(document.querySelectorAll('[data-preview-pdf]'));
  previewButtons.forEach(previewButton => {
    previewButton.addEventListener('click', () => {
      const pdfPath = previewButton.dataset.previewPdf;
      const label = previewButton.dataset.previewLabel || 'wybraną notatkę';
      if (!pdfPath || !previewFrame) return;
      previewFrame.src = `${pdfPath}#view=FitH`;
      previewFrame.title = `Podgląd: ${label}`;
      if (openPreviewPdf) openPreviewPdf.href = pdfPath;
      if (previewDescription) previewDescription.textContent = `Podgląd pokazuje teraz ${label}. Możesz przewijać dokument lub otworzyć go w osobnej karcie.`;
      previewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.previewPdf === pdfPath)));
    });
  });
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('../../../../sw.js').catch(() => {}));
  }
})();
