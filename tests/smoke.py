"""Testy UI dla platformy Klasa 4i. Uruchom: python tests/smoke.py."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from shutil import which

ROOT = Path(__file__).resolve().parents[1]
MOCK_STORE = """<script>
window.__testStore=window.__testStore||{};
Object.defineProperty(window,'localStorage',{configurable:true,value:{
 getItem(k){return window.__testStore[k]??null},
 setItem(k,v){window.__testStore[k]=String(v)},
 removeItem(k){delete window.__testStore[k]}
}});
</script>"""

MOCK_WORKER = r"""
const NativeURL = window.URL;
window.URL = class extends NativeURL { constructor(url, base) { super(url, base === 'about:blank' ? 'https://example.invalid/' : base); } };
window.Worker = class {
 constructor(){this.dead=false;setTimeout(()=>{if(!this.dead&&this.onmessage)this.onmessage({data:{type:'ready'}})},5);}
 postMessage(message){
  if(this.dead)return;
  setTimeout(()=>{
   if(this.dead||!this.onmessage)return;
   if(message.type==='views')this.onmessage({data:{type:'result',id:message.id,results:[],modified:0}});
   else if(message.type==='run')this.onmessage({data:{type:'result',id:message.id,results:[{columns:['wynik'],values:[[1]]}],modified:0}});
   else if(message.type==='reset')this.onmessage({data:{type:'reset-done',id:message.id}});
  },5);
 }
 terminate(){this.dead=true;}
};
"""

def inline(relative, styles, scripts):
    html = (ROOT/relative).read_text(encoding='utf-8')
    base = (ROOT/relative).parent
    for css in styles:
        html = html.replace(
            f'<link rel="stylesheet" href="{css}">',
            f'<style>{(base/css).read_text(encoding="utf-8")}</style>'
        )
    code = MOCK_STORE
    if relative.startswith('subjects/systemy-baz-danych/tematy/'):
        code += f'<script>{MOCK_WORKER}</script>'
    # Remove nonessential app icons/manifests from inline tests; all meaningful assets are inlined.
    import re
    html = re.sub(r'<link[^>]+(?:rel="icon"|rel="manifest")[^>]*>', '', html, flags=re.I)
    for js in scripts:
        html = html.replace(f'<script src="{js}" defer></script>', '')
        html = html.replace(f'<script defer src="{js}"></script>', '')
        code += f'<script>{(base/js).read_text(encoding="utf-8")}</script>'
    return html.replace('</body>', code+'</body>')

PORTAL = inline('index.html', ['css/portal.css'], [
    'subjects/catalog.js', 'subjects/witryny/tematy.js',
    'subjects/teoria-programowania/tematy.js', 'subjects/geografia/tematy.js',
    'subjects/systemy-baz-danych/tematy.js', 'js/portal.js'
])
TOPICS = inline('subjects/witryny/index.html', ['../../css/portal.css', 'css/topics.css'], ['tematy.js', 'js/topics.js'])
GEO_TOPICS = inline('subjects/geografia/index.html', ['../../css/portal.css', 'css/topics.css'], ['tematy.js', 'js/topics.js'])
SBD_TOPICS = inline('subjects/systemy-baz-danych/index.html', ['../../css/portal.css', 'css/topics.css'], ['tematy.js', 'js/topics.js'])
WEB = inline('subjects/witryny/tematy/protokoly-http-https-i-aplikacje-internetowe/index.html',
             ['../../css/styles.css', '../../css/extra.css'],
             ['../../js/data.js', '../../js/labs.js', '../../js/app.js', '../../js/pwa.js'])
THEORY_TOPICS = inline('subjects/teoria-programowania/index.html', ['../../css/portal.css', 'css/topics.css'], ['tematy.js', 'js/topics.js'])
THEORY = inline('subjects/teoria-programowania/tematy/metody-math-array-string/index.html',
                ['../../../../css/portal.css', 'css/methods.css'], ['js/methods.js', 'js/app.js'])
JS_RESOURCE = inline('subjects/teoria-programowania/tematy/javascript-pelna-notatka/index.html',
                     ['../../../../css/portal.css', '../metody-math-array-string/css/methods.css', 'css/resource.css'],
                     ['js/resource.js'])
# Do not launch Chromium's built-in PDF viewer during the UI smoke test.
# The real file links are checked in check_static.py; here only the preview switch is tested.
JS_RESOURCE = JS_RESOURCE.replace(
    'src="../../../../assets/pdf/notatka-javascript-pelna.pdf#view=FitH"',
    'src="about:blank"'
)
JS_RESOURCE = JS_RESOURCE.replace(
    'data-preview-pdf="../../../../assets/pdf/notatka-javascript-podstawowa.pdf"',
    'data-preview-pdf="about:blank?note=basic"'
).replace(
    'data-preview-pdf="../../../../assets/pdf/notatka-javascript-pelna.pdf"',
    'data-preview-pdf="about:blank?note=expanded"'
)
GEO = inline('subjects/geografia/tematy/rolnictwo-na-swiecie/index.html',
             ['../../../../css/course-template.css'], ['data.js', '../../../../js/course-template.js'])
SBD = inline('subjects/systemy-baz-danych/tematy/zapytania-zagniezdzone-zlaczenia-widoki/index.html',
             ['../../../../css/course-template.css', 'css/sbd.css'], ['data.js', 'js/app.js'])



with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=which('chromium') or which('chromium-browser') or None,
                                args=['--no-sandbox'])
    pages = [
        ('portal', PORTAL), ('witryny-tematy', TOPICS), ('geografia-tematy', GEO_TOPICS),
        ('sbd-tematy', SBD_TOPICS), ('witryny', WEB), ('teoria-tematy', THEORY_TOPICS),
        ('metody', THEORY), ('javascript-resource', JS_RESOURCE), ('geografia', GEO), ('sbd', SBD)
    ]
    for width in (1440, 390):
        ctx = browser.new_context(viewport={'width': width, 'height': 860})
        for label, html in pages:
            page = ctx.new_page()
            if label == 'sbd':
                pass
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.set_content(html, wait_until='domcontentloaded')
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), f'Overflow {label} at {width}px'
            if label == 'portal':
                assert page.locator('.subject-card').count() == 4
                for name in ['Witryny i aplikacje internetowe', 'Teoria programowania', 'Geografia', 'Systemy baz danych']:
                    assert name in page.locator('.subjects-grid').inner_text()
                page.locator('#subjectSearch').fill('Geografia')
                assert page.locator('.subject-card').count() == 1
            if label == 'witryny-tematy':
                assert page.locator('.topic-card').count() == 1
                assert 'Protokoły HTTP/HTTPS i aplikacje internetowe' in page.locator('.topic-card').first.inner_text()
            if label == 'geografia-tematy':
                assert page.locator('.topic-card').count() == 1
                assert 'Rolnictwo na świecie' in page.locator('.topic-card').first.inner_text()
                assert page.locator('.topic-card').first.get_attribute('href') == 'tematy/rolnictwo-na-swiecie/index.html'
            if label == 'sbd-tematy':
                assert page.locator('.topic-card').count() == 1
                assert 'Zapytania zagnieżdżone, złączenia, widoki' in page.locator('.topic-card').first.inner_text()
                assert 'laboratorium SQL' in page.locator('.topic-card').first.inner_text()
            if label == 'witryny':
                assert page.locator('#app h1').count() > 0
                page.evaluate("location.hash='#/quiz'")
                page.wait_for_timeout(30)
                page.locator('[data-mode="exam"]').click()
                page.locator('[data-start-quiz]').click()
                assert page.locator('#examClock').count() == 1
            if label == 'teoria-tematy':
                assert page.locator('.topic-card').count() == 2
                assert 'Metody obiektów: Math, Array, String' in page.locator('.topic-card').first.inner_text()
                assert 'JavaScript — notatki: podstawowa i rozszerzona' in page.locator('.topic-card').nth(1).inner_text()
                assert page.locator('.topic-card').nth(1).get_attribute('href') == 'tematy/javascript-pelna-notatka/index.html'
                assert 'Podstawowa · 13 stron' in page.locator('.topic-card').nth(1).inner_text()
                assert 'Rozszerzona · 46 stron' in page.locator('.topic-card').nth(1).inner_text()
                assert '59 stron' in page.locator('.topic-card').nth(1).inner_text()
            if label == 'metody':
                assert page.locator('#allCount').inner_text() == '109'
                page.evaluate("document.querySelector('[data-view=\"lab\"]').click()")
                page.wait_for_timeout(40)
                assert page.locator('#labCode').count() == 1
            if label == 'javascript-resource':
                assert page.locator('h1').inner_text().replace('\n', ' ') == 'JavaScript: dwie wersje notatki.'
                assert page.locator('a[download]').count() == 4
                assert page.locator('iframe[title=\"Podgląd rozszerzonej notatki JavaScript — 46 stron\"]').count() == 1
                assert page.locator('a[href^=\"https://www.w3schools.com/js/\"]').count() >= 7
                assert page.locator('a[download]').nth(0).get_attribute('href') == '../../../../assets/pdf/notatka-javascript-podstawowa.pdf'
                assert page.locator('a[download]').nth(1).get_attribute('href') == '../../../../assets/dokumenty/notatka-javascript-podstawowa.docx'
                assert page.locator('a[download]').nth(2).get_attribute('href') == '../../../../assets/pdf/notatka-javascript-pelna.pdf'
                assert page.locator('a[download]').nth(3).get_attribute('href') == '../../../../assets/dokumenty/notatka-javascript-pelna.docx'
                page.locator('.resource-version-preview').first.click()
                assert page.locator('#notePreviewFrame').get_attribute('src').endswith('about:blank?note=basic#view=FitH')
                assert page.locator('.resource-preview-switch button').first.get_attribute('aria-pressed') == 'true'
                assert page.locator('.resource-preview-switch button').nth(1).get_attribute('aria-pressed') == 'false'
                page.locator('.resource-preview-switch button').nth(1).click()
                assert page.locator('#notePreviewFrame').get_attribute('src').endswith('about:blank?note=expanded#view=FitH')
            if label == 'geografia':
                assert page.locator('#courseMain h1').count() > 0
                assert 'Rolnictwo na świecie' in page.locator('#courseMain').inner_text()
                assert page.locator('.download-button').count() == 1
                assert 'Pobierz' in page.locator('.download-button').first.inner_text()
                assert page.locator('.download-preview').count() == 1
                assert page.locator('.download-button').first.get_attribute('href') == '../../../../assets/pdf/notatki-geografia-rolnictwo-i-lesnictwo.pdf'
                assert page.locator('.download-button').first.get_attribute('download') == 'notatki-geografia-rolnictwo-i-lesnictwo.pdf'
                page.evaluate("location.hash='#/lessons'")
                page.wait_for_timeout(30)
                assert page.locator('.lesson-row').count() == 12
                page.locator('[href="#/lesson/typy-rolnictwa"]').click()
                page.wait_for_selector('.article h1')
                assert page.locator('.article h1').count() == 1
                page.locator('[data-complete="typy-rolnictwa"]').click()
                assert '1 / 12' in page.locator('#sideProgressNumber').inner_text()
            if label == 'sbd':
                assert page.locator('#courseMain h1').count() > 0
                assert 'Zapytania SQL bez zgadywania' in page.locator('#courseMain').inner_text()
                assert page.locator('.download-button').count() == 1
                assert 'Pobierz' in page.locator('.download-button').first.inner_text()
                assert page.locator('.download-preview').count() == 1
                assert page.locator('.download-button').first.get_attribute('href') == '../../../../assets/pdf/notatki-systemy-baz-danych.pdf'
                assert page.locator('.download-button').first.get_attribute('download') == 'notatki-systemy-baz-danych.pdf'
                page.evaluate("location.hash='#/lab'")
                page.wait_for_timeout(40)
                assert page.locator('#sqlEditor').count() == 1
                page.wait_for_function("document.querySelector('#sqlEnginePill')?.classList.contains('ready')")
                page.locator('#sqlPreset').select_option('0')
                page.locator('#runSql').click()
                page.wait_for_function("document.querySelector('#sqlResultMeta')?.innerText.includes('wiersz')")
                assert 'wynik' in page.locator('#sqlResult').inner_text()
                page.locator('#resetDatabase').click()
                page.wait_for_timeout(30)
            assert not errors, f'{label} at {width}px: {errors}'
            page.close()
            print('PASS', label, width)
        ctx.close()
    browser.close()
