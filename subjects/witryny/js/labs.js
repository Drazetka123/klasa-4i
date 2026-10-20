/* Mini-laboratorium HTML / CSS / JavaScript.
 * Edytor i podgląd działają bez bibliotek i bez backendu. Kod użytkownika
 * uruchamiany jest WYŁĄCZNIE w iframe z sandbox="allow-scripts" (opaque origin).
 */
window.LabStudio = (() => {
  'use strict';
  const STORAGE = 'witryny-lab-playground-v2';
  const LABS = [
    {
      id: 'semantyka', group: 'HTML', title: 'Struktura semantyczna', level: 'Podstawy', time: 8,
      summary: 'Zbuduj stronę, w której każdy element ma swoje znaczenie.',
      task: 'Dodaj elementy <header>, <nav>, <main> oraz <footer>. W nagłówku umieść nazwę witryny, a w części main jej główną treść.',
      checks: [{text:'Jest znacznik <header>',field:'html',test:/<header\b/i}, {text:'Jest nawigacja <nav>',field:'html',test:/<nav\b/i}, {text:'Jest główna sekcja <main>',field:'html',test:/<main\b/i}, {text:'Jest stopka <footer>',field:'html',test:/<footer\b/i}],
      html: '<header>\n  <h1>Moja pierwsza witryna</h1>\n</header>\n\n<main>\n  <h2>Witaj!</h2>\n  <p>Uczę się semantycznego HTML.</p>\n</main>',
      css: 'body { font-family: system-ui; padding: 24px; line-height: 1.6; }\nh1 { color: #166c60; }', js: ''
    },
    {
      id: 'formularz', group: 'HTML', title: 'Formularz z walidacją', level: 'Podstawy', time: 9,
      summary: 'Sprawdź walidację email i atrybut required w praktyce.',
      task: 'Dodaj element <form>, pole e-mail z type="email" i required oraz przycisk submit. Przetestuj wysłanie pustego formularza.',
      checks: [{text:'Jest formularz <form>',field:'html',test:/<form\b/i}, {text:'Pole typu email',field:'html',test:/type\s*=\s*["']email["']/i}, {text:'Walidacja required',field:'html',test:/\brequired\b/i}, {text:'Przycisk wyślij',field:'html',test:/type\s*=\s*["']submit["']/i}],
      html: '<h2>Zapis na newsletter</h2>\n<p>Przetestuj formularz:</p>\n<label for="mail">Adres e-mail</label>\n<input id="mail" placeholder="adres@przyklad.pl">\n<button>Wyślij</button>',
      css: 'body { font-family: system-ui; padding: 25px; }\ninput,button { padding: 10px; margin: 8px; border-radius: 8px; }', js: ''
    },
    {
      id: 'boxmodel', group: 'CSS', title: 'Box model w praktyce', level: 'Podstawy', time: 7,
      summary: 'Zobacz różnicę między margin, border i padding.',
      task: 'Nadaj karcie padding, border oraz margin. Zmień wartości, uruchom podgląd i obserwuj odstępy.',
      checks: [{text:'Padding',field:'css',test:/\bpadding\s*:/i}, {text:'Border',field:'css',test:/\bborder\s*:/i}, {text:'Margin',field:'css',test:/\bmargin\s*:/i}],
      html: '<div class="karta"><h2>Model pudełkowy</h2><p>Każdy element ma cztery warstwy.</p></div>',
      css: 'body { font-family: system-ui; background: #e8f4f1; }\n.karta { background: white; border-radius: 14px; color: #163e40; }', js: ''
    },
    {
      id: 'flexbox', group: 'CSS', title: 'Elastyczne menu z Flexbox', level: 'Średni', time: 8,
      summary: 'Ułóż elementy w wierszu i kontroluj odstępy.',
      task: 'Użyj display: flex, gap i justify-content, aby trzy odnośniki rozłożyły się wygodnie w poziomie.',
      checks: [{text:'Włączony Flexbox',field:'css',test:/display\s*:\s*flex/i}, {text:'Odstęp gap',field:'css',test:/\bgap\s*:/i}, {text:'Wyrównanie justify-content',field:'css',test:/justify-content\s*:/i}],
      html: '<nav class="menu"><a href="#">Start</a><a href="#">O nas</a><a href="#">Kontakt</a></nav>',
      css: 'body { font-family: system-ui; padding: 24px; }\n.menu { background: #e8edff; padding: 20px; border-radius: 10px; }\na { color: #37458b; font-weight: 700; }', js: ''
    },
    {
      id: 'grid', group: 'CSS', title: 'Siatka kart w CSS Grid', level: 'Średni', time: 10,
      summary: 'Zaprojektuj responsywny układ wielu kolumn.',
      task: 'Dodaj display: grid, grid-template-columns i gap. Zmień liczbę kolumn i rozmiar podglądu.',
      checks: [{text:'Włączony CSS Grid',field:'css',test:/display\s*:\s*grid/i}, {text:'Definicja kolumn',field:'css',test:/grid-template-columns\s*:/i}, {text:'Odstępy między kartami',field:'css',test:/\bgap\s*:/i}],
      html: '<section class="siatka"><div>HTML</div><div>CSS</div><div>JavaScript</div><div>UX</div></section>',
      css: 'body { font-family: system-ui; padding: 20px; }\n.siatka div { background: #d9f6ed; padding: 30px 12px; border-radius: 10px; text-align: center; font-weight: 700; }', js: ''
    },
    {
      id: 'rwd', group: 'CSS', title: 'Responsywność z @media', level: 'Średni', time: 10,
      summary: 'Zmień układ zależnie od szerokości ekranu.',
      task: 'Dodaj zapytanie @media z max-width, aby na małym ekranie karty tworzyły jedną kolumnę.',
      checks: [{text:'Zapytanie @media',field:'css',test:/@media\s*\(/i}, {text:'Breakpoint max-width',field:'css',test:/max-width\s*:/i}, {text:'Zmiana układu grid',field:'css',test:/grid-template-columns\s*:/i}],
      html: '<div class="cards"><div>Serwer</div><div>Przeglądarka</div><div>Internet</div></div>',
      css: 'body { font-family: system-ui; padding: 18px; }\n.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }\n.cards div { background: #e5dcff; padding: 18px; border-radius: 9px; }', js: ''
    },
    {
      id: 'dom', group: 'JavaScript', title: 'Kliknięcie i manipulacja DOM', level: 'Średni', time: 10,
      summary: 'Daj przyciskowi funkcję dzięki addEventListener.',
      task: 'Pobierz przycisk przez querySelector albo getElementById i podłącz addEventListener("click", ...), który zmieni tekst na stronie.',
      checks: [{text:'Pobranie elementu DOM',field:'js',test:/querySelector\s*\(|getElementById\s*\(/i}, {text:'Nasłuchiwanie zdarzenia',field:'js',test:/addEventListener\s*\(/i}, {text:'Zmieniona treść',field:'js',test:/textContent|innerText|innerHTML/i}],
      html: '<h2 id="wynik">Kliknij przycisk!</h2><button id="akcja">Działaj</button>',
      css: 'body { font-family: system-ui; padding: 24px; }\nbutton { background: #165d65; color: white; border: 0; border-radius: 10px; padding: 12px 18px; cursor: pointer; }',
      js: 'const przycisk = document.querySelector("#akcja");\n// Dodaj tutaj obsługę kliknięcia.\n'
    },
    {
      id: 'animacje', group: 'CSS', title: 'Animacja i przejścia', level: 'Średni', time: 9,
      summary: 'Ożyw stronę z transition, transform i @keyframes.',
      task: 'Dodaj transition i transform na :hover oraz animację @keyframes. Najedź myszą na kartę.',
      checks: [{text:'Przejście transition',field:'css',test:/transition\s*:/i}, {text:'Transformacja',field:'css',test:/transform\s*:/i}, {text:'Klatki @keyframes',field:'css',test:/@keyframes\s+/i}],
      html: '<div class="kafel">Najedź na mnie ✦</div>',
      css: 'body { font-family: system-ui; padding: 50px; background: #f0f4fc; }\n.kafel { background: #3757a1; color: white; padding: 30px; border-radius: 16px; display: inline-block; font-weight: 700; }', js: ''
    }
  ];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone = lab => ({html: lab.html, css: lab.css, js: lab.js});
  const byId = id => LABS.find(l => l.id === id);
  let data = { drafts: {}, completed: {} };
  let currentTab = 'html';
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE) || '{}');
    if (stored && typeof stored === 'object') {
      if (stored.drafts && typeof stored.drafts === 'object') data.drafts = stored.drafts;
      if (stored.completed && typeof stored.completed === 'object') data.completed = stored.completed;
    }
  } catch { /* Pusta pamięć lub uszkodzony wpis. */ }
  const save = () => { try { localStorage.setItem(STORAGE, JSON.stringify(data)); } catch {} };
  const draftFor = lab => {
    const d = data.drafts[lab.id];
    if (!d || typeof d !== 'object') return clone(lab);
    return Object.fromEntries(['html','css','js'].map(k => [k, typeof d[k] === 'string' ? d[k] : lab[k]]));
  };
  const completedCount = () => LABS.filter(l => data.completed[l.id]).length;
  const getCurrentLab = () => byId((location.hash.split('/')[2] || 'semantyka')) || LABS[0];

  function render(id) {
    const active = byId(id) || LABS[0];
    const d = draftFor(active);
    return `<div class="lab-top">
      <div class="eyebrow">PRAKTYCZNE ĆWICZENIA</div>
      <h1>Laboratorium kodu<span class="lab-dot">.</span></h1>
      <p>Ucz się przez tworzenie. Edytuj HTML, CSS i JS, uruchamiaj podgląd i rozwiązuj krótkie zadania. Zmiany zapisują się automatycznie.</p>
      <div class="lab-stats"><span><b>${LABS.length}</b> projektów</span><span><b>${completedCount()}</b> zaliczonych</span><span>Bez dodatkowych bibliotek</span></div>
    </div>
    <div class="lab-layout">
      <aside class="lab-tasks" aria-label="Wybierz ćwiczenie"><div class="small-label">WYBIERZ PROJEKT</div>
        ${LABS.map((l,i)=>`<button class="lab-task ${active.id===l.id?'active':''}" data-lab-open="${l.id}" aria-current="${active.id===l.id?'true':'false'}"><span class="lab-task-num">${data.completed[l.id]?'✓':String(i+1).padStart(2,'0')}</span><span><b>${esc(l.title)}</b><small>${esc(l.group)} · ${l.time} min</small></span></button>`).join('')}
      </aside>
      <section class="lab-workspace" aria-label="Edytor i podgląd">
        <div class="lab-exercise"><span class="chip active">${esc(active.group)}</span><span class="lab-difficulty">${esc(active.level)} · ${active.time} minut</span><h2>${esc(active.title)}</h2><p>${esc(active.summary)}</p>
          <div class="lab-instruction"><b>Twoje zadanie</b><p>${esc(active.task)}</p></div>
        </div>
        <div class="lab-editor-shell">
          <div class="lab-editor-top"><div class="lab-tabs" role="tablist" aria-label="Język edytora">${[['html','HTML'],['css','CSS'],['js','JavaScript']].map(([k,label])=>`<button class="lab-tab ${k===currentTab?'active':''}" role="tab" aria-selected="${k===currentTab}" data-lab-tab="${k}">${label}</button>`).join('')}</div><span class="lab-autosave">● Autozapis</span></div>
          <label class="sr-only" for="labEditor">Edytuj kod ${currentTab}</label><textarea id="labEditor" class="lab-editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off">${esc(d[currentTab])}</textarea>
          <div class="lab-toolbar"><div class="lab-toolbar-actions"><button class="btn primary" data-lab-run>▶ Uruchom <span class="toolbar-keys">Ctrl ↵</span></button><button class="btn small" data-lab-check>✓ Sprawdź</button><button class="btn small" data-lab-copy>⧉ Kopiuj</button><button class="btn small danger-outline" data-lab-reset>↺ Reset</button></div><span class="tiny muted">Kod uruchamia się w odizolowanej ramce</span></div>
        </div>
        <div class="lab-preview-shell"><div class="lab-preview-head"><b><span class="preview-led"></span> Podgląd strony</b><span id="labPreviewStatus">Gotowy</span></div><iframe id="labFrame" title="Wynik uruchomionego kodu" sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe></div>
        <div class="lab-check-shell"><div class="section-heading" style="margin:0 0 12px"><div><h2>Lista wymagań</h2><p>Sprawdzanie prostych wzorców w kodzie — nie zastępuje testów działania.</p></div></div><div id="labChecklist">${renderChecklist(active,d)}</div><p id="labCheckMessage" class="tiny muted" aria-live="polite">Wprowadź zmiany i naciśnij „Sprawdź”.</p></div>
      </section>
    </div>`;
  }
  function renderChecklist(lab,d) {
    return lab.checks.map(c=>`<div class="lab-check-row ${c.test.test(d[c.field] || '')?'passed':''}"><span>${c.test.test(d[c.field] || '')?'✓':'○'}</span>${esc(c.text)}</div>`).join('');
  }
  function persistEditor() {
    const field = document.getElementById('labEditor');
    if (!field) return;
    const lab = getCurrentLab();
    data.drafts[lab.id] = data.drafts[lab.id] || draftFor(lab);
    data.drafts[lab.id][currentTab] = field.value;
    save();
  }
  function run() {
    persistEditor();
    const frame = document.getElementById('labFrame');
    if (!frame) return;
    const d = draftFor(getCurrentLab());
    // Opaque origin: osadzony kod nie ma dostępu do localStorage ani DOM rodzica.
    // HTML i CSS są celowo renderowane jako kod użytkownika WYŁĄCZNIE w iframe.
    const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>html{color-scheme:light}body{margin:0;padding:10px;color:#202739;background:white;}${d.css.replace(/<\/style/gi, '<\\/style')}</style></head><body>${d.html}<script>${d.js.replace(/<\/script/gi,'<\\/script')}<\/script></body></html>`;
    frame.srcdoc = html;
    const status = document.getElementById('labPreviewStatus');
    if (status) status.textContent = 'Zaktualizowano · ' + new Date().toLocaleTimeString('pl-PL', {hour:'2-digit',minute:'2-digit'});
  }
  function check() {
    persistEditor();
    const lab = getCurrentLab(), d = draftFor(lab);
    const passed = lab.checks.every(c=>c.test.test(d[c.field] || ''));
    if (passed) { data.completed[lab.id] = true; save(); }
    const list = document.getElementById('labChecklist');
    if (list) list.innerHTML = renderChecklist(lab,d);
    const msg = document.getElementById('labCheckMessage');
    if (msg) { msg.textContent = passed ? 'Świetnie! Wszystkie wzorce znalezione. Teraz sprawdź, czy rezultat działa zgodnie z poleceniem.' : 'Nie wszystkie elementy zostały znalezione. Zobacz, czego brakuje i spróbuj ponownie.'; msg.className = 'lab-check-msg ' + (passed?'success':''); }
    if (passed) {
      const task = document.querySelector('.lab-task.active .lab-task-num');
      if (task) task.textContent = '✓';
    }
  }
  function handleClick(button) {
    if (button.dataset.labOpen) { persistEditor(); currentTab='html'; location.hash = '#/lab/' + button.dataset.labOpen; return true; }
    if (button.dataset.labTab) {
      persistEditor(); currentTab=button.dataset.labTab;
      const d = draftFor(getCurrentLab());
      document.getElementById('labEditor').value=d[currentTab];
      document.querySelectorAll('.lab-tab').forEach(tab=>{const active=tab.dataset.labTab===currentTab;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));});
      document.querySelector('label[for="labEditor"]').textContent='Edytuj kod '+currentTab;
      document.getElementById('labEditor').focus();
      return true;
    }
    if (button.hasAttribute('data-lab-run')) {run();return true;}
    if (button.hasAttribute('data-lab-check')) {check();return true;}
    if (button.hasAttribute('data-lab-copy')) {
      persistEditor();
      const text=draftFor(getCurrentLab())[currentTab];
      if(navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(()=>notify('Kod skopiowany ✓')).catch(()=>notify('Nie udało się skopiować'));
      else notify('Zaznacz kod i skopiuj go ręcznie');
      return true;
    }
    if (button.hasAttribute('data-lab-reset')) {
      if (!confirm('Przywrócić przykładowy kod tego ćwiczenia? Twoje zmiany w nim zostaną usunięte.')) return true;
      const lab=getCurrentLab();delete data.drafts[lab.id];delete data.completed[lab.id];save();
      const ed=document.getElementById('labEditor');if(ed)ed.value=lab[currentTab];run();
      const list=document.getElementById('labChecklist');if(list)list.innerHTML=renderChecklist(lab,clone(lab));
      const task=document.querySelector('.lab-task.active .lab-task-num');if(task)task.textContent=String(LABS.indexOf(lab)+1).padStart(2,'0');
      notify('Przywrócono przykład');return true;
    }
    return false;
  }
  function notify(message) { const el=document.getElementById('labCheckMessage');if(el)el.textContent=message; }
  function afterRender() { if(document.getElementById('labFrame')) run(); }
  function handleEditorInput(target) { if(target.id==='labEditor'){persistEditor();return true;}return false; }
  function handleKeydown(event) {
    if (event.target?.id !== 'labEditor') return false;
    if ((event.ctrlKey||event.metaKey)&&event.key==='Enter') {event.preventDefault();run();return true;}
    if (event.key === 'Tab') {
      event.preventDefault();const t=event.target;const start=t.selectionStart,end=t.selectionEnd;
      t.value=t.value.slice(0,start)+'  '+t.value.slice(end);t.selectionStart=t.selectionEnd=start+2;persistEditor();return true;
    }
    return false;
  }
  function exportData() { return JSON.parse(JSON.stringify(data)); }
  function importData(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;
    if (value.drafts && typeof value.drafts === 'object' && !Array.isArray(value.drafts)) {
      data.drafts={};
      for (const lab of LABS) {
        const d=value.drafts[lab.id];
        if (d && typeof d === 'object') data.drafts[lab.id]=Object.fromEntries(['html','css','js'].map(k=>[k, typeof d[k]==='string'?d[k].slice(0,100000):lab[k]]));
      }
    }
    if (value.completed && typeof value.completed === 'object' && !Array.isArray(value.completed)) {
      data.completed=Object.fromEntries(LABS.filter(l=>value.completed[l.id]===true).map(l=>[l.id,true]));
    }
    save();
  }
  function reset() {data={drafts:{},completed:{}};save();}
  return {render, afterRender, handleClick, handleEditorInput, handleKeydown, completedCount, exportData, importData, reset, count:LABS.length};
})();
