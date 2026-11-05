const fs = require('fs');
const vm = require('vm');
const path = require('path');
const workerPath = path.join(__dirname, '../subjects/systemy-baz-danych/tematy/zapytania-zagniezdzone-zlaczenia-widoki/js/sql-worker.js');
const code = fs.readFileSync(workerPath, 'utf8');
const attempted = [];
const messages = [];
const context = {
  URL,
  Promise,
  Map,
  String,
  Error,
  self: {
    postMessage(message) { messages.push(message); }
  },
  importScripts(url) {
    attempted.push(url);
    if (url.includes('/vendor/sqljs/')) throw new Error('local cache miss');
    if (url.includes('cdnjs.cloudflare.com')) throw new Error('CDN blocked');
    if (url.includes('cdn.jsdelivr.net')) {
      context.self.initSqlJs = async config => {
        if (!config.locateFile('sql-wasm.wasm').includes('cdn.jsdelivr.net')) throw new Error('wrong WASM source');
        return { Database: class { run() {} close() {} exec() { return []; } getRowsModified() { return 0; } } };
      };
      return;
    }
    throw new Error('unexpected source');
  }
};
vm.createContext(context);
vm.runInContext(code, context);
(async () => {
  await context.self.onmessage({ data: { type: 'init', localBase: 'https://example.github.io/repo/vendor/sqljs/', seed: '' } });
  if (!messages.some(message => message.type === 'ready')) throw new Error('Worker did not become ready');
  if (!attempted.some(url => url.includes('cdn.jsdelivr.net/npm/sql.js@1.15.2'))) throw new Error('jsDelivr fallback was not attempted');
  console.log('PASS SQL worker falls back from local cache and cdnjs to jsDelivr');
})().catch(error => { console.error(error); process.exitCode = 1; });
