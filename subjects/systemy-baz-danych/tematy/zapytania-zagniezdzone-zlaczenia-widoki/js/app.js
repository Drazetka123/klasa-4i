
(() => {
  'use strict';
  const course = window.CLASS4I_COURSE;
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    const workerUrl = new URL('../../../../sw.js', document.baseURI).href;
    window.addEventListener('load', () => navigator.serviceWorker.register(workerUrl).catch(() => {}));
  }
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
  if (!course || !Array.isArray(course.lessons)) {
    $('#courseMain').textContent = 'Nie udało się wczytać danych tematu.';
    return;
  }
  const cards = course.flashcards || [];
  const questions = course.questions || [];
  const examples = course.sqlPresets || [];
  const resources = Array.isArray(course.resources) ? course.resources : [];
  const key = course.storageKey || 'klasa4i-sbd-v1';
  const defaults = { completed:{}, notes:{}, quizAnswers:{}, sqlDraft:'', sqlRuns:0 };
  let state = defaults;
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}') || {};
    state = {...defaults, ...parsed,
      completed: parsed.completed || {},
      notes: parsed.notes || {},
      quizAnswers: parsed.quizAnswers || {}
    };
  } catch {}
  const save = () => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} };
  let flashIndex = 0, flipped = false, quizIndex = 0;
  let sqlWorker = null, workerReady = null, workerRequestId = 0;
  const workerPending = new Map();
  const completedCount = () => course.lessons.filter(lesson => state.completed[lesson.id]).length;
  const progress = () => course.lessons.length ? Math.round(completedCount() / course.lessons.length * 100) : 0;
  const route = () => {
    const parts = (location.hash || '#/start').slice(2).split('/');
    return {page:parts[0] || 'start', id:parts[1] || ''};
  };
  const heading = (eyebrow,title,description) => `<div class="heading"><small>${esc(eyebrow)}</small><h1>${esc(title)}</h1><p>${esc(description || '')}</p></div>`;
  const lessonLink = (lesson,index) => `<a href="#/lesson/${encodeURIComponent(lesson.id)}" class="lesson-row"><span class="lesson-index">${String(index+1).padStart(2,'0')}</span><span><strong>${esc(lesson.title)}</strong><small>${esc(lesson.summary || '')} · ${Number(lesson.duration)||5} min</small></span><b>${state.completed[lesson.id]?'✓':'→'}</b></a>`;
  const menu = [
    ['start','▦','Pulpit'],['lessons','▤','Lekcje'],['flash','▧','Fiszki'],
    ['quiz','◉','Quiz'],['lab','⌘','Laboratorium SQL'],['progress','↗','Postępy']
  ];

  function resourceSection() {
    if (!resources.length) return '';
    return `<section class="download-section" aria-label="Materiały PDF do pobrania"><div class="section-label">MATERIAŁY DO POBRANIA</div><h2>Wolisz uczyć się z PDF-a?</h2><p class="download-intro">Pobierz oryginalne notatki i korzystaj z nich poza stroną.</p><div class="download-grid">${resources.map(resource => `<article class="download-card"><span class="download-file-icon" aria-hidden="true">PDF</span><span class="download-copy"><strong>${esc(resource.title)}</strong><small>${esc(resource.description || 'Plik PDF')}${resource.size ? ` · ${esc(resource.size)}` : ''}</small></span><span class="download-actions"><a class="download-button" href="${esc(resource.href)}" download="${esc(resource.filename || 'notatki.pdf')}">Pobierz ↓</a><a class="download-preview" href="${esc(resource.href)}" target="_blank" rel="noopener">Podgląd</a></span></article>`).join('')}</div></section>`;
  }

  function home() {
    const next = course.lessons.find(lesson => !state.completed[lesson.id]) || course.lessons[0];
    const done = completedCount();
    return `<div class="sbd-banner">${heading('KLASA 4I · SYSTEMY BAZ DANYCH','Zapytania SQL bez zgadywania','Najpierw zrozum podzapytania, potem porównaj rodzaje JOIN, poznaj widoki i sprawdź wszystko na działającej bazie danych.')}
      <div class="actions"><a class="cta" href="${next ? `#/lesson/${encodeURIComponent(next.id)}` : '#/lessons'}">${done?'Kontynuuj naukę':'Rozpocznij naukę'} ↗</a><a class="secondary" href="#/lab">Otwórz SQL LAB ⌘</a></div></div>
      <div class="numbers"><div><strong>${course.lessons.length}</strong><span>Lekcje</span></div><div><strong>${cards.length}</strong><span>Fiszki</span></div><div><strong>${questions.length}</strong><span>Pytania w quizie</span></div><div><strong>${progress()}%</strong><span>Postęp</span></div></div>
      ${resourceSection()}
      <div class="section-label">PLAN NAUKI</div><h2>Najważniejsze zagadnienia</h2>
      <div class="listing">${course.lessons.slice(0,5).map(lessonLink).join('')}</div>
      <div class="sbd-shortcuts">
        <a class="sbd-shortcut" href="#/lessons"><span>01 / TEORIA</span><strong>Przejdź przez lekcje</strong><small>Podzapytania, JOIN i widoki krok po kroku.</small></a>
        <a class="sbd-shortcut" href="#/quiz"><span>02 / POWTÓRKA</span><strong>Sprawdź, co pamiętasz</strong><small>${questions.length} pytań z wyjaśnieniami odpowiedzi.</small></a>
        <a class="sbd-shortcut" href="#/lab"><span>03 / PRAKTYKA</span><strong>Uruchom kwerendy SQL</strong><small>Pracuj na przykładowych tabelach z gotowymi zadaniami.</small></a>
      </div>`;
  }

  function allLessons() {
    return `${heading('MATERIAŁ DO SPRAWDZIANU','Wszystkie lekcje','Zacznij od podzapytań, przejdź do JOIN, a na końcu powtórz widoki.')}
      ${course.modules.map(module => `<div class="section-label">${esc(module.title)}</div><div class="listing">${course.lessons.filter(lesson=>lesson.module===module.id).map(lesson=>lessonLink(lesson,course.lessons.indexOf(lesson))).join('')}</div>`).join('')}`;
  }

  function article(id) {
    const lesson = course.lessons.find(item => item.id === decodeURIComponent(id));
    if (!lesson) return `${heading('NIE ZNALEZIONO','Nie ma takiej lekcji','Wróć do listy tematów.')}<a class="cta" href="#/lessons">Wróć do lekcji</a>`;
    const index = course.lessons.indexOf(lesson);
    const content = (lesson.sections || []).map(section => `<section><h2>${esc(section.heading)}</h2><p>${esc(section.text)}</p>${section.code ? `<pre class="sbd-code"><code>${esc(section.code)}</code></pre>` : ''}</section>`).join('');
    return `<a href="#/lessons" class="back-inline">← Wszystkie lekcje</a><article class="article sbd-article">${heading(`LEKCJA ${index+1} / ${course.lessons.length} · ${Number(lesson.duration)||5} MIN`,lesson.title,lesson.summary)}${content}
      <div class="notes"><label for="lessonNote">Twoje notatki</label><textarea id="lessonNote" data-note="${esc(lesson.id)}" rows="4" placeholder="Zapisz własne przykłady albo rzeczy do powtórki...">${esc(state.notes[lesson.id] || '')}</textarea><small>Notatki zapisują się automatycznie w tej przeglądarce.</small></div>
      <div class="actions"><button class="cta" type="button" data-complete="${esc(lesson.id)}">${state.completed[lesson.id]?'✓ Lekcja ukończona':'✓ Oznacz jako ukończoną'}</button>${course.lessons[index+1]?`<a class="secondary" href="#/lesson/${encodeURIComponent(course.lessons[index+1].id)}">Następna lekcja →</a>`:''}</div>
    </article>`;
  }

  function flashView() {
    if (!cards.length) return heading('POWTÓRKI','Fiszki','Brak fiszek w tym temacie.');
    flashIndex = (flashIndex + cards.length) % cards.length;
    const card = cards[flashIndex];
    return `${heading('SZYBKIE POWTÓRKI','Fiszki','Przeczytaj pytanie, spróbuj odpowiedzieć z pamięci, a potem odsłoń odpowiedź.')}
      <div class="flash-info">Karta ${flashIndex+1} z ${cards.length}</div>
      <button class="flash-card" type="button" data-flip="1"><small>${flipped?'ODPOWIEDŹ':'PYTANIE'}</small><strong>${esc(flipped?card.answer:card.question)}</strong><span>Kliknij, aby ${flipped?'wrócić do pytania':'odkryć odpowiedź'}</span></button>
      <div class="flash-controls"><button class="secondary" type="button" data-prev-card="1">← Poprzednia</button><button class="cta" type="button" data-next-card="1">Następna →</button></div>`;
  }

  function quizView() {
    if (!questions.length) return heading('SPRAWDŹ SIĘ','Quiz','Brak pytań w tym temacie.');
    quizIndex = Math.max(0,Math.min(questions.length-1,quizIndex));
    const q = questions[quizIndex];
    const selected = state.quizAnswers[quizIndex];
    const answered = Object.keys(state.quizAnswers).filter(i=>Number(i)<questions.length).length;
    const correct = Object.entries(state.quizAnswers).filter(([i,value])=>questions[Number(i)] && Number(value)===questions[Number(i)].correct).length;
    return `${heading('TEST WIEDZY','Quiz z SBD','Zaznacz odpowiedź. Po wyborze zobaczysz poprawną odpowiedź i krótkie wyjaśnienie.')}
      <div class="question"><small>PYTANIE ${quizIndex+1} / ${questions.length} · ODPOWIEDZIANO ${answered}</small><h2>${esc(q.question)}</h2>
      ${(q.answers||[]).map((answer,i)=>`<button class="answer ${selected!==undefined?(i===q.correct?'correct':i===selected?'wrong':''):''}" type="button" data-answer="${i}" ${selected!==undefined?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${esc(answer)}</button>`).join('')}
      ${selected!==undefined?`<div class="feedback">${selected===q.correct?'✓ Dobrze!':'To nie ta odpowiedź.'}<p>${esc(q.explanation||'')}</p></div>`:''}
      </div><div class="sbd-quiz-footer"><span class="tip">Twój wynik na teraz: ${correct} / ${answered} poprawnych</span><div class="actions"><button class="secondary" type="button" data-prev-q="1">← Poprzednie</button><button class="cta" type="button" data-next-q="1">Następne →</button><button class="secondary" type="button" data-reset-q="1">Od nowa</button></div></div>`;
  }

  function schemaHTML() {
    return (course.tables||[]).map(table=>`<button class="schema-item" type="button" data-table="${esc(table.name)}">
      <strong>${esc(table.name)} <span>${table.rows} wierszy</span></strong><small>${esc(table.about)}</small>
      <span class="schema-cols">${table.columns.map(col=>`<code>${esc(col)}</code>`).join('')}</span>
    </button>`).join('');
  }

  function labView() {
    const options = (course.sqlPresets||[]).map((preset,index)=>`<option value="${index}">${esc(preset.group)} · ${esc(preset.title)}</option>`).join('');
    const code = state.sqlDraft || examples[0]?.sql || 'SELECT * FROM Customers;';
    return `${heading('PRAKTYKA · SQL PLAYGROUND','Laboratorium SQL','Pisz własne kwerendy i uruchamiaj je na przykładowej bazie danych. Wyniki pojawią się od razu pod edytorem — bez F12.')}
      <div class="sbd-lab-banner"><div><strong>Twoja baza ćwiczeniowa</strong><p>8 tabel, przykładowe rekordy i widoki tworzone podczas pracy. Możesz wykonywać kilka instrukcji po kolei. Baza jest tymczasowa — przycisk resetu przywraca dane początkowe. Własne tabele znikają po odświeżeniu.</p></div><span class="engine-pill" id="sqlEnginePill">Ładowanie SQLite</span></div>
      <div class="sql-lab-layout">
        <section class="sql-panel">
          <div class="sql-panel-head"><div><h3>Edytor kwerend</h3><small>SQL · SQLite w przeglądarce</small></div><span id="sqlRunCount" class="engine-pill">${Number(state.sqlRuns)||0} uruchomień</span></div>
          <div class="sql-options"><label><span class="sr-only">Wybierz gotowy przykład</span><select id="sqlPreset"><option value="">Wybierz gotowy przykład…</option>${options}</select></label><button class="secondary" type="button" id="resetDatabase">Resetuj bazę</button></div>
          <label class="sql-editor-label" for="sqlEditor">TWÓJ KOD SQL</label>
          <div class="sql-editor-wrap"><div class="sql-editor-top"><span>▶ sql-query.sql</span><b>SQL</b></div><textarea id="sqlEditor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off">${esc(code)}</textarea></div>
          <div class="sql-editor-foot"><span>Skrót: Ctrl + Enter uruchamia kwerendę. Możesz wpisać kilka instrukcji.</span><span id="sqlSaveStatus">Zapis lokalny</span></div>
          <div class="sql-actions"><button class="cta" type="button" id="runSql">▶ Uruchom SQL</button><button class="secondary" type="button" id="copySql">Kopiuj kod</button><button class="secondary" type="button" id="downloadSql">Pobierz .sql</button></div>
          <div class="sql-results"><div class="sql-result-head"><span>WYNIK ZAPYTANIA</span><small id="sqlResultMeta">Czeka na uruchomienie</small></div><div class="sql-result-body" id="sqlResult" aria-live="polite"><p class="sql-result-empty">Wybierz gotowy przykład albo wpisz własną kwerendę i kliknij „Uruchom SQL”.</p></div></div>
          <p class="sql-dialect-note"><strong>Ważne o składni:</strong> laboratorium używa SQLite. Większość przykładów z notatek działa bez zmian. SQLite nie obsługuje bezpośrednio <code>CREATE OR REPLACE VIEW</code>, dlatego laboratorium automatycznie zamienia tę instrukcję na <code>DROP VIEW IF EXISTS</code> + <code>CREATE VIEW</code>. Dane są tylko przykładowe i nie trafiają na serwer.</p>
        </section>
        <aside class="sql-panel">
          <div class="sql-panel-head"><div><h3>Struktura bazy</h3><small>Kliknij tabelę, aby podejrzeć rekordy.</small></div></div>
          <div id="schemaList" class="schema-list">${schemaHTML()}</div>
          <div class="sql-help"><strong>Jak korzystać?</strong><p>1. Wybierz tabelę lub gotowe zapytanie.<br>2. Zmień kod albo napisz własny.<br>3. Uruchom kwerendę.<br>4. Sprawdź tabelę wynikową lub komunikat błędu.</p></div>
          <div class="sql-help"><strong>Przydatne wskazówki</strong><p>• Nazwy tabel możesz pisać wielkimi lub małymi literami.<br>• W JOIN warunek połączenia zapisujesz po ON.<br>• Przy braku dopasowania w OUTER JOIN pojawia się NULL.<br>• Po CREATE VIEW użyj SELECT, aby zobaczyć widok.</p></div>
          <div class="sql-help"><strong>Własne dane?</strong><p>Możesz ćwiczyć SELECT, podzapytania, JOIN, CREATE VIEW i DROP VIEW. Zmiany w tabelach istnieją tylko w tej sesji.</p></div>
        </aside>
      </div>`;
  }

  function progressView() {
    const done = completedCount();
    const answered = Object.keys(state.quizAnswers).length;
    return `${heading('TWOJA NAUKA','Postępy w SBD','Wyniki i notatki są przechowywane lokalnie w tej przeglądarce.')}
      <div class="sbd-progress-grid"><div class="sbd-progress-card"><strong>${done}/${course.lessons.length}</strong><span>Ukończone lekcje</span></div><div class="sbd-progress-card"><strong>${answered}/${questions.length}</strong><span>Odpowiedzi w quizie</span></div><div class="sbd-progress-card"><strong>${Number(state.sqlRuns)||0}</strong><span>Uruchomione kwerendy</span></div></div>
      <section class="progress-panel"><h3>Co jeszcze powtórzyć?</h3><p>Wróć do lekcji, które nie są oznaczone jako ukończone, przećwicz pytania z quizu i spróbuj samodzielnie napisać kwerendy w SQL LAB.</p><div class="actions"><a class="cta" href="#/lessons">Wróć do lekcji</a><a class="secondary" href="#/lab">Ćwicz SQL</a></div></section>`;
  }

  function stopSqlWorker() {
    if (sqlWorker) sqlWorker.terminate();
    sqlWorker = null;
    workerReady = null;
    for (const pending of workerPending.values()) pending.reject(new Error('Silnik SQL został zrestartowany.'));
    workerPending.clear();
  }

  function getSqlWorker() {
    if (workerReady) return workerReady;
    if (!('Worker' in window)) return Promise.reject(new Error('Ta przeglądarka nie obsługuje Web Workerów.'));
    sqlWorker = new Worker(new URL('js/sql-worker.js', document.baseURI));
    const worker = sqlWorker;
    workerReady = new Promise((resolve, reject) => {
      const initTimer = setTimeout(() => {
        stopSqlWorker();
        reject(new Error('Przekroczono czas uruchamiania silnika SQL.'));
      }, 20000);
      worker.onmessage = event => {
        const message = event.data || {};
        if (message.type === 'ready') {
          clearTimeout(initTimer);
          resolve();
          return;
        }
        if (message.type === 'init-error') {
          clearTimeout(initTimer);
          stopSqlWorker();
          reject(new Error(message.error || 'Nie udało się uruchomić SQLite.'));
          return;
        }
        const pending = workerPending.get(message.id);
        if (!pending) return;
        clearTimeout(pending.timer);
        workerPending.delete(message.id);
        if (message.type === 'query-error') pending.reject(new Error(message.error || 'Błąd SQL.'));
        else pending.resolve(message);
      };
      worker.onerror = event => {
        clearTimeout(initTimer);
        stopSqlWorker();
        reject(new Error(event.message || 'Wystąpił błąd w silniku SQL.'));
      };
      const localBase = new URL('../../../../vendor/sqljs/', document.baseURI).href;
      const cdnBase = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.15.2/';
      worker.postMessage({type:'init', seed:course.sqlSeed || '', localBase, cdnBase});
    }).catch(error => {
      if (sqlWorker === worker) stopSqlWorker();
      throw error;
    });
    return workerReady;
  }

  async function requestSql(message, timeoutMs = 5000) {
    await getSqlWorker();
    const id = ++workerRequestId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        workerPending.delete(id);
        stopSqlWorker();
        reject(new Error('Kwerenda trwała zbyt długo (limit 5 sekund). Silnik SQL został zatrzymany, aby strona nie przestała odpowiadać. Uruchom laboratorium ponownie.'));
      }, timeoutMs);
      workerPending.set(id, {resolve, reject, timer});
      sqlWorker.postMessage({...message, id});
    });
  }

  function updateEngineStatus(status,message) {
    const pill=$('#sqlEnginePill');
    if (!pill) return;
    pill.classList.remove('ready','error');
    if (status==='ready') {
      pill.classList.add('ready');
      pill.textContent='SQLite gotowy';
    } else if (status==='error') {
      pill.classList.add('error');
      pill.textContent='Brak silnika SQL';
    } else {
      pill.textContent='Ładowanie SQLite';
    }
    if (message) {
      const output=$('#sqlResult');
      if (output) output.innerHTML=`<p class="sql-result-empty">${esc(message)}</p>`;
    }
  }

  function renderResult(results, modified = 0) {
    const output=$('#sqlResult');
    if (!output) return;
    if (!results || !results.length) {
      output.innerHTML=`<p class="sql-success">✓ Instrukcja wykonana poprawnie. ${modified ? `Liczba zmienionych wierszy: ${modified}.` : 'Nie zwrócono tabeli wynikowej (np. CREATE VIEW lub DROP VIEW).'}</p>`;
      $('#sqlResultMeta').textContent='Wykonano poprawnie';
      return;
    }
    const blocks = results.map((result,index)=>{
      const total = result.values.length;
      const rows = result.values.slice(0,100);
      return `<div class="sql-output-block">${results.length>1?`<p class="sql-success">Wynik ${index+1}</p>`:''}<table class="sql-result-table"><thead><tr>${result.columns.map(column=>`<th>${esc(column)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(value=>`<td>${value===null?'<span class="sql-null">NULL</span>':esc(typeof value==='object'?JSON.stringify(value):value)}</td>`).join('')}</tr>`).join('')}</tbody></table>${total>rows.length?`<p class="sql-result-empty">Pokazano ${rows.length} z ${total} wierszy.</p>`:''}</div>`;
    }).join('<hr>');
    output.innerHTML=blocks;
    const count=results.reduce((sum,result)=>sum+result.values.length,0);
    $('#sqlResultMeta').textContent=`${count} ${count===1?'wiersz':'wierszy'} w wyniku`;
  }

  async function refreshViewList() {
    const schema=$('#schemaList');
    if (!schema) return;
    const response = await requestSql({type:'views'});
    const views = response.results || [];
    const old=schema.querySelector('.sql-help.views-created');
    if (old) old.remove();
    if (views.length && views[0].values.length) {
      const wrapper=document.createElement('div');
      wrapper.className='sql-help views-created';
      wrapper.innerHTML=`<strong>Widoki w tej sesji</strong>${views[0].values.map(([name])=>`<button type="button" class="schema-item" data-view-table="${esc(name)}"><strong>${esc(name)} <span>WIDOK</span></strong><small>Kliknij, aby wykonać SELECT * FROM ${esc(name)}.</small></button>`).join('')}`;
      schema.appendChild(wrapper);
    }
  }

  async function runSql() {
    const editor=$('#sqlEditor');
    const output=$('#sqlResult');
    if (!editor || !output) return;
    const raw=editor.value.trim();
    if (!raw) { output.innerHTML='<p class="sql-result-empty">Wpisz zapytanie SQL.</p>'; return; }
    $('#sqlResultMeta').textContent='Wykonywanie…';
    try {
      const response=await requestSql({type:'run',sql:raw});
      state.sqlRuns=(Number(state.sqlRuns)||0)+1;
      state.sqlDraft=editor.value;
      save();
      renderResult(response.results,response.modified);
      await refreshViewList();
      const runCount=$('#sqlRunCount');
      if(runCount)runCount.textContent=`${state.sqlRuns} uruchomień`;
    } catch(error) {
      output.innerHTML=`<div class="sql-error">BŁĄD SQL\n${esc(error && error.message ? error.message : error)}\n\nSprawdź nazwy tabel i kolumn, składnię JOIN, nawiasy oraz średniki.</div>`;
      $('#sqlResultMeta').textContent='Kwerenda zawiera błąd';
      if (!sqlWorker) updateEngineStatus('error','Silnik SQL został zatrzymany. Kliknij „Uruchom SQL” ponownie, aby go uruchomić.');
    }
  }

  async function startLab() {
    updateEngineStatus('loading','Ładowanie silnika SQLite. Przy pierwszym uruchomieniu potrzebny jest Internet.');
    try {
      await getSqlWorker();
      updateEngineStatus('ready');
      const draft=$('#sqlEditor');
      if (draft && !state.sqlDraft) draft.value=examples[0]?.sql || '';
      await refreshViewList();
      $('#sqlResult').innerHTML='<p class="sql-result-empty">Silnik SQL jest gotowy. Wybierz przykład i uruchom kwerendę.</p>';
    } catch(error) {
      updateEngineStatus('error','Nie udało się uruchomić silnika SQLite.');
      const output=$('#sqlResult');
      if (output) output.innerHTML=`<div class="sql-error"><strong>Nie udało się uruchomić silnika SQL.</strong><p>${esc(error && error.message ? error.message : error)}</p><p>Spróbuj ponownie. Jeśli problem się powtarza, sprawdź, czy sieć nie blokuje zewnętrznych bibliotek.</p><button class="secondary" type="button" id="retrySqlEngine">Spróbuj ponownie</button></div>`;
      $('#sqlResultMeta').textContent='Silnik niedostępny';
    }
  }

  function render() {
    const {page,id}=route();
    const content = {
      start:home,
      lessons:allLessons,
      lesson:()=>article(id),
      flash:flashView,
      quiz:quizView,
      lab:labView,
      progress:progressView
    }[page] || home;
    $('#courseNav').innerHTML=menu.map(([name,icon,label])=>`<a class="${name===(page==='lesson'?'lessons':page)?'active':''}" href="#/${name}"><span>${icon}</span>${label}</a>`).join('');
    $('#sideProgressNumber').textContent=`${completedCount()} / ${course.lessons.length}`;
    $('#sideMeter').style.width=`${progress()}%`;
    $('#courseMain').innerHTML=content();
    document.title=`${course.title} — Klasa 4i`;
    if(page==='lab') startLab();
  }

  $('#courseMain').addEventListener('click', async event=>{
    const button=event.target.closest('button');
    if (!button) return;
    if (button.dataset.complete) {
      state.completed[button.dataset.complete]=!state.completed[button.dataset.complete]; save(); render(); return;
    }
    if (button.dataset.flip) { flipped=!flipped; render(); return; }
    if (button.dataset.nextCard) { flashIndex++; flipped=false; render(); return; }
    if (button.dataset.prevCard) { flashIndex--; flipped=false; render(); return; }
    if (button.dataset.answer!==undefined) { state.quizAnswers[quizIndex]=Number(button.dataset.answer); save(); render(); return; }
    if (button.dataset.nextQ) { quizIndex=(quizIndex+1)%questions.length; render(); return; }
    if (button.dataset.prevQ) { quizIndex=(quizIndex-1+questions.length)%questions.length; render(); return; }
    if (button.dataset.resetQ) { state.quizAnswers={}; quizIndex=0; save(); render(); return; }
    if (button.dataset.openLab) { location.hash='#/lab'; return; }
    if (button.id==='retrySqlEngine') { stopSqlWorker(); startLab(); return; }
    if (button.id==='runSql') { await runSql(); return; }
    if (button.id==='resetDatabase') {
      try {
        await requestSql({type:'reset',seed:course.sqlSeed || ''});
        await refreshViewList();
        $('#sqlResult').innerHTML='<p class="sql-success">✓ Baza została przywrócona do danych początkowych.</p>';
        $('#sqlResultMeta').textContent='Baza zresetowana';
      } catch(error) {
        $('#sqlResult').innerHTML=`<div class="sql-error">${esc(error.message||error)}</div>`;
      }
      return;
    }
    if (button.dataset.table) {
      const editor=$('#sqlEditor');
      if(editor) {
        editor.value=`SELECT * FROM "${button.dataset.table}";`;
        state.sqlDraft=editor.value; save(); editor.focus();
      }
      return;
    }
    if (button.dataset.viewTable) {
      const editor=$('#sqlEditor');
      if(editor) {
        editor.value=`SELECT * FROM "${button.dataset.viewTable}";`;
        state.sqlDraft=editor.value; save(); editor.focus();
      }
      return;
    }
    if (button.id==='copySql') {
      try { await navigator.clipboard.writeText($('#sqlEditor').value); button.textContent='Skopiowano ✓'; }
      catch { button.textContent='Nie udało się skopiować'; }
      return;
    }
    if (button.id==='downloadSql') {
      const blob=new Blob([$('#sqlEditor').value],{type:'text/sql;charset=utf-8'});
      const url=URL.createObjectURL(blob);
      const link=document.createElement('a'); link.href=url; link.download='moja-kwerenda.sql'; link.click();
      URL.revokeObjectURL(url); return;
    }
  });

  $('#courseMain').addEventListener('input',event=>{
    if(event.target.dataset.note) { state.notes[event.target.dataset.note]=event.target.value; save(); }
    if(event.target.id==='sqlEditor') {
      state.sqlDraft=event.target.value; save();
      const status=$('#sqlSaveStatus'); if(status)status.textContent='Zapisano lokalnie';
    }
  });
  $('#courseMain').addEventListener('change',event=>{
    if(event.target.id==='sqlPreset') {
      const preset=examples[Number(event.target.value)];
      const editor=$('#sqlEditor');
      if(preset && editor) { editor.value=preset.sql; state.sqlDraft=preset.sql; save(); editor.focus(); }
    }
  });
  $('#courseMain').addEventListener('keydown',event=>{
    if(event.target.id==='sqlEditor' && (event.ctrlKey||event.metaKey) && event.key==='Enter') {
      event.preventDefault(); runSql();
    }
  });

  let theme='dark';
  try { theme=localStorage.getItem('klasa4i-theme')==='light'?'light':'dark'; } catch {}
  function applyTheme(){document.documentElement.dataset.theme=theme;$('#mode').textContent=theme==='dark'?'☼':'☾';}
  $('#mode').addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';try{localStorage.setItem('klasa4i-theme',theme)}catch{}applyTheme();});
  window.addEventListener('hashchange',()=>{render();window.scrollTo({top:0,behavior:'smooth'});});
  applyTheme();
  if(!location.hash)location.hash='#/start';
  render();
})();
