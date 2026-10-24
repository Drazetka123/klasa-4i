from pathlib import Path
from bs4 import BeautifulSoup
import re, subprocess, json
root=Path(__file__).resolve().parents[1]
for file in root.rglob('*.html'):
 doc=BeautifulSoup(file.read_text(encoding='utf-8'),'html.parser')
 for tag,attr in [('link','href'),('script','src')]:
  for element in doc.find_all(tag):
   target=element.get(attr,'')
   if not target or target.startswith(('http:','https:','#','data:','mailto:')):continue
   target=target.split('?')[0].split('#')[0]
   if not (file.parent/target).exists(): raise AssertionError(f'{file}: MISSING {target}')
 for a in doc.find_all('a',href=True):
  target=a['href']
  if target.startswith(('#','http:','https:','mailto:')):continue
  relative=target.split('?')[0].split('#')[0]
  if not (file.parent/relative).exists(): raise AssertionError(f'{file}: BAD LINK {target}')
print('PASS internal file paths')
for js in root.rglob('*.js'):
 result=subprocess.run(['node','--check',str(js)],capture_output=True,text=True)
 if result.returncode: raise AssertionError(f'{js}: {result.stderr}')
print('PASS JS syntax')
src=(root/'subjects'/'teoria-programowania'/'tematy'/'metody-math-array-string'/'js'/'methods.js').read_text()
methods=json.loads(re.search(r'window.KLASA4I_METHODS = (\[.*\]);',src,re.S).group(1))
assert len(methods)==109
assert [sum(m['group']==g for m in methods) for g in ['Math','Array','String']]==[34,40,35]
assert len([m for m in methods if m['source']=='lekcja'])==66
assert all(all(m.get(k) for k in ['id','description','arguments','returns','example']) for m in methods)
assert len(set(m['id'] for m in methods))==len(methods)
print('PASS 109 records, argument types & examples')
