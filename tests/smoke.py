"""Szybkie testy bez serwera. Uruchom: python tests/smoke.py (Playwright + Chromium)."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
MOCK_STORE="""<script>window.__testStore=window.__testStore||{};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return window.__testStore[k]??null},setItem(k,v){window.__testStore[k]=String(v)},removeItem(k){delete window.__testStore[k]}}});</script>"""
def inline(relative,styles,scripts):
    html=(ROOT/relative).read_text(encoding='utf-8')
    base=(ROOT/relative).parent
    for css in styles:
        html=html.replace(f'<link rel="stylesheet" href="{css}">',f'<style>{(base/css).read_text(encoding="utf-8")}</style>')
    code=MOCK_STORE
    for js in scripts:
        html=html.replace(f'<script src="{js}" defer></script>','').replace(f'<script defer src="{js}"></script>','')
        code+=f'<script>{(base/js).read_text(encoding="utf-8")}</script>'
    return html.replace('</body>',code+'</body>')

PORTAL=inline('index.html',['css/portal.css'],['subjects/catalog.js','js/portal.js'])
WEB=inline('subjects/witryny/index.html',['css/styles.css','css/extra.css'],['js/data.js','js/labs.js','js/app.js','js/pwa.js'])
TEMPLATE=inline('templates/nowy-przedmiot/index.html',['../../css/course-template.css'],['data.js','../../js/course-template.js'])

with sync_playwright() as p:
    from shutil import which
    browser=p.chromium.launch(headless=True,executable_path=which('chromium') or which('chromium-browser') or None,args=['--no-sandbox'])
    for width in (1440,390):
        ctx=browser.new_context(viewport={'width':width,'height':860})
        for label,html in [('portal',PORTAL),('witryny',WEB),('szablon',TEMPLATE)]:
            page=ctx.new_page()
            errors=[]
            page.on('pageerror', lambda error:errors.append(str(error)))
            page.set_content(html,wait_until='load')
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'),f'Przepełnienie w {label} na {width}px'
            if label=='portal':
                assert page.locator('.subject-card').count()==1
                assert 'Witryny internetowe' in page.locator('.subject-card').first.inner_text()
                page.locator('#subjectSearch').fill('PHP')
                assert page.locator('.subject-card').count()==1
                page.locator('#subjectSearch').fill('nie ma takiego przedmiotu')
                assert page.locator('.subject-card').count()==0 and page.locator('#searchEmpty').is_visible()
                page.locator('#themeToggle').click()
                assert page.locator('html').get_attribute('data-theme')=='light'
            if label=='witryny':
                assert page.locator('#app h1').count()>0
                assert page.locator('.course-back').count()==1
                page.evaluate("location.hash='#/lab'")
                page.wait_for_timeout(80)
                assert page.locator('#labEditor').count()==1
                page.evaluate("location.hash='#/quiz'")
                page.wait_for_timeout(50)
                page.locator('[data-mode="exam"]').click()
                page.locator('[data-start-quiz]').click()
                assert page.locator('#examClock').count()==1
            if label=='szablon':
                assert page.locator('#courseMain h1').count()>0
                page.evaluate("location.hash='#/lesson/lekcja-1'")
                page.wait_for_timeout(50)
                page.locator('[data-complete="lekcja-1"]').click()
                assert '1 / 1' in page.locator('#sideProgressNumber').inner_text()
                page.evaluate("location.hash='#/quiz'")
                page.wait_for_timeout(50)
                page.locator('[data-answer="0"]').click()
                assert page.locator('.feedback').count()==1
            assert not errors, f'{label} na {width}px: {errors}'
            page.close()
            print('PASS',label,width)
        ctx.close()
    browser.close()
