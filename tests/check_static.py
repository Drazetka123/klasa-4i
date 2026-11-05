from pathlib import Path
from bs4 import BeautifulSoup
import re, subprocess, json, sqlite3

root = Path(__file__).resolve().parents[1]

# Every local CSS, JS and navigation link must point to a real file/directory.
for file in root.rglob('*.html'):
    doc = BeautifulSoup(file.read_text(encoding='utf-8'), 'html.parser')
    for tag, attr in [('link', 'href'), ('script', 'src')]:
        for element in doc.find_all(tag):
            target = element.get(attr, '')
            if not target or target.startswith(('http:', 'https:', '#', 'data:', 'mailto:')):
                continue
            target = target.split('?')[0].split('#')[0]
            if not (file.parent / target).exists():
                raise AssertionError(f'{file}: MISSING {target}')
    for a in doc.find_all('a', href=True):
        target = a['href']
        if target.startswith(('#', 'http:', 'https:', 'mailto:', 'tel:')):
            continue
        relative = target.split('?')[0].split('#')[0]
        if not relative:
            continue
        if not (file.parent / relative).exists():
            raise AssertionError(f'{file}: BAD LINK {target}')
print('PASS internal file paths')

# All authored JavaScript must parse.
for js in root.rglob('*.js'):
    result = subprocess.run(['node', '--check', str(js)], capture_output=True, text=True)
    if result.returncode:
        raise AssertionError(f'{js}: {result.stderr}')
print('PASS JS syntax')

# Existing JavaScript-method course remains intact.
methods_path = root/'subjects'/'teoria-programowania'/'tematy'/'metody-math-array-string'/'js'/'methods.js'
src = methods_path.read_text(encoding='utf-8')
methods = json.loads(re.search(r'window.KLASA4I_METHODS = (\[.*\]);', src, re.S).group(1))
assert len(methods) == 109
assert [sum(m['group'] == g for m in methods) for g in ['Math', 'Array', 'String']] == [34, 40, 35]
assert len([m for m in methods if m['source'] == 'lekcja']) == 66
assert all(all(m.get(k) for k in ['id', 'description', 'arguments', 'returns', 'example']) for m in methods)
assert len(set(m['id'] for m in methods)) == len(methods)
print('PASS 109 methods, argument types and examples')

# Ensure main catalogue includes all four current subjects and their topic lists are loaded.
catalog = (root/'subjects'/'catalog.js').read_text(encoding='utf-8')
for subject_id in ['witryny', 'teoria-programowania', 'geografia', 'systemy-baz-danych']:
    assert f"id: '{subject_id}'" in catalog
home = (root/'index.html').read_text(encoding='utf-8')
for rel in ['subjects/geografia/tematy.js', 'subjects/systemy-baz-danych/tematy.js']:
    assert f'src="{rel}"' in home

# Geography course: content stays grounded in the user's PDF and contains all four parts.
geo_dir = root/'subjects'/'geografia'/'tematy'/'rolnictwo-na-swiecie'
geo_raw = (geo_dir/'data.js').read_text(encoding='utf-8')
geo = json.loads(re.search(r'window.CLASS4I_COURSE = (\{.*\});', geo_raw, re.S).group(1))
assert len(geo['lessons']) == 12
assert len(geo['flashcards']) == 36 and len(geo['questions']) == 24
geo_titles = [lesson['title'] for lesson in geo['lessons']]
for expected in ['Czynniki rozwoju rolnictwa', 'Ryż — wymagania i sposoby uprawy',
                 'Kody chowu kur na jajach', 'Rodzaje lasów na świecie']:
    assert expected in geo_titles
assert geo['storageKey'] == 'klasa4i-geografia-rolnictwo-v1'
assert len(geo.get('resources', [])) == 1 and geo['resources'][0]['filename'].endswith('.pdf')
assert (root/'assets/pdf/notatki-geografia-rolnictwo-i-lesnictwo.pdf').is_file()
print('PASS geography topic: 12 lessons, 36 flashcards, 24 questions')

# SBD course and SQL lab: all notes, schemas, presets and dedicated worker.
sbd_dir = root/'subjects'/'systemy-baz-danych'/'tematy'/'zapytania-zagniezdzone-zlaczenia-widoki'
sbd_raw = (sbd_dir/'data.js').read_text(encoding='utf-8')
sbd = json.loads(re.search(r'window.CLASS4I_COURSE = (\{.*\});', sbd_raw, re.S).group(1))
assert len(sbd['lessons']) == 5
assert len(sbd['flashcards']) == 24 and len(sbd['questions']) == 20
assert len(sbd['tables']) == 8 and len(sbd['sqlPresets']) >= 18
assert (sbd_dir/'js/sql-worker.js').is_file()
assert 'CREATE OR REPLACE VIEW' in sbd['sqlPresets'][-3]['sql'] or any('CREATE OR REPLACE VIEW' in x['sql'] for x in sbd['sqlPresets'])
assert sbd['storageKey'] == 'klasa4i-sbd-zapytania-join-widoki-v1'
assert len(sbd.get('resources', [])) == 1 and sbd['resources'][0]['filename'].endswith('.pdf')
assert (root/'assets/pdf/notatki-systemy-baz-danych.pdf').is_file()
print('PASS SBD topic: 5 lessons, 24 flashcards, 20 questions, 8 tables, SQL lab')

# Exercise all supplied SQL presets using the local SQLite engine equivalent.
db = sqlite3.connect(':memory:')
db.executescript(sbd['sqlSeed'])
for preset in sbd['sqlPresets']:
    sql = re.sub(
        r'\bCREATE\s+OR\s+REPLACE\s+VIEW\s+([A-Za-z_][A-Za-z0-9_]*)\s+AS',
        lambda m: f'DROP VIEW IF EXISTS "{m.group(1)}"; CREATE VIEW "{m.group(1)}" AS',
        preset['sql'], flags=re.I
    )
    last = None
    for statement in [part.strip() for part in sql.split(';') if part.strip()]:
        cursor = db.execute(statement)
        if cursor.description:
            last = cursor.fetchall()
    if preset['id'] == 'inner':
        assert len(last) == 2
    if preset['id'] == 'left':
        assert len(last) == 5
    if preset['id'] == 'full':
        assert len(last) == 8
    if preset['id'] == 'cross':
        assert len(last) == 25
print('PASS all SQL presets execute; INNER=2, LEFT=5, FULL=8, CROSS=25')

# Offline cache, preserved learning storage keys and required assets.
sw = (root/'sw.js').read_text(encoding='utf-8')
assert 'klasa4i-v9-sql-fallback-20261105' in sw
core_block = re.search(r'const CORE = \[(.*?)\];', sw, re.S).group(1)
core_assets = re.findall(r"'([^']+)'", core_block)
for asset in core_assets:
    if asset in ['./', './index.html']:
        continue
    assert (root/asset.removeprefix('./')).exists(), f'MISSING service-worker asset: {asset}'
for asset in [
    'subjects/geografia/tematy/rolnictwo-na-swiecie/data.js',
    'subjects/systemy-baz-danych/tematy/zapytania-zagniezdzone-zlaczenia-widoki/js/sql-worker.js',
    'subjects/systemy-baz-danych/tematy/zapytania-zagniezdzone-zlaczenia-widoki/css/sbd.css',
    'assets/pdf/notatki-geografia-rolnictwo-i-lesnictwo.pdf',
    'assets/pdf/notatki-systemy-baz-danych.pdf'
]:
    assert asset in sw
sql_worker = (root/'subjects'/'systemy-baz-danych'/'tematy'/'zapytania-zagniezdzone-zlaczenia-widoki'/'js'/'sql-worker.js').read_text(encoding='utf-8')
for fallback in ['cdn.jsdelivr.net/npm/sql.js@1.15.2', 'cdnjs.cloudflare.com/ajax/libs/sql.js/1.15.2', 'unpkg.com/sql.js@1.15.2']:
    assert fallback in sql_worker
assert 'retrySqlEngine' in (root/'subjects'/'systemy-baz-danych'/'tematy'/'zapytania-zagniezdzone-zlaczenia-widoki'/'js'/'app.js').read_text(encoding='utf-8')
theory_app = (root/'subjects'/'teoria-programowania'/'tematy'/'metody-math-array-string'/'js'/'app.js').read_text(encoding='utf-8')
witryny_data = (root/'subjects'/'witryny'/'js'/'app.js').read_text(encoding='utf-8')
assert 'klasa4i-teoria-metody-v1' in theory_app
assert 'witryny-lab-v1' in witryny_data
print('PASS offline files + existing progress keys unchanged')
