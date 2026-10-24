/** Katalog tematów: interfejs. Treść nowych tematów zmieniaj w ../tematy.js. */
(() => {
  'use strict';
  const topics = Array.isArray(window.CLASS4I_WITRYNY_TOPICS) ? window.CLASS4I_WITRYNY_TOPICS : [];
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const getState = key => { try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { return {}; } };
  const completedCount = topic => {
    const completed = getState(topic.storageKey).completed || {};
    return Math.min(Number(topic.lessons) || 0, Object.values(completed).filter(Boolean).length);
  };
  const progress = topic => Number(topic.lessons) ? Math.round(completedCount(topic) / Number(topic.lessons) * 100) : 0;
  const safeUrl = href => typeof href === 'string' && /^tematy\/[a-z0-9-]+\/index\.html$/.test(href) ? href : '#tematy';
  const plural = (n, a, b, c) => n === 1 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? b : c;

  const card = (topic, index) => {
    const done = completedCount(topic), pct = progress(topic), lessons = Number(topic.lessons) || 0;
    const tags = Array.isArray(topic.tags) ? topic.tags : [];
    return `<a class="topic-card" href="${safeUrl(topic.href)}" aria-label="Otwórz temat: ${esc(topic.title)}">
      <div class="topic-card-top"><span class="topic-index">${String(index + 1).padStart(2, '0')}</span><span class="topic-label">${esc(topic.subtitle || 'Sprawdzian')}</span><span class="topic-arrow" aria-hidden="true">↗</span></div>
      <div class="topic-category">${esc(topic.category || 'Materiał do nauki')}</div>
      <h3>${esc(topic.title)}</h3><p class="topic-description">${esc(topic.description || '')}</p>
      <div class="topic-tags">${tags.slice(0,4).map(tag => `<span>${esc(tag)}</span>`).join('')}</div>
      <div class="topic-stats"><span>▤ ${lessons} lekcji</span><span>◈ ${Number(topic.flashcards) || 0} fiszek</span><span>◉ ${Number(topic.questions) || 0} pytań</span></div>
      <div class="topic-card-bottom"><div class="topic-progress-label"><span>Twój postęp</span><strong>${pct}%</strong></div><div class="topic-meter" role="progressbar" aria-label="Ukończone lekcje w temacie ${esc(topic.title)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div><div class="topic-card-foot"><span>${done} / ${lessons} lekcji</span><strong>${done > 0 ? 'Kontynuuj naukę' : 'Rozpocznij naukę'} <span aria-hidden="true">→</span></strong></div></div>
    </a>`;
  };
  const placeholder = () => `<div class="topic-placeholder" aria-label="Miejsce na przyszły temat"><span class="placeholder-plus" aria-hidden="true">+</span><span class="placeholder-eyebrow">NASTĘPNY SPRAWDZIAN</span><h3>Tu pojawi się kolejny temat.</h3><p>Gdy dojdzie następny materiał, dodamy go jako nową kartę. Poprzednie tematy zostaną dostępne.</p><div class="placeholder-finish">Kolejne materiały w drodze <span aria-hidden="true">↗</span></div></div>`;
  const render = (query = '') => {
    const q = query.trim().toLocaleLowerCase('pl');
    const found = topics.filter(topic => [topic.title, topic.description, topic.category, ...(topic.tags || [])].join(' ').toLocaleLowerCase('pl').includes(q));
    $('#topicGrid').innerHTML = found.map(t => card(t, topics.indexOf(t))).join('') + (!q ? placeholder() : '');
    $('#topicEmpty').hidden = !q || found.length > 0;
    $('#topicCount').textContent = `${found.length} ${plural(found.length, 'temat', 'tematy', 'tematów')}`;
    $('#topicTotal').textContent = String(topics.length).padStart(2, '0');
    $('#navTopicCount').textContent = topics.length;
    $('#lessonTotal').textContent = topics.reduce((acc, t) => acc + (Number(t.lessons) || 0), 0);
    $('#completedTotal').textContent = topics.reduce((acc, t) => acc + completedCount(t), 0);
  };
  let theme = 'dark';
  try { theme = localStorage.getItem('klasa4i-theme') || getState('witryny-lab-v1').theme || 'dark'; } catch {}
  theme = theme === 'light' ? 'light' : 'dark';
  const setTheme = () => {
    document.documentElement.dataset.theme = theme;
    $('#themeToggle').textContent = theme === 'dark' ? '☼' : '☾';
    $('#themeToggle').setAttribute('aria-label', theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw');
  };
  $('#themeToggle').addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('klasa4i-theme', theme); } catch {}
    setTheme();
  });
  $('#topicSearch').addEventListener('input', event => render(event.target.value));
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); $('#topicSearch').focus();
    }
  });
  setTheme(); render();
  window.addEventListener('pageshow', () => render($('#topicSearch').value));
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('../../sw.js').catch(() => {}));
  }
})();
