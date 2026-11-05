/*
 * Klasa 4i • Teoria programowania • interaktywne laboratorium Math/Array/String.
 * Osobny moduł: stare quizy, fiszki i dane Witryn pozostają nienaruszone.
 * Każde uruchomienie odbywa się w NOWYM Web Workerze z limitem 3 sekund.
 */
(() => {
  'use strict';
  const DATA = Array.isArray(window.KLASA4I_METHODS) ? window.KLASA4I_METHODS : [];
  const byId = new Map(DATA.map(m => [m.id, m]));
  const STORAGE_KEY = 'klasa4i-teoria-lab-v1';
  const $ = id => document.getElementById(id);
  if (!DATA.length || !$('labCode')) return;

  function normalizeState(value) {
    const raw = value && typeof value === 'object' ? value : {};
    const practiced = {};
    for (const [id, ok] of Object.entries(raw.practiced || {})) {
      if (byId.has(id) && ok === true) practiced[id] = true;
    }
    const snippets = {};
    for (const [id, code] of Object.entries(raw.snippets || {})) {
      if (byId.has(id) && typeof code === 'string') snippets[id] = code.slice(0, 20000);
    }
    return {activeId:byId.has(raw.activeId) ? raw.activeId : 'math-abs',
      snippets, practiced, runCount:Math.max(0,Math.min(999999,Number(raw.runCount)||0))};
  }
  function load() {
    try { return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); }
    catch { return normalizeState({}); }
  }
  let state = load();
  let currentId = state.activeId;
  let writeTimer = null;
  const save = () => { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); } catch {} };
  function markSaved(label = 'Zapisano lokalnie') { $('labSaveStatus').textContent=label; }
  function storeEditor() {
    if (!byId.has(currentId)) return;
    state.snippets[currentId] = $('labCode').value.slice(0,20000);
    state.activeId=currentId;
    save(); markSaved();
  }
  function queueSave() {
    markSaved('Zapisywanie…');
    clearTimeout(writeTimer);
    writeTimer=setTimeout(storeEditor,180);
  }

  const special = {
    'array-unshift': `const tablica = [2, 3];\nconsole.log('Przed:', [...tablica]);\nconst wynik = tablica.unshift(1);\nconsole.log('Po:', tablica);\nwynik`,
    'array-push': `const tablica = [1, 2];\nconsole.log('Przed:', [...tablica]);\nconst wynik = tablica.push(3);\nconsole.log('Po:', tablica);\nwynik`,
    'array-splice': `const tablica = [1, 2, 3];\nconsole.log('Przed:', [...tablica]);\nconst usuniete = tablica.splice(1, 1);\nconsole.log('Po:', tablica);\nusuniete`,
    'array-pop': `const tablica = [1, 2, 3];\nconsole.log('Przed:', [...tablica]);\nconst wynik = tablica.pop();\nconsole.log('Po:', tablica);\nwynik`,
    'array-shift': `const tablica = [1, 2, 3];\nconsole.log('Przed:', [...tablica]);\nconst wynik = tablica.shift();\nconsole.log('Po:', tablica);\nwynik`,
    'array-fill': `const tablica = [1, 2, 3];\nconsole.log('Przed:', [...tablica]);\nconst wynik = tablica.fill(0);\nconsole.log('Po:', tablica);\nwynik`,
    'array-reverse': `const tablica = [1, 2, 3];\nconsole.log('Przed:', [...tablica]);\nconst wynik = tablica.reverse();\nconsole.log('Po:', tablica);\nwynik`,
    'array-sort': `const tablica = [3, 1, 2];\nconsole.log('Przed:', [...tablica]);\nconst wynik = tablica.sort();\nconsole.log('Po:', tablica);\nwynik`,
    'array-copywithin': `const tablica = [1, 2, 3];\nconsole.log('Przed:', [...tablica]);\nconst wynik = tablica.copyWithin(0, 2);\nconsole.log('Po:', tablica);\nwynik`,
    'array-entries': `const iterator = ['a', 'b'].entries();\nArray.from(iterator)`,
    'array-keys': `const iterator = ['a', 'b'].keys();\nArray.from(iterator)`,
    'string-matchall': `const dopasowania = [...'a1b2'.matchAll(/\\d/g)];\ndopasowania.map(m => m[0])`,
    'array-foreach': `const tablica = [10, 20, 30];\nconst wynik = tablica.forEach(x => console.log('Element:', x));\nwynik`,
    'array-map': `const tablica = [1, 2, 3];\nconsole.log('Przed:', tablica);\nconst wynik = tablica.map(x => x * 2);\nconsole.log('Po map():', tablica);\nwynik`,
    'math-random': `// Spróbuj uruchomić kilka razy. Wynik będzie różny.\nMath.random()`
  };
  const presets = {
    round:{id:'math-round',code:`const liczba = -4.6;\nconsole.log('round:', Math.round(liczba));\nconsole.log('floor:', Math.floor(liczba));\nconsole.log('ceil:', Math.ceil(liczba));\n// Zmień -4.6 na 4.6 i sprawdź ponownie!\nMath.round(liczba)`},
    arrays:{id:'array-push',code:`const tablica = [1, 2, 3];\nconsole.log('Na początku:', tablica);\nconst dlugosc = tablica.push(4);\nconsole.log('push() zwraca długość:', dlugosc);\nconsole.log('Po push():', tablica);\nconst podwojone = tablica.map(x => x * 2);\nconsole.log('map() daje nową tablicę:', podwojone);\nconsole.log('Oryginał nadal:', tablica);\npodwojone`},
    strings:{id:'string-charat',code:`const napis = 'programowanie';\nconsole.log('charAt(3):', napis.charAt(3));\nconsole.log('slice(0, 7):', napis.slice(0, 7));\nconsole.log('includes("gram"):', napis.includes('gram'));\nconsole.log('Typ znaku:', typeof napis.charAt(3));\nnapis.charAt(3)`}
  };
  function defaultCode(method) {
    if (special[method.id]) return special[method.id];
    const expression=method.example.split(/\s+→\s+/)[0]?.trim();
    // Notatki zawierają działające wyrażenia po lewej stronie strzałki.
    return `// ${method.fullName} — ${method.description}\n${expression}`;
  }
  function resetEditor(toCode) {
    $('labCode').value=toCode;
    storeEditor();
  }
  function displayMethod(methodId) {
    if (!byId.has(methodId)) return;
    clearTimeout(writeTimer);
    if (currentId !== methodId) storeEditor();
    currentId=methodId;
    const m=byId.get(methodId);
    $('labGroup').value=m.group;
    $('labMethod').value=methodId;
    $('labMethodName').textContent=m.fullName;
    $('labMethodBadge').textContent=m.source==='lekcja'?'Z lekcji':'Dodatkowa';
    $('labDescription').textContent=m.description;
    $('labArguments').textContent=m.arguments;
    $('labReturnType').textContent=m.returns;
    $('labCode').value=Object.hasOwn(state.snippets,methodId)?state.snippets[methodId]:defaultCode(m);
    state.activeId=methodId;save();markSaved('Kod zapisuje się lokalnie');
  }
  function populateMethods(preferred) {
    const group=$('labGroup').value,source=$('labSource').value;
    const items=DATA.filter(m=>m.group===group&&(source==='all'||m.source===source));
    $('labMethod').replaceChildren(...items.map(m=>{
      const option=document.createElement('option');option.value=m.id;
      option.textContent=m.fullName+(m.source==='dodatkowe'?' · dodatkowa':'');
      return option;
    }));
    if(!items.length)return;
    const chosen=items.some(m=>m.id===preferred)?preferred:items[0].id;
    displayMethod(chosen);
  }
  $('labGroup').addEventListener('change',()=>populateMethods(null));
  $('labSource').addEventListener('change',()=>populateMethods(currentId));
  $('labMethod').addEventListener('change',e=>displayMethod(e.target.value));
  $('labCode').addEventListener('input',queueSave);
  $('labLoadExample').addEventListener('click',()=>resetEditor(defaultCode(byId.get(currentId))));
  $('labReset').addEventListener('click',()=>resetEditor(defaultCode(byId.get(currentId))));
  $('labCode').addEventListener('keydown',e=>{
    if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();run();return;}
    if(e.key==='Tab'){
      e.preventDefault();const t=e.currentTarget,start=t.selectionStart,end=t.selectionEnd;
      t.setRangeText('  ',start,end,'end');queueSave();
    }
  });
  document.querySelectorAll('[data-lab-preset]').forEach(button=>button.addEventListener('click',()=>{
    const preset=presets[button.dataset.labPreset];if(!preset)return;
    storeEditor();$('labGroup').value=byId.get(preset.id).group;
    $('labSource').value='all';populateMethods(preset.id);
    resetEditor(preset.code);
    $('labCode').focus();$('labCode').scrollIntoView({behavior:'smooth',block:'center'});
  }));
  $('labCopy').addEventListener('click',async()=>{
    try {
      if(navigator.clipboard && location.protocol !== 'file:') await navigator.clipboard.writeText($('labCode').value);
      else {const t=$('labCode');t.focus();t.select();if(!document.execCommand('copy'))throw Error('Brak dostępu');}
      markSaved('Kod skopiowany ✓');
    } catch { $('labCode').focus();$('labCode').select();markSaved('Zaznaczono kod — użyj Ctrl+C'); }
  });

  // Web Worker wykonuje kod bez możliwości modyfikowania DOM strony; można go zakończyć po limicie.
  function workerMain() {
    'use strict';
    function typeOf(value) {
      if(value===null)return 'null';
      if(Array.isArray(value))return 'Array';
      if(value instanceof Date)return 'Date';
      if(value instanceof Error)return 'Error';
      if(Number.isNaN(value))return 'Number (NaN)';
      return ({number:'Number',string:'String',boolean:'Boolean',undefined:'undefined',bigint:'BigInt',symbol:'Symbol',function:'Function',object:'Object'})[typeof value]||typeof value;
    }
    function format(value,seen=new WeakSet(),depth=0) {
      if(typeof value==='string')return JSON.stringify(value);
      if(typeof value==='number'||typeof value==='boolean'||typeof value==='bigint'||value===undefined||value===null)return String(value);
      if(typeof value==='symbol'||typeof value==='function')return String(value);
      if(depth>4)return '[…]';
      if(typeof value==='object') {
        if(seen.has(value))return '[cykliczne odwołanie]';
        seen.add(value);
        if(value instanceof Error)return value.name+': '+value.message;
        if(Array.isArray(value)){
          const array=value.slice(0,50).map(item=>format(item,seen,depth+1));
          return '['+array.join(', ')+(value.length>50?', …':'')+']';
        }
        if(value instanceof RegExp)return String(value);
        if(value instanceof Map)return 'Map '+format([...value.entries()].slice(0,50),seen,depth+1);
        if(value instanceof Set)return 'Set '+format([...value].slice(0,50),seen,depth+1);
        const entries=Object.entries(value).slice(0,35).map(([k,v])=>k+': '+format(v,seen,depth+1));
        return '{'+entries.join(', ')+(Object.keys(value).length>35?', …':'')+'}';
      }
      return String(value);
    }
    // Nie udostępniamy dostępu do sieci — to laboratorium operacji na Math/Array/String.
    self.fetch=()=>Promise.reject(Error('Dostęp do sieci jest wyłączony w laboratorium'));
    try { self.XMLHttpRequest=undefined;self.WebSocket=undefined;self.EventSource=undefined;self.importScripts=undefined;self.Worker=undefined; } catch {}
    self.onmessage=async event=>{
      if(!event.data||event.data.type!=='run')return;
      let messages=0;
      const emit=(kind,args)=>{
        if(messages++ >= 100) return;
        self.postMessage({type:'log',kind,text:args.map(arg=>format(arg)).join(' '),valueType:args.length===1?typeOf(args[0]):''});
      };
      // Globalny console jest przechwytywany również w funkcjach callback i w eval().
      self.console={log:(...xs)=>emit('log',xs),info:(...xs)=>emit('info',xs),warn:(...xs)=>emit('warn',xs),error:(...xs)=>emit('error',xs),table:(x)=>emit('log',[x])};
      try {
        const result=await (0,eval)(String(event.data.code));
        self.postMessage({type:'result',text:format(result),valueType:typeOf(result)});
      } catch(error) {
        self.postMessage({type:'exception',text:(error?.name||'Błąd')+': '+(error?.message||String(error))});
      }
    };
  }
  const WORKER_SCRIPT='('+workerMain.toString()+')();';
  let worker=null,timeout=null,runStarted=0;
  function appendOutput(kind,text,valueType) {
    const box=$('labOutput');
    const line=document.createElement('div');line.className='lab-output-line '+(kind==='result'?'result':kind==='error'||kind==='exception'?'error':kind==='info'?'info':'');
    const prefix=document.createElement('span');prefix.className='lab-output-prefix';prefix.textContent=kind==='result'?'↳':kind==='exception'?'✕':kind==='error'?'!': '›';
    const value=document.createElement('span');value.className='lab-output-value';value.textContent=String(text).slice(0,6000);
    line.append(prefix,value);
    if(valueType){const type=document.createElement('span');type.className='lab-value-type';type.textContent=valueType;line.append(type);}
    box.append(line);box.scrollTop=box.scrollHeight;
  }
  function setStatus(value,kind='') {
    $('labRunStatus').textContent=value;$('labRunStatus').className='lab-run-status '+kind;
  }
  function stopWorker(){if(timeout){clearTimeout(timeout);timeout=null;}if(worker){worker.terminate();worker=null;}$('labRun').disabled=false;}
  function renderRuns(){ $('labPracticeCount').textContent=String(Object.keys(state.practiced).length); }
  function run() {
    storeEditor();stopWorker();
    const code=$('labCode').value;
    $('labOutput').replaceChildren();
    if(!code.trim()){setStatus('Wpisz kod','error');appendOutput('info','Najpierw wpisz kod, np. Math.sqrt(25).');return;}
    if(code.length>20000){setStatus('Kod jest za długi','error');appendOutput('exception','Maksymalna długość to 20 000 znaków.');return;}
    setStatus('Uruchamianie…');$('labRun').disabled=true;
    try {
      const url=URL.createObjectURL(new Blob([WORKER_SCRIPT],{type:'application/javascript'}));
      worker=new Worker(url);URL.revokeObjectURL(url);
      const active=worker;const testedMethod=currentId;runStarted=performance.now();
      timeout=setTimeout(()=>{
        if(worker!==active)return;
        stopWorker();setStatus('Przekroczono 3 s','error');appendOutput('exception','Przekroczono limit 3 sekund. Sprawdź, czy kod nie zawiera nieskończonej pętli.');
      },3000);
      active.onmessage=event=>{
        if(worker!==active)return;
        const m=event.data||{};
        if(m.type==='log')appendOutput(m.kind,m.text,m.valueType);
        if(m.type==='result'){
          appendOutput('result',m.text,m.valueType);
          setStatus('Wykonano · '+Math.round(performance.now()-runStarted)+' ms','success');
          state.practiced[testedMethod]=true;state.runCount++;save();renderRuns();stopWorker();
        }
        if(m.type==='exception'){
          appendOutput('exception',m.text);setStatus('Błąd w kodzie','error');stopWorker();
        }
      };
      active.onerror=()=>{if(worker!==active)return;appendOutput('exception','Nie udało się uruchomić środowiska JavaScript.');setStatus('Błąd środowiska','error');stopWorker();};
      active.postMessage({type:'run',code});
    } catch(error) {
      stopWorker();setStatus('Worker niedostępny','error');
      appendOutput('exception','Ta przeglądarka zablokowała wykonywanie kodu. Spróbuj otworzyć stronę przez GitHub Pages lub serwer lokalny. '+(error?.message||''));
    }
  }
  $('labRun').addEventListener('click',run);
  $('labClear').addEventListener('click',()=>{
    $('labOutput').innerHTML='<p class="lab-output-empty">Wynik wyczyszczony. Kod w edytorze pozostał bez zmian.</p>';
    setStatus('Gotowe do uruchomienia');
  });
  document.addEventListener('visibilitychange',()=>{ if(document.hidden && worker){stopWorker();setStatus('Przerwano w tle');} });

  // Eksport i import postępów z ogólnego panelu teorii obsługuje app.js.
  window.addEventListener('klasa4i-lab-import',()=>{
    clearTimeout(writeTimer);stopWorker();state=load();currentId=state.activeId;
    $('labGroup').value=byId.get(currentId).group;$('labSource').value='all';populateMethods(currentId);renderRuns();
  });
  $('labGroup').value=byId.get(currentId).group;
  populateMethods(currentId);renderRuns();
})();
