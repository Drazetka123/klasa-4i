(() => {
  'use strict';
  const catalog = Array.isArray(window.CLASS4I_SUBJECTS) ? window.CLASS4I_SUBJECTS : [];
  const $ = selector => document.querySelector(selector);
  const escape = text => String(text ?? '').replace(/[&<>"']/g, symbol => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[symbol]));
  const safeHref = path => typeof path === 'string' && /^subjects\/[a-z0-9-]+\/index\.html$/.test(path) ? path : '#przedmioty';
  const stored = key => {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
    catch { return {}; }
  };
  const topicList = subject => typeof subject.topicCatalog === 'string' &&
    Array.isArray(window[subject.topicCatalog]) ? window[subject.topicCatalog] : null;
  const lessonCount = subject => {
    const topics = topicList(subject);
    return topics ? topics.reduce((sum, topic) => sum + (Number(topic.lessons) || 0), 0) : (Number(subject.lessons) || 0);
  };
  const getDone = subject => {
    const topics = topicList(subject);
    if (topics) return topics.reduce((sum, topic) => sum + getDone({storageKey: topic.storageKey, lessons: topic.lessons}), 0);
    if (!subject.storageKey) return 0;
    const state = stored(subject.storageKey);
    const completed = state && state.completed && typeof state.completed === 'object' ? state.completed : {};
    return Math.min(Math.max(0, Number(subject.lessons) || 0), Object.values(completed).filter(Boolean).length);
  };
  const percentage = subject => lessonCount(subject) ? Math.round(getDone(subject) / lessonCount(subject) * 100) : 0;
  const plural = (number, one, few, many) => {
    const n = Math.abs(number);
    return n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many;
  };
  const card = subject => {
    const progress = percentage(subject);
    const done = getDone(subject);
    const tags = Array.isArray(subject.tags) ? subject.tags : [];
    return `<a class="subject-card subject-${escape(subject.color || 'mint')}" href="${safeHref(subject.href)}" aria-label="Otwórz przedmiot: ${escape(subject.name)}">
      <div class="subject-head"><div class="subject-icon" aria-hidden="true">${escape(subject.icon || '✦')}</div><span class="subject-type">${escape(subject.category || 'Przedmiot')}</span><span class="subject-arrow" aria-hidden="true">↗</span></div>
      <h3>${escape(subject.name)}</h3><p class="subject-desc">${escape(subject.description)}</p>
      <div class="subject-tags">${tags.slice(0,5).map(tag=>`<span>${escape(tag)}</span>`).join('')}</div>
      <div class="subject-break"></div>
      <div class="subject-progress"><span>Twój postęp</span><strong>${progress}%</strong></div>
      <div class="subject-meter" role="progressbar" aria-label="Postęp w przedmiocie ${escape(subject.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span style="width:${progress}%"></span></div>
      <div class="subject-foot"><span>${done} / ${lessonCount(subject)} ukończonych lekcji</span><span class="subject-open">Wybierz temat <span aria-hidden="true">→</span></span></div>
    </a>`;
  };
  const comingSoon = () => `<div class="coming-card"><div class="coming-plus" aria-hidden="true">＋</div><div class="coming-pill">BIBLIOTEKA 4I</div><h3>Miejsce na kolejny przedmiot</h3><p>Ta platforma będzie rosła razem z Wami. Następne materiały pojawią się tutaj.</p><div class="coming-bottom"><span class="coming-dashes" aria-hidden="true">— — —</span> Gotowa na rozbudowę</div></div>`;
  function render(search = '') {
    const query = search.trim().toLocaleLowerCase('pl');
    const matches = catalog.filter(subject => [subject.name, subject.category, subject.description, ...(subject.tags || [])].join(' ').toLocaleLowerCase('pl').includes(query));
    $('#subjectsGrid').innerHTML = matches.map(card).join('') + (!query ? comingSoon() : '');
    $('#searchEmpty').hidden = matches.length > 0 || !query;
    $('#subjectCount').textContent = `${matches.length} ${plural(matches.length,'przedmiot','przedmioty','przedmiotów')}`;
    $('#navCount').textContent = catalog.length;
    $('#totalSubjects').textContent = String(catalog.length).padStart(2,'0');
    $('#totalLessons').textContent = catalog.reduce((sum,subject)=>sum+lessonCount(subject),0);
    $('#totalCompleted').textContent = catalog.reduce((sum,subject)=>sum+getDone(subject),0);
  }
  let theme = 'dark';
  try { const preference=localStorage.getItem('klasa4i-theme') || stored('witryny-lab-v1').theme; theme = preference === 'light' ? 'light' : 'dark'; } catch {}
  const applyTheme = () => { document.documentElement.dataset.theme = theme; $('#themeToggle').textContent = theme === 'dark' ? '☼' : '☾'; $('#themeToggle').setAttribute('aria-label', theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'); };
  $('#themeToggle').addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('klasa4i-theme', theme); } catch {}
    applyTheme();
  });
  $('#subjectSearch').addEventListener('input', event => render(event.target.value));
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#subjectSearch').focus(); }
  });
  applyTheme();
  render();
  // Postęp może zmienić się po powrocie z przedmiotu; odświeżamy po przywróceniu karty.
  window.addEventListener('pageshow', () => render($('#subjectSearch').value));
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
})();
