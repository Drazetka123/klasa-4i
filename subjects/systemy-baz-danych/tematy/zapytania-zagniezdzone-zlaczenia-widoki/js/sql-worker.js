/* SQL.js worker: kwerendy działają poza głównym wątkiem strony. */
'use strict';

let db = null;
let SQL = null;
let wasmLocal = '';
const CDN_BASES = [
  'https://cdn.jsdelivr.net/npm/sql.js@1.15.2/dist/',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.15.2/',
  'https://unpkg.com/sql.js@1.15.2/dist/',
  // Zapasowa, sprawdzona wersja, gdyby najnowsze pliki nie były dostępne na CDN.
  'https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.14.2/'
];

async function loadSqlEngine() {
  const sources = [...(wasmLocal ? [wasmLocal] : []), ...CDN_BASES];
  const failures = [];

  for (const base of sources) {
    try {
      if (typeof self.initSqlJs !== 'function') {
        importScripts(new URL('sql-wasm.js', base).href);
      }
      if (typeof self.initSqlJs !== 'function') {
        throw new Error('Plik sql-wasm.js nie udostępnił funkcji initSqlJs.');
      }

      const module = await self.initSqlJs({
        locateFile: file => new URL(file, base).href
      });
      if (!module || typeof module.Database !== 'function') {
        throw new Error('Biblioteka SQL.js załadowała się niepoprawnie.');
      }
      return module;
    } catch (error) {
      failures.push(`${base} — ${error && error.message ? error.message : String(error)}`);
    }
  }

  throw new Error(
    'Nie udało się pobrać silnika SQLite z żadnego dostępnego źródła. ' +
    'Sprawdź połączenie z Internetem lub ustawienia sieci. Szczegóły: ' +
    failures.join(' | ')
  );
}

async function createDatabase(seed) {
  if (!SQL) SQL = await loadSqlEngine();
  if (db) {
    try { db.close(); } catch {}
  }
  db = new SQL.Database();
  db.run(seed || '');
}

function compatibleSql(sql) {
  // SQLite nie ma CREATE OR REPLACE VIEW; zachowujemy efekt polecenia z notatek.
  return String(sql).replace(
    /\bCREATE\s+OR\s+REPLACE\s+VIEW\s+([A-Za-z_][A-Za-z0-9_]*)\s+AS/gi,
    (_match, name) => `DROP VIEW IF EXISTS "${name}"; CREATE VIEW "${name}" AS`
  );
}

self.onmessage = async event => {
  const message = event.data || {};
  const id = message.id;
  try {
    if (message.type === 'init') {
      wasmLocal = message.localBase || '';
      await createDatabase(message.seed);
      self.postMessage({ type: 'ready' });
      return;
    }
    if (!db) throw new Error('Baza danych nie została jeszcze uruchomiona.');
    if (message.type === 'run') {
      const results = db.exec(compatibleSql(message.sql || ''));
      self.postMessage({ type: 'result', id, results, modified: db.getRowsModified() });
      return;
    }
    if (message.type === 'views') {
      const results = db.exec("SELECT name FROM sqlite_master WHERE type='view' ORDER BY name");
      self.postMessage({ type: 'result', id, results, modified: 0 });
      return;
    }
    if (message.type === 'reset') {
      await createDatabase(message.seed);
      self.postMessage({ type: 'reset-done', id });
      return;
    }
    throw new Error('Nieznana operacja laboratorium SQL.');
  } catch (error) {
    self.postMessage({
      type: id ? 'query-error' : 'init-error',
      id,
      error: String(error && error.message ? error.message : error)
    });
  }
};
