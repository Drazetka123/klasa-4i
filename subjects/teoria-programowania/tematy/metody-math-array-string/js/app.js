/* Klasa 4i • Teoria programowania • osobny stan i niezależny moduł */
(() => {
  'use strict';
  const DATA = Array.isArray(window.KLASA4I_METHODS) ? window.KLASA4I_METHODS : [];
  const STORAGE = 'klasa4i-teoria-metody-v1';
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId = new Map(DATA.map(x => [x.id, x]));
  const groups = ['Math', 'Array', 'String'];
  const groupLabel = { Math:'Operacje matematyczne', Array:'Praca z tablicami', String:'Operacje na tekstach' };
  const blankState = () => ({ completed:{}, favorites:[], known:{}, review:{}, history:[], quiz:null });
  function safeLoad() { try { return { ...blankState(), ...JSON.parse(localStorage.getItem(STORAGE) || '{}') }; } catch { return blankState(); } }
  let state = safeLoad();
  if (!state || typeof state !== 'object') state = blankState();
  const save = () => { try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch {} };
  const knownCount = () => Object.entries(state.known || {}).filter(([id, value]) => byId.has(id) && value === 'known').length;
  const plural = (n, one, few, many) => n === 1 ? one : (n % 10 >= 2 && n % 10 <= 4 && (n%100<12 || n%100>14) ? few : many);
  const randomize = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; };
  const favorites = () => Array.isArray(state.favorites) ? state.favorites : [];
  const sourceName = m => m.source === 'lekcja' ? 'Z lekcji' : 'Dodatkowe';
  const text = (sel,val) => { const el=$(sel); if(el) el.textContent=String(val); };
  let activeView = 'library'; let page=0; const PAGE_SIZE=24; const opened = new Set();
  const metric = () => {
    text('#allCount', DATA.length);
    text('#lessonCount', DATA.filter(m => m.source==='lekcja').length);
    text('#knownCount', knownCount());
    const results=Array.isArray(state.history) ? state.history : [];
    const best=results.length ? Math.max(...results.map(x=>Number(x.percent)||0)) : null;
    text('#quizBest',best===null?'—':best+'%');
  };
  function show(view) {
    if (!['library','flashcards','quiz','progress'].includes(view)) return;
    activeView=view;
    document.querySelectorAll('.view').forEach(el=>el.hidden=el.id!=='view-'+view);
    document.querySelectorAll('[data-view]').forEach(el=>{
      const isActive = el.dataset.view===view;
      if(el.classList.contains('menu-link') || el.closest('.mobile-tabs')) el.classList.toggle('active',isActive);
      if (el.classList.contains('menu-link')) isActive ? el.setAttribute('aria-current','page') : el.removeAttribute('aria-current');
    });
    if(view==='flashcards') renderFlash();
    if(view==='progress') renderProgress();
    if(view==='quiz') renderQuiz();
    if(view==='library') renderLibrary();
    if (location.protocol!=='file:') { try { history.replaceState(null,'','#'+view); } catch {} }
    window.scrollTo({top:0,behavior:'instant'});
  }
  document.addEventListener('click', ev=>{ const el=ev.target.closest('[data-view]'); if(el){ev.preventDefault();show(el.dataset.view);} });
  /* Theme, same preference as portal and Witryny. */
  let theme='dark'; try { theme=localStorage.getItem('klasa4i-theme')==='light' ? 'light':'dark'; } catch {}
  const paintTheme=()=>{ document.documentElement.dataset.theme=theme; $('#themeToggle').textContent=theme==='dark'?'☼':'☾'; $('#themeToggle').setAttribute('aria-label',theme==='dark'?'Włącz jasny motyw':'Włącz ciemny motyw'); };
  $('#themeToggle').addEventListener('click',()=>{ theme=theme==='dark'?'light':'dark'; try{localStorage.setItem('klasa4i-theme',theme);}catch{} paintTheme(); }); paintTheme();
  /* Searchable reference library: descriptions copied from notes, specs added for practice. */
  function filteredLibrary() {
    const query=$('#methodSearch').value.trim().toLocaleLowerCase('pl');
    const group=$('#methodGroup').value;
    const source=$('#methodSource').value;
    return DATA.filter(m => (group==='all'||m.group===group) &&
      (source==='all'||m.source===source||(source==='favorites'&&favorites().includes(m.id))) &&
      (!query||[m.name,m.group,m.description,m.arguments,m.returns,m.example].join(' ').toLocaleLowerCase('pl').includes(query)));
  }
  function renderModules() {
    $('#moduleCards').innerHTML=groups.map(g=>{
      const n=DATA.filter(m=>m.group===g).length;const k=DATA.filter(m=>m.group===g&&state.known?.[m.id]==='known').length;
      const done=Boolean(state.completed?.[g]);
      return `<article class="module"><div class="module-head"><strong class="module-name">${g}</strong><span class="module-count">${k}/${n} fiszek</span></div><div class="module-progress"><span style="width:${Math.round(k/n*100)}%"></span></div><p class="module-desc">${groupLabel[g]} · ${n} metod</p><button type="button" data-complete="${g}" class="${done?'done':''}">${done?'✓ Dział przerobiony':'Oznacz dział jako przerobiony'}</button></article>`;
    }).join('');
  }
  function renderLibrary() {
    renderModules();metric();
    const list=filteredLibrary();const maxPage=Math.max(0,Math.ceil(list.length/PAGE_SIZE)-1);
    page=Math.min(page,maxPage);const current=list.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);
    $('#methodResults').textContent=`${list.length} ${plural(list.length,'metoda','metody','metod')} · strona ${page+1} / ${maxPage+1}`;
    $('#noMethods').hidden=list.length>0;
    $('#methodsList').innerHTML=current.map(m=>{
      const open=opened.has(m.id),fav=favorites().includes(m.id);
      return `<article class="method-card ${open?'open':''}" data-method="${esc(m.id)}"><div class="method-card-head"><span class="method-tag ${m.group.toLowerCase()}">${m.group}</span><span class="method-source">${sourceName(m)}</span><button class="favorite-btn ${fav?'is-fav':''}" data-favorite="${esc(m.id)}" type="button" title="${fav?'Usuń zakładkę':'Dodaj zakładkę'}" aria-label="${fav?'Usuń zakładkę':'Dodaj zakładkę'}: ${esc(m.fullName)}">${fav?'★':'☆'}</button></div><div class="method-card-main"><h3>${esc(m.fullName)}</h3><p>${esc(m.description)}</p></div><div class="method-detail" id="detail-${esc(m.id)}"><div class="method-detail-row"><b>Argumenty / typ</b><span>${esc(m.arguments)}</span></div><div class="method-detail-row"><b>Wynik / typ</b><span>${esc(m.returns)}</span></div><div class="method-detail-row"><b>Przykład</b><span class="example">${esc(m.example)}</span></div></div><button type="button" class="method-expand" data-expand="${esc(m.id)}" aria-expanded="${open}" aria-controls="detail-${esc(m.id)}">${open?'Ukryj argumenty i wynik':'Pokaż argumenty i wynik'}<span>${open?'−':'+'}</span></button></article>`;
    }).join('');
    $('#methodPager').innerHTML=list.length>PAGE_SIZE ? `<button type="button" data-page="prev" ${page===0?'disabled':''}>← Poprzednia</button><span>${page+1} / ${maxPage+1}</span><button type="button" data-page="next" ${page>=maxPage?'disabled':''}>Następna →</button>`:'';
  }
  for(const id of ['methodSearch','methodGroup','methodSource']) $('#'+id).addEventListener(id==='methodSearch'?'input':'change',()=>{page=0;renderLibrary();});
  $('#moduleCards').addEventListener('click',e=>{
    const b=e.target.closest('[data-complete]');if(!b)return;
    state.completed=state.completed||{};state.completed[b.dataset.complete]=!state.completed[b.dataset.complete];save();renderLibrary();
  });
  $('#methodsList').addEventListener('click',e=>{
    const fav=e.target.closest('[data-favorite]');const more=e.target.closest('[data-expand]');
    if(fav){const id=fav.dataset.favorite;state.favorites=favorites().includes(id)?favorites().filter(x=>x!==id):[...favorites(),id];save();renderLibrary();}
    if(more){const id=more.dataset.expand;opened.has(id)?opened.delete(id):opened.add(id);renderLibrary();}
  });
  $('#methodPager').addEventListener('click',e=>{
    const btn=e.target.closest('[data-page]');if(!btn)return;page+=btn.dataset.page==='next'?1:-1;page=Math.max(0,page);renderLibrary();$('#methodListTitle').scrollIntoView({block:'start'});
  });
  /* Flashcards, with persistent learn/repeat decisions. */
  let deck=[],flashIndex=0,revealed=false;
  function makeDeck(shuffle=false){
    const group=$('#flashGroup').value,source=$('#flashSource').value;
    deck=DATA.filter(m => (group==='all'||m.group===group) &&
      (source==='all'||m.source===source||(source==='hard'&&(state.known?.[m.id]==='again'||state.review?.[m.id]===true))));
    if(shuffle) deck=randomize(deck);
    flashIndex=0;revealed=false;renderFlash();
  }
  function currentCard(){ return deck[flashIndex]; }
  function renderFlash(){
    metric();
    const m=currentCard();
    $('#flashPosition').textContent=deck.length?`${flashIndex+1} / ${deck.length}`:'0 / 0';
    $('#flashMastered').textContent=`${deck.filter(m=>state.known?.[m.id]==='known').length} zapamiętanych w zestawie`;
    $('#flashMeter').style.width=(deck.length?Math.round((flashIndex+1)/deck.length*100):0)+'%';
    $('#flashTag').textContent=m?`${m.group.toUpperCase()} · ${sourceName(m).toUpperCase()}`:'BRAK FISZEK';
    $('#flashMethod').textContent=m?m.fullName:'Brak kart';
    $('#flashFront').querySelector('p').textContent=m?'Spróbuj samodzielnie odpowiedzieć.':'Zmień zakres, aby wyświetlić fiszki.';
    $('#flashFront').hidden=revealed;
    $('#flashBack').hidden=!revealed || !m;
    $('#flashBack').innerHTML=m?`<h3>${esc(m.fullName)}</h3><div class="flash-answer-row"><span>Co robi?</span><strong>${esc(m.description)}</strong></div><div class="flash-answer-row"><span>Argumenty i typy</span><strong>${esc(m.arguments)}</strong></div><div class="flash-answer-row"><span>Zwracany typ</span><strong>${esc(m.returns)}</strong></div><code>${esc(m.example)}</code>`:'';
    $('#revealCard').textContent=revealed?'Ukryj odpowiedź ↻':'Odkryj odpowiedź ↻';
    $('#revealCard').disabled=!m;
    for(const sel of ['#againCard','#knowCard','#nextCard','#prevCard']) $(sel).disabled=!m;
  }
  const move=delta=>{if(!deck.length)return;flashIndex=(flashIndex+delta+deck.length)%deck.length;revealed=false;renderFlash();};
  $('#flashGroup').addEventListener('change',()=>makeDeck());
  $('#flashSource').addEventListener('change',()=>makeDeck());
  $('#shuffleCards').addEventListener('click',()=>makeDeck(true));
  $('#revealCard').addEventListener('click',()=>{revealed=!revealed;renderFlash();});
  $('#nextCard').addEventListener('click',()=>move(1));
  $('#prevCard').addEventListener('click',()=>move(-1));
  const rateFlash=grade=>{const m=currentCard();if(!m)return;state.known=state.known||{};state.known[m.id]=grade;if(grade==='known'){if(state.review)delete state.review[m.id];}else{state.review=state.review||{};state.review[m.id]=true;}save();metric();move(1);};
  $('#knowCard').addEventListener('click',()=>rateFlash('known'));
  $('#againCard').addEventListener('click',()=>rateFlash('again'));
  document.addEventListener('keydown',e=>{
    const writing=e.target.closest('input,textarea,select,[contenteditable="true"]');
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();show('library');$('#methodSearch').focus();return;}
    if(activeView!=='flashcards'||writing||e.altKey||e.ctrlKey||e.metaKey)return;
    if(e.code==='Space'){e.preventDefault();revealed=!revealed;renderFlash();}
    if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}
  });
  /* Worksheet — one point per correctly described method. User self-marks after viewing the model. */
  const quizPool=()=>{
    const group=$('#quizGroup').value,source=$('#quizSource').value;
    return DATA.filter(m => (group==='all'||group===m.group) &&
      (source==='all'||source===m.source||(source==='hard'&&(state.known?.[m.id]==='again'||state.review?.[m.id]))));
  };
  const quizSize=()=>{const v=$('#quizSize').value;return v==='all'?'wszystkie':v;};
  function setupHint(){const n=quizPool().length;$('#quizSetupHint').textContent=`W wybranym zakresie: ${n} ${plural(n,'metoda','metody','metod')}. ${n===0?'Zmień zakres, aby rozpocząć.':''}`;$('#startQuiz').disabled=n===0;}
  ['quizGroup','quizSource','quizSize'].forEach(id=>$('#'+id).addEventListener('change',setupHint));
  function startQuiz(){
    const pool=randomize(quizPool());if(!pool.length)return;
    const n=$('#quizSize').value==='all'?pool.length:Math.min(Number($('#quizSize').value),pool.length);
    state.quiz={ids:pool.slice(0,n).map(x=>x.id),answers:{},marks:{},checked:false,saved:false,timed:$('#quizTimer').checked,startedAt:Date.now()};
    save();renderQuiz();
  }
  $('#startQuiz').addEventListener('click',startQuiz);
  $('#newQuiz').addEventListener('click',()=>{
    if(state.quiz && !state.quiz.saved && !confirm('Rozpocząć nową kartkówkę? Niezapisany wynik obecnej zostanie utracony.'))return;
    state.quiz=null;save();renderQuiz();
  });
  const model=(value)=>`<div class="model-answer"><b>Wzorcowa odpowiedź</b>${esc(value)}</div>`;
  function renderQuiz(){
    const q=state.quiz;$('#quizSetup').hidden=Boolean(q);$('#quizActive').hidden=!q;
    if(!q){setupHint();return;}
    const methods=q.ids.map(id=>byId.get(id)).filter(Boolean);
    $('#quizHeading').textContent=`${methods.length} ${plural(methods.length,'metoda','metody','metod')} · wypełnij tabelkę`;
    $('#quizInstructions').textContent=q.checked?'Porównaj swoje odpowiedzi ze wzorem. Za każdy poprawny wiersz kliknij „Zaliczam” (1 punkt), w przeciwnym razie „Do powtórki”.':'Uzupełnij trzy kolumny w każdym wierszu. Twoje odpowiedzi zapisują się automatycznie. Po sprawdzeniu samodzielnie oceń każdy wiersz.';
    $('#quizBody').innerHTML=methods.map(m=>{
      const a=Array.isArray(q.answers?.[m.id])?q.answers[m.id]:['','',''];
      const fields=[m.description,m.arguments,m.returns].map((answer,i)=>`<td><label class="sr-only" for="answer-${esc(m.id)}-${i}">${['Co robi','Argumenty i typy','Zwracany typ'][i]} — ${esc(m.fullName)}</label><textarea id="answer-${esc(m.id)}-${i}" data-answer="${esc(m.id)}" data-col="${i}" placeholder="${['Opisz działanie...','Wpisz argumenty i typy...','Wpisz typ wyniku...'][i]}" ${q.checked?'disabled':''}></textarea>${q.checked?model(answer):''}</td>`);
      const mark=q.marks?.[m.id];
      return `<tr data-row="${esc(m.id)}"><td><div class="quiz-method"><code>${esc(m.fullName)}</code><span>${m.group} · ${sourceName(m)}</span></div>${q.checked?`<div class="quiz-grade" role="group" aria-label="Ocena ${esc(m.fullName)}"><button type="button" data-grade="${esc(m.id)}" data-value="pass" class="pass ${mark==='pass'?'active':''}" aria-pressed="${mark==='pass'}">✓ Zaliczam</button><button type="button" data-grade="${esc(m.id)}" data-value="fail" class="fail ${mark==='fail'?'active':''}" aria-pressed="${mark==='fail'}">↺ Do powtórki</button></div>`:''}</td>${fields.join('')}</tr>`;
    }).join('');
    // Avoid embedding student text in generated HTML; set textarea.value afterwards.
    $('#quizBody').querySelectorAll('textarea[data-answer]').forEach(el=>{el.value=String(q.answers?.[el.dataset.answer]?.[Number(el.dataset.col)]||'');});
    $('#checkQuiz').hidden=!!q.checked;
    $('#saveQuiz').hidden=!q.checked||!!q.saved;
    $('#quizSaved').textContent=q.saved?'Wynik zapisany. Możesz rozpocząć kolejny zestaw.':q.checked?'Zaznacz ocenę każdego wiersza.':'Odpowiedzi zapisują się automatycznie na tym urządzeniu.';
    $('#quizResult').hidden=!q.checked;
    updateQuizResult();updateTimer();
  }
  $('#quizBody').addEventListener('input',e=>{
    const t=e.target.closest('textarea[data-answer]');if(!t||!state.quiz||state.quiz.checked)return;
    const q=state.quiz;q.answers=q.answers||{};q.answers[t.dataset.answer]=Array.isArray(q.answers[t.dataset.answer])?q.answers[t.dataset.answer]:['','',''];q.answers[t.dataset.answer][Number(t.dataset.col)]=t.value;save();
  });
  $('#quizBody').addEventListener('click',e=>{
    const b=e.target.closest('[data-grade]');const q=state.quiz;if(!b||!q?.checked||q.saved)return;
    q.marks=q.marks||{};q.marks[b.dataset.grade]=b.dataset.value;save();
    const group=b.parentElement;group.querySelectorAll('button').forEach(x=>{const active=x.dataset.value===b.dataset.value;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});
    updateQuizResult();
  });
  function updateQuizResult(){
    const q=state.quiz;if(!q?.checked)return;
    const marked=q.ids.filter(id=>q.marks?.[id]);const passed=marked.filter(id=>q.marks[id]==='pass').length;
    const percentage=Math.round(passed/q.ids.length*100);
    $('#quizResult').hidden=false;
    $('#quizResult').innerHTML=`<strong>${passed} / ${q.ids.length} punktów (${percentage}%)</strong><p>Oceniono ${marked.length} z ${q.ids.length} wierszy. ${marked.length<q.ids.length?'Oceń każdy wiersz, aby zapisać wynik.':'Gotowe! Możesz zapisać kartkówkę.'}</p>`;
    $('#saveQuiz').disabled=marked.length!==q.ids.length;
    if(q.saved)$('#quizResult').innerHTML+=`<p>✓ Wynik zapisany w historii. <a href="#progress" data-view="progress">Zobacz postępy →</a></p>`;
  }
  function revealQuiz(reason='manual'){
    const q=state.quiz;if(!q||q.checked)return;q.checked=true;q.endedAt=Date.now();save();renderQuiz();
    if(reason==='timeout')$('#quizInstructions').textContent='Czas minął. Porównaj odpowiedzi ze wzorem i samodzielnie przyznaj punkty.';
  }
  $('#checkQuiz').addEventListener('click',()=>revealQuiz());
  $('#saveQuiz').addEventListener('click',()=>{
    const q=state.quiz;if(!q?.checked||q.saved||q.ids.some(id=>!q.marks?.[id]))return;
    const pass=q.ids.filter(id=>q.marks[id]==='pass').length;
    const entry={id:Date.now(),date:new Date().toISOString(),points:pass,total:q.ids.length,percent:Math.round(pass/q.ids.length*100)};
    state.history=Array.isArray(state.history)?state.history:[];state.history=[entry,...state.history].slice(0,40);
    state.review=state.review||{};
    q.ids.forEach(id=>{if(q.marks[id]==='fail')state.review[id]=true;else delete state.review[id];});
    q.saved=true;save();metric();renderQuiz();
  });
  let quizTimer=null;
  function updateTimer(){
    const el=$('#quizClock'),q=state.quiz;
    if(!q||!q.timed||q.checked){el.hidden=true;if(quizTimer){clearInterval(quizTimer);quizTimer=null;}return;}
    el.hidden=false;
    const remaining=Math.max(0,600-Math.floor((Date.now()-q.startedAt)/1000));
    el.textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
    el.classList.toggle('ending',remaining<=60);
    if(remaining===0){revealQuiz('timeout');return;}
    if(!quizTimer) quizTimer=setInterval(updateTimer,1000);
  }
  /* Progress and file backup */
  function renderProgress(){
    metric();
    const done=groups.filter(g=>state.completed?.[g]).length;
    const results=Array.isArray(state.history)?state.history:[];
    const avg=results.length?Math.round(results.reduce((n,x)=>n+(Number(x.percent)||0),0)/results.length):0;
    $('#progressSummary').innerHTML=`<div><strong>${done} / 3</strong><span>Przerobione działy</span></div><div><strong>${knownCount()} / ${DATA.length}</strong><span>Opanowane fiszki</span></div><div><strong>${results.length?avg+'%':'—'}</strong><span>Średnia z kartkówek</span></div>`;
    $('#groupProgress').innerHTML=groups.map(g=>{
      const known=DATA.filter(m=>m.group===g&&state.known?.[m.id]==='known').length;
      const n=DATA.filter(m=>m.group===g).length;
      return `<div class="group-progress-row"><div><b>${g}</b><br><span>${known} / ${n} fiszek</span></div><span>${state.completed?.[g]?'✓ Dział przerobiony':'Jeszcze nieoznaczony'}</span></div>`;
    }).join('');
    $('#historyList').innerHTML=results.length?results.slice(0,10).map(x=>`<div class="history-row"><div> Kartkówka · ${Number(x.total)||0} metod<small>${new Date(x.date).toLocaleString('pl-PL')}</small></div><strong>${Number(x.points)||0}/${Number(x.total)||0} · ${Number(x.percent)||0}%</strong></div>`).join(''):'<p>Nie masz jeszcze ukończonych kartkówek. Rozwiąż pierwszą tabelkę, żeby zobaczyć wynik.</p>';
  }
  $('#exportState').addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify({type:'klasa4i-teoria-progress',version:1,exportedAt:new Date().toISOString(),data:state},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='klasa-4i-teoria-postepy.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
    text('#backupMessage','Wyeksportowano postępy do pliku JSON.');
  });
  $('#importState').addEventListener('change',async e=>{
    const f=e.target.files?.[0];if(!f)return;
    if(f.size>1000000){text('#backupMessage','Plik jest zbyt duży (maks. 1 MB).');return;}
    try{
      const obj=JSON.parse(await f.text());if(obj.type!=='klasa4i-teoria-progress'||!obj.data||typeof obj.data!=='object')throw Error('Zły format');
      if(!confirm('Zastąpić lokalne postępy danymi z pliku?'))return;
      const raw=obj.data;
      state={completed:Object.fromEntries(groups.map(g=>[g,Boolean(raw.completed?.[g])])),favorites:(Array.isArray(raw.favorites)?raw.favorites:[]).filter(id=>byId.has(id)),known:Object.fromEntries(Object.entries(raw.known||{}).filter(([id,v])=>byId.has(id)&&['known','again'].includes(v))),review:Object.fromEntries(Object.entries(raw.review||{}).filter(([id,v])=>byId.has(id)&&v===true)),history:Array.isArray(raw.history)?raw.history.filter(x=>typeof x?.percent==='number'&&Number.isFinite(x.percent)).slice(0,40):[],quiz:null};
      save();makeDeck();renderLibrary();renderProgress();text('#backupMessage','Zaimportowano postępy pomyślnie.');
    }catch{ text('#backupMessage','Nie udało się odczytać postępów. Wybierz prawidłowy eksport JSON.'); }
    finally{ e.target.value=''; }
  });
  function boot(){
    const valid=DATA.length===109&&groups.every(g=>DATA.some(m=>m.group===g));
    if(!valid){$('#methodsList').textContent='Nie udało się załadować listy metod. Sprawdź plik js/methods.js.';return;}
    setupHint();makeDeck();renderLibrary();metric();
    const requested=location.hash.replace('#','');show(['library','flashcards','quiz','progress'].includes(requested)?requested:'library');
  }
  boot();
})();
