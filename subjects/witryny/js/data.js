const MODULES = [
  {id:'podstawy',title:'Internet i WWW',label:'Fundamenty',icon:'🌐',color:'#72dbc3',description:'Zrozum, jak działa sieć, co to WWW i z czego składa się adres.'},
  {id:'frontend',title:'Front-end',label:'Interfejsy',icon:'⌘',color:'#97b0ff',description:'HTML, CSS, JavaScript i zasoby, z których powstają strony.'},
  {id:'ux',title:'UX / UI i WCAG',label:'Projektowanie',icon:'◈',color:'#f7ba81',description:'Twórz czytelne, intuicyjne i dostępne interfejsy.'},
  {id:'backend',title:'Back-end i dane',label:'Logika serwera',icon:'⚙',color:'#d5adff',description:'PHP, SQL, Apache i strategie renderowania.'},
  {id:'architektura',title:'Architektura i bezpieczeństwo',label:'Zaawansowane',icon:'⛨',color:'#eea7bd',description:'Skalowanie, zabezpieczenia oraz liczenie obciążenia.'}
];
const LESSONS = [
 {id:'internet-www',module:'podstawy',title:'Internet ≠ World Wide Web',mins:5,summary:'Najważniejsze rozróżnienie, od którego zaczyna się cały temat.',blocks:[
  {type:'p',text:'**Internet** to globalna infrastruktura łącząca urządzenia: przewody, routery, serwery i protokoły. **WWW** to tylko jedna z usług działających w Internecie — system połączonych hiperłączami dokumentów oglądanych w przeglądarce.'},
  {type:'compare',headers:['Internet','World Wide Web (WWW)'],rows:[['Sieć komputerowa i jej infrastruktura','Usługa działająca w Internecie'],['Obsługuje też e-mail, komunikatory i FTP','Łączy strony poprzez hiperłącza'],['Umożliwia transmisję danych','Korzysta z URL i przeglądarek']]},
  {type:'callout',title:'Zapamiętaj w 5 sekund',text:'Internet to **drogi i infrastruktura**, a WWW to **jedna z usług**, które po tych drogach działają.'}
 ]},
 {id:'historia',module:'podstawy',title:'Jak powstało WWW?',mins:4,summary:'Od pomysłu Tima Bernersa-Lee po współczesne aplikacje.',blocks:[
  {type:'timeline',items:[['1989','Tim Berners-Lee w CERN przedstawia koncepcję WWW.'],['1990','Powstają pierwszy serwer WWW i pierwsza przeglądarka.'],['1991','Pierwsza strona internetowa staje się publicznie dostępna.'],['1993','Mosaic popularyzuje przeglądanie WWW.'],['2004+','Web 2.0: społeczności i treści tworzone przez użytkowników.'],['Obecnie','Rozbudowane aplikacje webowe działają w przeglądarce.']]},
  {type:'callout',title:'Częste pytanie',text:'Pierwszy pomysł to **1989**, pierwszy serwer i przeglądarka to **1990**, publiczny debiut WWW to **1991**.'}
 ]},
 {id:'klasyfikacja',module:'podstawy',title:'Strona, witryna, serwis czy aplikacja?',mins:7,summary:'Podobne słowa, ale zupełnie inny zakres funkcji.',blocks:[
  {type:'compare',headers:['Typ','Co oznacza','Przykład'],rows:[['Strona internetowa','Jeden dokument HTML pod jednym URL','Pojedynczy plik .html'],['Witryna internetowa','Kilka powiązanych stron w jednej domenie','Blog, strona szkoły'],['Serwis internetowy','Rozbudowana witryna z usługami i interakcją','Sklep, forum, portal aukcyjny'],['Aplikacja internetowa','Program wykonujący złożone zadania w przeglądarce','Poczta online, edytor dokumentów']]},
  {type:'grid',items:[['Portal','Rozbudowany serwis zbierający różne treści i usługi w jednym miejscu.'],['Wortal','Portal wyspecjalizowany w określonej dziedzinie — dla konkretnej grupy.'],['Intranet','Prywatna sieć organizacji oparta na technologiach internetowych.']]},
  {type:'callout',title:'Ważny niuans',text:'Im dalej od strony do aplikacji, tym **większa interaktywność**, rola kont użytkowników i potrzeba przechowywania danych.'}
 ]},
 {id:'url',module:'podstawy',title:'Budowa URL i DNS',mins:6,summary:'Rozłóż adres internetowy na części i poznaj rolę DNS.',blocks:[
  {type:'p',text:'Adres URL identyfikuje zasób w sieci. DNS tłumaczy czytelne nazwy domen na adresy IP potrzebne do komunikacji.'},
  {type:'url'},
  {type:'grid',items:[['DNS','„Książka telefoniczna” sieci: domena → adres IP.'],['IPv4 i IPv6','Dwa standardy adresowania urządzeń w sieci.'],['Klient–serwer','Przeglądarka wysyła żądanie, serwer odsyła odpowiedź.']]},
  {type:'callout',title:'Uważaj na domenę',text:'W przykładzie **technikum.edu.pl** końcówką TLD jest **.pl**, a „technikum.edu” jest częścią nazwy przed TLD. Domena może mieć wiele poziomów.'}
 ]},
 {id:'protokoly',module:'podstawy',title:'Hosting, serwery i protokoły',mins:6,summary:'Co utrzymuje stronę w sieci i jak przesyłane są dane?',blocks:[
  {type:'grid',items:[['Hosting','Miejsce i zasoby serwera dostępne przez całą dobę.'],['VPS','Wirtualny serwer z wydzielonymi zasobami.'],['Serwer dedykowany','Fizyczny serwer do dyspozycji jednego klienta.'],['Hosting chmurowy','Zasoby udostępniane w infrastrukturze chmurowej.'],['Apache / nginx','Oprogramowanie serwera WWW obsługujące żądania HTTP.'],['FTP','Protokół przesyłania plików.']]},
  {type:'compare',headers:['Protokół','Zadanie'],rows:[['HTTP','Przesyłanie żądań i odpowiedzi WWW bez szyfrowania transmisji'],['HTTPS','HTTP chronione szyfrowaniem TLS'],['SMTP','Wysyłanie poczty'],['POP3 / IMAP','Odbieranie poczty']]},
  {type:'p',text:'**VPN** tworzy szyfrowany tunel komunikacyjny. Nie należy go mylić z HTTPS — chronią inne odcinki i aspekty połączenia.'}
 ]},
 {id:'html',module:'frontend',title:'HTML5 i znaczniki semantyczne',mins:7,summary:'HTML odpowiada za strukturę oraz znaczenie elementów.',blocks:[
  {type:'p',text:'**HTML** określa strukturę strony, **CSS** jej wygląd, a **JavaScript** zachowanie. Deklaracja `<!DOCTYPE html>` uruchamia standardowy tryb interpretacji HTML.'},
  {type:'code',lang:'html',code:'<!DOCTYPE html>\n<html lang="pl">\n  <head><meta charset="UTF-8"></head>\n  <body>\n    <header>Logo i nagłówek</header>\n    <nav>Nawigacja</nav>\n    <main>\n      <article>Samodzielny artykuł</article>\n      <aside>Treści dodatkowe</aside>\n    </main>\n    <footer>Stopka</footer>\n  </body>\n</html>'},
  {type:'grid',items:[['header','Nagłówek strony lub sekcji'],['nav','Nawigacja'],['main','Główna zawartość'],['section','Sekcja tematyczna'],['article','Samodzielny artykuł'],['aside','Panel boczny / uzupełnienie'],['footer','Stopka']]},
  {type:'callout',title:'Na sprawdzian',text:'Znacznik semantyczny opisuje **rolę treści**, a nie tylko jej wygląd.'}
 ]},
 {id:'formularze',module:'frontend',title:'Formularze i API HTML5',mins:7,summary:'Walidacja, pamięć przeglądarki i wbudowane możliwości WWW.',blocks:[
  {type:'p',text:'Pola formularzy mogą mieć typy: `email`, `url`, `date`, `number`, `range`, `color`. Atrybuty `required`, `placeholder`, `autofocus`, `pattern` pomagają sterować formularzem i weryfikować dane.'},
  {type:'code',lang:'html',code:'<form>\n  <label for="email">E-mail</label>\n  <input id="email" type="email" required\n         placeholder="adres@przyklad.pl">\n  <button type="submit">Wyślij</button>\n</form>'},
  {type:'compare',headers:['API','Do czego służy'],rows:[['localStorage','Przechowywanie danych także po zamknięciu przeglądarki'],['sessionStorage','Dane w obrębie sesji karty'],['Geolocation API','Pobieranie lokalizacji za zgodą użytkownika'],['Drag & Drop','Przeciąganie elementów'],['Canvas','Rysowanie grafiki 2D przy pomocy JS'],['History API','Kontrola historii nawigacji'],['Fullscreen API','Tryb pełnoekranowy'],['Web Workers','Wykonywanie skryptów poza głównym wątkiem interfejsu']]}
 ]},
 {id:'css',module:'frontend',title:'CSS: selektory i Box Model',mins:7,summary:'Kolory, odstępy, priorytet reguł i struktura pudełkowa.',blocks:[
  {type:'p',text:'CSS opisuje wygląd HTML. Style mogą być **inline** (atrybut `style`), **wewnętrzne** (tag `<style>`) lub **zewnętrzne** (osobny plik `.css`).'},
  {type:'code',lang:'css',code:':root { --kolor: #1f4e9c; }\np { color: var(--kolor); }       /* element */\n.karta { padding: 16px; }      /* klasa */\n#naglowek { margin: 8px; }     /* identyfikator */\nbutton:hover { opacity: .8; }  /* pseudoklasa */'},
  {type:'boxmodel'},
  {type:'p',text:'W kaskadzie znaczenie mają m.in. **specyficzność selektorów**, kolejność reguł i deklaracje `!important`. Spotkasz też selektory atrybutów, potomków, pseudoklasy i pseudoelementy.'}
 ]},
 {id:'rwd',module:'frontend',title:'Flexbox, Grid i RWD',mins:6,summary:'Dobrze wyglądająca strona na telefonie i komputerze.',blocks:[
  {type:'compare',headers:['Technika','Zastosowanie'],rows:[['Flexbox','Układ jednowymiarowy — wiersz LUB kolumna'],['CSS Grid','Układ dwuwymiarowy — wiersze ORAZ kolumny'],['Media Queries','Zmiana reguł zależnie od rozmiaru i cech ekranu'],['Breakpoint','Punkt graniczny, przy którym zmienia się układ']]},
  {type:'code',lang:'css',code:'.menu { display: flex; gap: 12px; }\n.karty { display: grid; grid-template-columns: repeat(3, 1fr); }\n@media (max-width: 768px) {\n  .karty { grid-template-columns: 1fr; }\n}'},
  {type:'p',text:'CSS pozwala też na `transition`, animacje `@keyframes`, transformacje `rotate()` i `scale()` oraz zmienne deklarowane w `:root`.'},
  {type:'callout',title:'Prosty wybór',text:'Elementy w jednym rzędzie? **Flexbox**. Równoczesna kontrola kolumn i rzędów? **Grid**.'}
 ]},
 {id:'js',module:'frontend',title:'JavaScript i DOM',mins:8,summary:'Spraw, żeby przyciski, formularze i treści reagowały.',blocks:[
  {type:'p',text:'**JavaScript** odpowiada za logikę kliencką. Wykorzystuje zmienne `let`, `const`, starsze `var`; typy `number`, `string`, `boolean`, tablice i obiekty; instrukcje `if/else` oraz pętle.'},
  {type:'code',lang:'javascript',code:'const przycisk = document.querySelector("#start");\nconst tekst = document.createElement("p");\ntekst.textContent = "Kliknięto!";\nprzycisk.addEventListener("click", () => {\n  document.body.appendChild(tekst);\n});'},
  {type:'grid',items:[['DOM','Drzewiasta reprezentacja dokumentu HTML.'],['querySelector()','Wyszukuje element za pomocą selektora CSS.'],['getElementById()','Znajduje element o wskazanym id.'],['createElement()','Tworzy nowy węzeł DOM.'],['appendChild()','Dodaje element do innego.'],['addEventListener()','Przypina obsługę zdarzenia.']]},
  {type:'p',text:'JavaScript wspiera także klasy (`class`, `constructor`, `extends`). Przykładowe narzędzia z notatek to jQuery, React i Angular.'}
 ]},
 {id:'grafika',module:'frontend',title:'Grafika i multimedia',mins:5,summary:'Dobierz format pliku do zadania.',blocks:[
  {type:'compare',headers:['Format','Typ / cechy','Najlepiej do'],rows:[['JPG','Rastrowy, kompresja stratna','Zdjęcia'],['PNG','Rastrowy, bezstratny, przezroczystość','Grafiki z przezroczystością'],['GIF','Rastrowy, proste animacje, do 256 kolorów','Krótkie animacje'],['WebP','Rastrowy, efektywna kompresja','Nowoczesne obrazy WWW'],['BMP','Rastrowy','Tradycyjny format bitmap'],['SVG','Wektorowy, skalowalny bez utraty jakości','Logo, ikony']]},
  {type:'p',text:'HTML5 ma natywne znaczniki `<video>` i `<audio>`. W notatkach wymieniono wideo **MP4** i **WebM**, a audio **MP3**, **WAV** i **OGG**.'},
  {type:'callout',title:'Kluczowa różnica',text:'**Raster** składa się z pikseli i może tracić jakość przy powiększeniu. **Wektor** opisany jest matematycznie i skaluje się bez utraty ostrości.'}
 ]},
 {id:'wzorce',module:'ux',title:'Wzorce F, Z i Gutenberg',mins:7,summary:'Zrozum, jak ludzie skanują ekran wzrokiem.',blocks:[
  {type:'compare',headers:['Wzorzec','Ruch wzroku','Gdzie pasuje'],rows:[['F','Poziomo u góry, krócej niżej, potem w dół lewą stroną','Artykuły i strony z dużą ilością tekstu'],['Z','Od góry w prawo, po przekątnej w lewo na dół, w prawo','Proste landing page'],['Diagram Gutenberga','Cztery strefy uwagi w symetrycznym układzie','Jednolite układy bez silnych akcentów']]},
  {type:'gutenberg'},
  {type:'callout',title:'Ograniczenie',text:'Model Gutenberga słabiej opisuje strony z wyrazistymi obrazami, przyciskami i ekrany mobilne. Układ warto weryfikować testami A/B lub eye-trackingiem.'}
 ]},
 {id:'uklady',module:'ux',title:'Above the fold i układy',mins:6,summary:'Pierwszy ekran decyduje, czy użytkownik zostanie.',blocks:[
  {type:'p',text:'**Above the fold** to obszar strony widoczny bez przewijania. Zgodnie z notatkami warto tam umieścić najważniejszy **nagłówek**, **propozycję wartości** i główne **CTA**.'},
  {type:'grid',items:[['Układ pionowy','Typowy dla blogów i artykułów.'],['Układ poziomy','Spotykany np. w galeriach.'],['Układ centralny','Częsty w prostych wizytówkach.'],['Menu u góry','Układ blokowy: nawigacja nad treścią.'],['Dwie kolumny','Asymetryczne menu i treść lub dwie równe części.'],['Trzy kolumny','Menu i panele boczne oraz środek z treścią.']]},
  {type:'p',text:'W notatkach wskazano, że pierwsze wrażenie może powstać już w około **50 ms**. Hierarchia wizualna, odstępy i spójność pomagają użytkownikowi szybciej znaleźć informacje.'}
 ]},
 {id:'wcag',module:'ux',title:'Responsywność, siatki i WCAG',mins:7,summary:'Projektuj tak, aby strona była czytelna dla różnych osób.',blocks:[
  {type:'grid',items:[['Siatka 12-kolumnowa','Pozwala łatwo podzielić szerokość na 2, 3, 4 lub 6 części.'],['Mobile / Tablet / Desktop','Przykładowo 1 kolumna, 2–4 kolumny i pełna siatka.'],['Hierarchia wizualna','Najważniejsze treści wyróżniają się w pierwszej kolejności.'],['Whitespace','Puste przestrzenie poprawiają grupowanie i czytelność.']]},
  {type:'p',text:'Wytyczne **WCAG** wyróżniają poziomy zgodności **A**, **AA**, **AAA**.'},
  {type:'bullets',items:['Kontrast zwykłego tekstu do tła: co najmniej **4,5:1** (typowy wymóg AA).','Grafiki informacyjne powinny mieć opis alternatywny (`alt`).','Wszystkie ważne funkcje muszą być dostępne z klawiatury.','Przyciski i linki powinny mieć dostatecznie duże obszary klikalne.','Nagłówki muszą tworzyć logiczną strukturę.']},
  {type:'callout',title:'Nie tylko estetyka',text:'**UX** oznacza doświadczenia użytkownika, a **UI** to warstwa wizualna i interaktywna. Ładna strona nie zawsze jest użyteczna.'}
 ]},
 {id:'php-sql',module:'backend',title:'PHP, SQL i operacje CRUD',mins:8,summary:'Logika po stronie serwera i trwały zapis danych.',blocks:[
  {type:'p',text:'**PHP** wykonuje się na serwerze. Zmienne zaczynają się od `$`. PHP odbiera dane formularzy przez `$_GET` i `$_POST`, a połączenia z MySQL/MariaDB można tworzyć przez PDO lub MySQLi.'},
  {type:'code',lang:'php',code:'<?php\n$uczen = ["imie" => "Jan", "klasa" => 4];\nsession_start();\n$_SESSION["user"] = $uczen["imie"];\n?>'},
  {type:'compare',headers:['SQL','Znaczenie'],rows:[['SELECT','Odczyt danych'],['INSERT','Dodanie nowego rekordu'],['UPDATE','Zmiana istniejących danych'],['DELETE','Usunięcie danych'],['JOIN','Łączenie danych z tabel'],['GROUP BY','Grupowanie wyników']]},
  {type:'callout',title:'CRUD',text:'Create → **INSERT**, Read → **SELECT**, Update → **UPDATE**, Delete → **DELETE**.'}
 ]},
 {id:'apache-sesje',module:'backend',title:'Apache, sesje i cookies',mins:5,summary:'Jak serwer pamięta użytkownika i obsługuje żądania.',blocks:[
  {type:'grid',items:[['Apache','Serwer HTTP obsługujący żądania klientów.'],['httpd.conf','Główny plik konfiguracyjny Apache.'],['.htaccess','Lokalna konfiguracja katalogu (jeśli serwer ją dopuszcza).'],['mod_rewrite','Przepisywanie adresów URL.'],['Virtual Hosts','Obsługa wielu witryn na serwerze.'],['XAMPP / WAMP','Pakiety do lokalnego środowiska serwerowego.']]},
  {type:'p',text:'**Sesja** przechowuje stan użytkownika po stronie serwera (PHP: `session_start()`, `$_SESSION`). **Cookie** to niewielkie dane zapisywane w przeglądarce, które mogą np. zawierać identyfikator sesji.'},
  {type:'callout',title:'Nie pomyl',text:'**Cookie** leży po stronie przeglądarki, natomiast dane sesji PHP są zasadniczo po stronie serwera.'}
 ]},
 {id:'renderowanie',module:'backend',title:'SSR, CSR i SSG',mins:7,summary:'Gdzie i kiedy powstaje HTML?',blocks:[
  {type:'compare',headers:['Strategia','Mechanizm','Typowe użycie'],rows:[['SSR','Serwer generuje HTML w odpowiedzi na żądanie','Sklepy, serwisy z często zmienną treścią'],['CSR / SPA','Przeglądarka buduje widok w JavaScript','Panele, bogate interaktywne aplikacje'],['SSG','HTML generowany w czasie budowania witryny','Blogi, strony firmowe rzadko aktualizowane']]},
  {type:'grid',items:[['SSR — plus','Treść HTML dostępna od początku, ułatwia SEO.'],['CSR — plus','Płynne przejścia i aktualizacje bez przeładowania.'],['SSG — plus','Szybkie dostarczanie gotowych plików, np. przez CDN.']]},
  {type:'callout',title:'Sposób na zapamiętanie',text:'**SSR** = HTML robi serwer *na żądanie*. **CSR** = HTML buduje przeglądarka. **SSG** = HTML został zbudowany *wcześniej*.'}
 ]},
 {id:'przeplyw',module:'architektura',title:'Od przeglądarki do bazy danych',mins:8,summary:'Ścieżka żądania w dużej aplikacji.',blocks:[
  {type:'p',text:'System rozproszony składa się z niezależnych warstw. Każda odpowiada za inne zadanie, a całość ma zwiększać wydajność i odporność na awarie.'},
  {type:'architecture'},
  {type:'grid',items:[['CDN','Dostarcza pliki statyczne możliwie blisko użytkownika.'],['Load Balancer','Rozdziela ruch na wiele serwerów aplikacji.'],['Redis / Cache','Szybko zwraca często używane dane.'],['RabbitMQ / Kolejka','Przekazuje zadania do wykonania asynchronicznie.'],['Worker','Wykonuje zadania w tle.'],['Master + replika','Baza główna obsługuje zapis, replika może obsługiwać odczyt.']]}
 ]},
 {id:'skalowanie',module:'architektura',title:'SPOF, skalowanie i redundancja',mins:8,summary:'Jak uniknąć awarii całego serwisu?',blocks:[
  {type:'p',text:'**SPOF (Single Point of Failure)** to pojedynczy element, którego awaria unieruchamia cały system. Redundancja polega na utrzymywaniu alternatywnych elementów, by utrzymać działanie usług.'},
  {type:'compare',headers:['Skalowanie pionowe','Skalowanie poziome'],rows:[['Dodajesz RAM lub CPU do jednego serwera','Dodajesz kolejne serwery'],['Prostsze na początku','Wymaga rozdzielania ruchu'],['Ograniczone mocą pojedynczej maszyny','Daje większe możliwości rozbudowy']]},
  {type:'bullets',items:['Dwa load balancery w układzie **active-passive** lub **active-active** pomagają usunąć SPOF na wejściu.','**Failover** bazy danych pozwala przejąć rolę głównej bazy przez replikę.','**Autoskalowanie** dostosowuje liczbę instancji do ruchu (np. Kubernetes HPA).','**Multi-AZ** i **Multi-Region** rozkładają infrastrukturę na niezależne lokalizacje.']},
  {type:'callout',title:'N+1',text:'Redundancja **N+1** oznacza zapas mocy, dzięki któremu po awarii jednej jednostki system ma nadal wystarczające zasoby.'}
 ]},
 {id:'style',module:'architektura',title:'Monolit, mikroserwisy, serverless',mins:6,summary:'Trzy sposoby podziału oprogramowania.',blocks:[
  {type:'compare',headers:['Architektura','Zaleta','Wyzwanie'],rows:[['Monolit','Prosty start i spójny kod','Trudniej skalować niezależne moduły'],['Mikroserwisy','Niezależne usługi i izolacja awarii','Wysoka złożoność komunikacji i utrzymania'],['Serverless (FaaS)','Uruchamianie funkcji na żądanie','Cold start i limity wykonania']]},
  {type:'callout',title:'Nie ma jednej najlepszej',text:'Wybór architektury zależy od skali i potrzeb. Materiał skupia się na **kompromisach**, a nie na uniwersalnym zwycięzcy.'}
 ]},
 {id:'zagrozenia',module:'architektura',title:'SQL Injection, XSS, CSRF i inne',mins:8,summary:'Powiąż każdy typ zagrożenia ze sposobem ochrony.',blocks:[
  {type:'compare',headers:['Zagrożenie','Na czym polega','Ochrona'],rows:[['SQL Injection','Dane wejściowe wpływają na zapytanie SQL','Zapytania parametryzowane, minimalne uprawnienia'],['XSS','Niebezpieczny kod trafia do strony i wykonuje się w przeglądarce','Escapowanie danych, CSP'],['CSRF','Wywołanie niechcianej akcji w imieniu zalogowanej osoby','Token CSRF, SameSite, kontrola Origin'],['DDoS','Wiele żądań próbuje przeciążyć usługę','Rate limiting, WAF, usługi ochronne'],['MITM','Przechwycenie lub modyfikacja transmisji','TLS/HTTPS, HSTS']]},
  {type:'callout',title:'Skojarzenia',text:'**SQL Injection** → baza. **XSS** → skrypt u odbiorcy. **CSRF** → cudza sesja. **DDoS** → zalew ruchu. **MITM** → połączenie.'}
 ]},
 {id:'naglowki',module:'architektura',title:'Nagłówki HTTP i bezpieczeństwo sesji',mins:7,summary:'CSP, HSTS, CORS i atrybuty Set-Cookie.',blocks:[
  {type:'compare',headers:['Nagłówek / atrybut','Za co odpowiada'],rows:[['Cache-Control','Zasady przechowywania odpowiedzi w pamięci cache'],['Content-Security-Policy (CSP)','Ogranicza źródła dopuszczonych skryptów i zasobów'],['Access-Control-Allow-Origin','Określa dozwolone pochodzenie w mechanizmie CORS'],['Strict-Transport-Security (HSTS)','Wymusza kolejne połączenia po HTTPS'],['HttpOnly','Cookie niedostępne przez JavaScript'],['Secure','Cookie wysyłane tylko przez HTTPS'],['SameSite','Ogranicza cookie w kontekście żądań między witrynami']]},
  {type:'code',lang:'http',code:'Content-Security-Policy: default-src \'self\'\nStrict-Transport-Security: max-age=31536000\nSet-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax'},
  {type:'callout',title:'Trzy flagi cookie',text:'**HttpOnly** → JavaScript. **Secure** → HTTPS. **SameSite** → żądania pomiędzy witrynami.'}
 ]},
 {id:'wydajnosc',module:'architektura',title:'RPS, transfer i liczba serwerów',mins:9,summary:'Policz przepustowość i dobierz zapas serwerów.',blocks:[
  {type:'p',text:'Do planowania wydajności wykorzystuje się liczbę żądań na sekundę (RPS), średni rozmiar odpowiedzi oraz wydajność jednej maszyny.'},
  {type:'formulas'},
  {type:'steps',items:['**12 000 żądań / 8 s** = **1500 RPS**.','**1500 RPS × 45 KB** = **67 500 KB/s** ≈ **540 Mb/s** (przy przyjęciu dziesiętnych jednostek).','Zapas **20%**: 1500 × 1,2 = **1800 RPS**.','Jeden serwer obsługuje **800 RPS**, więc ceil(1800 / 800) = **3 serwery**.','Po awarii jednego zostaną 2 × 800 = **1600 RPS**; to więcej od rzeczywistego ruchu 1500 RPS.']},
  {type:'calculator'},
  {type:'callout',title:'Częsty błąd',text:'Wynik **2,25** serwera zaokrąglij zawsze **w górę** — potrzeba trzech całych maszyn.'}
 ]}
];
const GLOSSARY = [
 ['API','Interfejs programistyczny umożliwiający komunikację aplikacji i modułów.','frontend'],
 ['Above the fold','Część strony widoczna bez przewijania.','ux'],
 ['Apache','Popularny serwer HTTP, który może obsługiwać strony internetowe.','backend'],
 ['Back-end','Warstwa serwerowa realizująca logikę, przetwarzanie i dostęp do danych.','backend'],
 ['Breakpoint','Szerokość/warunek, przy którym RWD zmienia układ strony.','frontend'],
 ['Cache','Pamięć podręczna przyspieszająca wielokrotny dostęp do danych.','architektura'],
 ['CDN','Rozproszona sieć serwerów dostarczająca treści bliżej użytkownika.','architektura'],
 ['CMS','System zarządzania treścią, np. WordPress, Joomla, Drupal.','podstawy'],
 ['Cookie','Niewielka porcja danych zapisywana w przeglądarce.','backend'],
 ['CORS','Mechanizm kontrolujący dostęp skryptów do zasobów między różnymi źródłami.','architektura'],
 ['CSP','Content-Security-Policy: określa dopuszczone źródła zasobów na stronie.','architektura'],
 ['CSR','Client-Side Rendering: widok renderuje się po stronie przeglądarki.','backend'],
 ['CSS','Kaskadowe arkusze stylów — wygląd i układ stron.','frontend'],
 ['CTA','Call to Action: element zachęcający do konkretnego działania.','ux'],
 ['DNS','System tłumaczący nazwy domen na adresy IP.','podstawy'],
 ['DOM','Obiektowa, drzewiasta reprezentacja dokumentu HTML.','frontend'],
 ['DDoS','Atak mający przeciążyć usługę bardzo dużym ruchem.','architektura'],
 ['Flexbox','Jednowymiarowy układ elementów w CSS.','frontend'],
 ['Front-end','Warstwa widoczna dla użytkownika, działająca w przeglądarce.','frontend'],
 ['Grid','Dwuwymiarowy system układu wierszy i kolumn CSS.','frontend'],
 ['HSTS','Nagłówek wymuszający używanie HTTPS w kolejnych połączeniach.','architektura'],
 ['HTML','Język znaczników określający strukturę i semantykę strony.','frontend'],
 ['HTTP','Protokół komunikacji pomiędzy klientem i serwerem WWW.','podstawy'],
 ['HTTPS','HTTP zabezpieczony protokołem TLS.','podstawy'],
 ['Intranet','Prywatna sieć organizacji używająca technologii internetowych.','podstawy'],
 ['JavaScript','Język programowania odpowiedzialny m.in. za logikę przeglądarki.','frontend'],
 ['Load Balancer','Komponent rozdzielający żądania między serwery.','architektura'],
 ['localStorage','Trwała pamięć danych dostępna w przeglądarce dla danej witryny.','frontend'],
 ['MITM','Atak związany z przechwyceniem komunikacji między stronami.','architektura'],
 ['Mikroserwisy','Architektura niezależnych, małych usług.','architektura'],
 ['Monolit','Aplikacja rozwijana jako jedna spójna baza kodu.','architektura'],
 ['PHP','Język skryptowy wykonywany po stronie serwera.','backend'],
 ['Portal','Rozbudowany serwis gromadzący różne treści i usługi.','podstawy'],
 ['RPS','Requests Per Second: liczba żądań obsługiwanych na sekundę.','architektura'],
 ['RWD','Responsive Web Design: dostosowanie układu do urządzenia.','frontend'],
 ['SEO','Optymalizacja strony na potrzeby bezpłatnych wyników wyszukiwania.','ux'],
 ['Serverless','Uruchamianie funkcji kodu na żądanie bez samodzielnego zarządzania serwerami.','architektura'],
 ['Sesja','Mechanizm zachowania stanu użytkownika między żądaniami.','backend'],
 ['sessionStorage','Pamięć danych w obrębie sesji karty przeglądarki.','frontend'],
 ['SPOF','Single Point of Failure: awaria jednego elementu unieruchamia system.','architektura'],
 ['SQL','Język zapytań do relacyjnych baz danych.','backend'],
 ['SQL Injection','Wstrzyknięcie niebezpiecznego fragmentu do zapytania SQL.','architektura'],
 ['SSG','Static Site Generation: statyczne pliki generowane podczas budowania.','backend'],
 ['SSR','Server-Side Rendering: HTML generowany przez serwer przy żądaniu.','backend'],
 ['SVG','Format grafiki wektorowej skalujący się bez utraty jakości.','frontend'],
 ['TLS','Protokół szyfrujący komunikację sieciową, używany m.in. w HTTPS.','podstawy'],
 ['UI','User Interface: wizualna i interaktywna warstwa produktu.','ux'],
 ['URL','Adres wskazujący zasób, np. stronę czy podstronę.','podstawy'],
 ['UX','User Experience: całokształt doświadczeń podczas używania produktu.','ux'],
 ['VPN','Wirtualna sieć prywatna tworząca szyfrowany tunel komunikacyjny.','podstawy'],
 ['WCAG','Wytyczne dostępności treści internetowych (A, AA i AAA).','ux'],
 ['Web Workers','API wykonujące JS poza głównym wątkiem strony.','frontend'],
 ['Wireframe','Uproszczona makieta rozmieszczenia elementów witryny.','ux'],
 ['Wortal','Portal skierowany do wąskiej tematycznie grupy.','podstawy'],
 ['WWW','Usługa Internetu składająca się z połączonych hiperłączami dokumentów.','podstawy'],
 ['XSS','Atak polegający na uruchomieniu niebezpiecznej treści skryptowej u odbiorcy.','architektura'],
 ['CSRF','Próba wykonania niechcianej akcji w kontekście zalogowanej osoby.','architektura']
];
const QUESTIONS = [
 {l:'internet-www',q:'Co najlepiej opisuje różnicę między Internetem a WWW?',o:['WWW to cała infrastruktura sieciowa','Internet to infrastruktura, a WWW to jej usługa','Te pojęcia znaczą dokładnie to samo','Internet jest tylko jedną witryną'],a:1,e:'Internet jest globalną siecią, zaś WWW korzystającą z niej usługą.'},
 {l:'internet-www',q:'Która usługa działa w Internecie, ale nie jest samą WWW?',o:['HTML','CSS','Poczta e-mail','Hiperłącze'],a:2,e:'Poczta e-mail jest usługą Internetu niezależną od WWW.'},
 {l:'historia',q:'W którym roku Tim Berners-Lee przedstawił koncepcję WWW?',o:['1989','1991','1993','2004'],a:0,e:'Koncepcja WWW powstała w CERN w 1989 roku.'},
 {l:'historia',q:'Co wydarzyło się w 1991 roku?',o:['Narodziny Web 2.0','Powstał język CSS','Publiczne udostępnienie pierwszej strony WWW','Mosaic trafił na rynek'],a:2,e:'W 1991 roku opublikowano pierwszą stronę WWW.'},
 {l:'klasyfikacja',q:'Jeden dokument HTML pod jednym adresem URL to...',o:['serwis','aplikacja','portal','strona internetowa'],a:3,e:'W notatkach pojedynczy dokument HTML to strona internetowa.'},
 {l:'klasyfikacja',q:'Wortal to...',o:['portal o wyspecjalizowanej tematyce','wewnętrzna sieć firmy','protokół pocztowy','adres IP'],a:0,e:'Wortal kierowany jest do konkretnej grupy i skupia się na jednej tematyce.'},
 {l:'klasyfikacja',q:'Który przykład najlepiej pasuje do aplikacji internetowej?',o:['Pojedynczy plik HTML','Edytor dokumentów online','Statyczna wizytówka','Plik graficzny SVG'],a:1,e:'Edytor online wykonuje złożone zadania w przeglądarce.'},
 {l:'url',q:'Za co odpowiada DNS?',o:['Za kolory strony','Za przetwarzanie PHP','Za tłumaczenie domen na adresy IP','Za kompresję obrazów'],a:2,e:'DNS zamienia przyjazne nazwy domen na adresy IP.'},
 {l:'url',q:'Co oznacza „?rok=2026” w adresie URL?',o:['Protokół','Parametry zapytania','Subdomenę','Port serwera'],a:1,e:'Fragment po znaku zapytania przekazuje parametry URL.'},
 {l:'url',q:'Która część adresu https://www.technikum.edu.pl/aktualnosci wskazuje ścieżkę?',o:['https://','www.','/aktualnosci','.pl'],a:2,e:'Ścieżka identyfikuje konkretny zasób pod domeną.'},
 {l:'protokoly',q:'Czym HTTPS różni się od HTTP?',o:['Używa szyfrowania TLS','Działa bez serwera','Służy tylko do e-maili','Nie korzysta z URL'],a:0,e:'HTTPS chroni transmisję pomiędzy klientem a serwerem przy pomocy TLS.'},
 {l:'protokoly',q:'Który protokół służy do wysyłania e-maili?',o:['POP3','IMAP','SMTP','CSS'],a:2,e:'SMTP odpowiada za wysyłanie wiadomości.'},
 {l:'protokoly',q:'Czym jest hosting?',o:['Językiem programowania','Usługą udostępniania zasobów serwera','Przeglądarką','Formatem obrazu'],a:1,e:'Hosting zapewnia zasoby i dostępność strony.'},
 {l:'html',q:'Jaka jest podstawowa rola HTML?',o:['Wykonywanie zapytań SQL','Budowa struktury dokumentu','Szyfrowanie połączenia','Skalowanie serwerów'],a:1,e:'HTML opisuje strukturę i semantykę treści.'},
 {l:'html',q:'Który znacznik oznacza główną zawartość dokumentu?',o:['<footer>','<aside>','<main>','<nav>'],a:2,e:'<main> oznacza główny obszar treści strony.'},
 {l:'html',q:'Który znacznik najlepiej pasuje do menu nawigacyjnego?',o:['<article>','<nav>','<section>','<header>'],a:1,e:'<nav> oznacza część dokumentu z linkami nawigacyjnymi.'},
 {l:'formularze',q:'Jaki atrybut HTML wymaga wypełnienia pola?',o:['required','placeholder','autofocus','readonly'],a:0,e:'required sprawia, że formularz wymaga wartości pola.'},
 {l:'formularze',q:'Które API pamięta dane także po zamknięciu przeglądarki?',o:['sessionStorage','localStorage','Drag & Drop','Fullscreen'],a:1,e:'localStorage zachowuje dane między sesjami.'},
 {l:'formularze',q:'Które API wymaga zgody na pobranie lokalizacji?',o:['Canvas API','History API','Geolocation API','Web Workers'],a:2,e:'Geolocation API pobiera położenie użytkownika po uzyskaniu jego zgody.'},
 {l:'css',q:'Co opisuje Box Model?',o:['Kolejność żądań HTTP','Content, padding, border i margin','Model mikroserwisów','Strukturę bazy'],a:1,e:'Box Model opisuje zawartość, padding, obramowanie i margines.'},
 {l:'css',q:'Który selektor wskazuje klasę „karta”?',o:['#karta','.karta','karta','@karta'],a:1,e:'Selektory klas zaczynają się od kropki.'},
 {l:'css',q:'Który zapis wybiera stan najechania kursorem?',o:['::before',':hover',':nth-child','@media'],a:1,e:':hover jest pseudoklasą reagującą na najechanie.'},
 {l:'rwd',q:'Flexbox jest przede wszystkim układem...',o:['jednowymiarowym','trójwymiarowym','bazodanowym','sieciowym'],a:0,e:'Flexbox ułatwia rozkładanie elementów w jednym wymiarze.'},
 {l:'rwd',q:'Do kontroli wierszy i kolumn naraz służy...',o:['HTML','CSS Grid','FTP','POP3'],a:1,e:'Grid umożliwia projektowanie układu w dwóch wymiarach.'},
 {l:'rwd',q:'Co robi reguła @media (max-width: 768px)?',o:['Zmienia domenę','Działa dla okna o szerokości najwyżej 768 px','Tworzy bazę danych','Wymusza HTTPS'],a:1,e:'Media Query dobiera style do szerokości i innych cech urządzenia.'},
 {l:'js',q:'Do reagowania na kliknięcie w JavaScript służy...',o:['addEventListener()','GROUP BY','@keyframes','httpd.conf'],a:0,e:'addEventListener obsługuje zdarzenia takie jak click.'},
 {l:'js',q:'DOM to...',o:['Protokół szyfrowania','Drzewo obiektów reprezentujących dokument','Typ hostingu','System plików'],a:1,e:'Document Object Model daje JavaScript dostęp do elementów HTML.'},
 {l:'js',q:'Która metoda tworzy nowy element HTML?',o:['querySelector()','createElement()','getElementById()','session_start()'],a:1,e:'document.createElement() tworzy nowy element.'},
 {l:'grafika',q:'Który format najlepiej skalować bez utraty jakości?',o:['JPG','GIF','BMP','SVG'],a:3,e:'SVG jest formatem wektorowym.'},
 {l:'grafika',q:'Który format jest rastrowy i obsługuje przezroczystość?',o:['PNG','SVG','SQL','HTML'],a:0,e:'PNG jest bezstratnym formatem rastrowym z przezroczystością.'},
 {l:'grafika',q:'Które znaczniki HTML5 służą do osadzania multimediów?',o:['<header> i <nav>','<audio> i <video>','<sql> i <php>','<aside> i <main>'],a:1,e:'HTML5 udostępnia natywne elementy audio i video.'},
 {l:'wzorce',q:'Który wzorzec skanowania odpowiada stronom z długim tekstem?',o:['Z','F','Koło','Spirala'],a:1,e:'Wzorzec F najczęściej opisuje przeglądanie bogatych w tekst stron.'},
 {l:'wzorce',q:'Wzorzec Z przydaje się szczególnie przy...',o:['prostym landing page','długiej tabeli SQL','replikacji baz','edycji Apache'],a:0,e:'Z opisuje wzrokowy przebieg w prostszym układzie strony.'},
 {l:'wzorce',q:'Który czynnik może ograniczyć trafność Diagramu Gutenberga?',o:['Jednolity tekst','Silne akcenty wizualne','Symetryczny layout','Brak obrazów'],a:1,e:'Wyraziste elementy i ekrany mobilne mogą zmieniać zachowanie wzroku.'},
 {l:'uklady',q:'Co powinno znaleźć się above the fold?',o:['Wyłącznie stopka','Nagłówek, obietnica wartości, główne CTA','Cała polityka cookies','Lista wszystkich tabel bazy'],a:1,e:'Najważniejsze informacje i działanie powinny być widoczne bez scrollowania.'},
 {l:'uklady',q:'CTA to...',o:['wewnętrzne API','Call to Action — wezwanie do działania','standard kompresji','rodzaj hostingu'],a:1,e:'CTA zachęca użytkownika do wykonania konkretnej czynności.'},
 {l:'wcag',q:'Jakie poziomy zgodności wyróżniają wytyczne WCAG?',o:['1, 2, 3','A, AA, AAA','S, M, L','HTTP, HTTPS, FTP'],a:1,e:'WCAG określa trzy poziomy zgodności: A, AA oraz AAA.'},
 {l:'wcag',q:'Minimalny kontrast dla typowego tekstu na poziomie AA wynosi...',o:['1:1','2:1','4,5:1','10:1'],a:2,e:'Typowy wymóg to kontrast tekstu do tła na poziomie 4,5:1.'},
 {l:'wcag',q:'Które działanie wspiera dostępność?',o:['Usunięcie focusu klawiatury','Opisy alternatywne obrazów','Linki bez nazw','Nawigacja tylko myszką'],a:1,e:'alt i obsługa klawiaturą pomagają korzystać z witryn.'},
 {l:'php-sql',q:'Gdzie zwykle wykonywany jest kod PHP?',o:['Na serwerze','Tylko w CSS','W karcie graficznej','W HTML jako styl'],a:0,e:'PHP jest językiem po stronie serwera.'},
 {l:'php-sql',q:'Które polecenie SQL modyfikuje dane?',o:['SELECT','UPDATE','JOIN','GROUP BY'],a:1,e:'UPDATE aktualizuje istniejące rekordy.'},
 {l:'php-sql',q:'Jaką operację CRUD realizuje SELECT?',o:['Create','Read','Update','Delete'],a:1,e:'SELECT służy do odczytywania danych.'},
 {l:'apache-sesje',q:'Za co odpowiada mod_rewrite w Apache?',o:['Za generowanie obrazów','Za przepisywanie URL','Za szyfrowanie dysków','Za logowanie JavaScript'],a:1,e:'mod_rewrite wspiera reguły zmiany/przekierowania adresów.'},
 {l:'apache-sesje',q:'Dane sesji PHP są zasadniczo przechowywane...',o:['po stronie serwera','wewnątrz pliku CSS','w adresie TLD','w SVG'],a:0,e:'PHP utrzymuje sesję na serwerze; cookie często tylko ją identyfikuje.'},
 {l:'renderowanie',q:'W której strategii HTML powstaje podczas budowania projektu?',o:['CSR','SSR','SSG','DOM'],a:2,e:'SSG generuje statyczne strony podczas procesu build.'},
 {l:'renderowanie',q:'W której strategii renderowanie widoku wykonuje JavaScript w przeglądarce?',o:['CSR','SSR','SSG','SMTP'],a:0,e:'CSR to Client-Side Rendering.'},
 {l:'renderowanie',q:'Która strategia generuje HTML na serwerze dla żądania?',o:['CSR','SSR','SSG','CDN'],a:1,e:'SSR generuje HTML po stronie serwera.'},
 {l:'przeplyw',q:'Jaka jest rola load balancera?',o:['Rysuje ikony','Rozkłada ruch między serwery','Tworzy semantyczny HTML','Obsługuje wyłącznie SMTP'],a:1,e:'Load Balancer kieruje żądania do wielu instancji aplikacji.'},
 {l:'przeplyw',q:'Co zazwyczaj przyspiesza dostęp do popularnych danych?',o:['Cache','SPOF','XSS','FTP'],a:0,e:'Pamięć podręczna zmniejsza konieczność ponownego pobierania danych.'},
 {l:'przeplyw',q:'Do czego służy kolejka komunikatów?',o:['Do formatowania CSS','Do przekazywania zadań workerom','Do tworzenia domen','Do rysowania Canvas'],a:1,e:'Kolejki pozwalają wykonywać zadania w tle.'},
 {l:'skalowanie',q:'Czym jest SPOF?',o:['Dodatkowy serwer zapasowy','Element, którego awaria może zatrzymać cały system','Model układu CSS','Typ obrazu'],a:1,e:'Single Point of Failure to pojedynczy punkt awarii.'},
 {l:'skalowanie',q:'Dodanie drugiego serwera aplikacji to skalowanie...',o:['pionowe','poziome','statyczne','wektorowe'],a:1,e:'Skalowanie poziome to dodawanie równoległych instancji.'},
 {l:'skalowanie',q:'Co oznacza failover?',o:['Automatyczne przejęcie roli przez element zapasowy','Wyłączenie TLS','Usunięcie plików cache','Łączenie CSS'],a:0,e:'Failover pozwala przywrócić usługę przez przełączenie na zapasowy element.'},
 {l:'style',q:'Jaki problem może pojawiać się w architekturze serverless?',o:['Brak URL','Cold start','Brak możliwości HTTP','Niemożność użycia JSON'],a:1,e:'Cold start to opóźnienie zimnego uruchomienia funkcji.'},
 {l:'style',q:'Która architektura oznacza jeden wspólny kod aplikacji?',o:['Mikroserwisy','Serverless','Monolit','CDN'],a:2,e:'Monolit to jedna spójna aplikacja i baza kodu.'},
 {l:'zagrozenia',q:'Co chroni przede wszystkim przed SQL Injection?',o:['Parametryzowane zapytania SQL','Wzorzec Z','Animacja CSS','Zwiększenie jasności ekranu'],a:0,e:'Prepared statements oddzielają dane od kodu zapytania SQL.'},
 {l:'zagrozenia',q:'Który mechanizm pomaga chronić przed CSRF?',o:['Token anty-CSRF','Format BMP','Grid','Viewport'],a:0,e:'Token anty-CSRF jest jednym z podstawowych zabezpieczeń.'},
 {l:'zagrozenia',q:'Jakiego typu zagrożenie ogranicza CSP?',o:['Przegrzewanie CPU','XSS','Awarię zasilacza','Brak DNS'],a:1,e:'CSP ogranicza źródła uruchamianych zasobów, wspierając ochronę przed XSS.'},
 {l:'zagrozenia',q:'Który skrót oznacza atak przeciążeniowy?',o:['DOM','DDoS','RWD','SSR'],a:1,e:'Distributed Denial of Service przeciąża usługę ruchem.'},
 {l:'naglowki',q:'Który nagłówek służy do wymuszania HTTPS?',o:['Cache-Control','HSTS','Access-Control-Allow-Origin','Accept-Language'],a:1,e:'Strict-Transport-Security nakazuje używanie HTTPS w kolejnych połączeniach.'},
 {l:'naglowki',q:'Co daje atrybut HttpOnly w cookie?',o:['Brak dostępu do cookie przez JS','Automatyczne tworzenie SQL','Zmianę domeny','Wykrywanie GPU'],a:0,e:'HttpOnly uniemożliwia odczyt ciasteczka przez document.cookie.'},
 {l:'naglowki',q:'Za jakie zasady odpowiada Cache-Control?',o:['Rozmieszczenie tabel','Buforowanie odpowiedzi','Obsługa formularzy','Kolejność HTML'],a:1,e:'Cache-Control opisuje zachowanie pamięci podręcznej.'},
 {l:'naglowki',q:'Atrybut Secure sprawia, że cookie...',o:['jest zawsze usuwane','może być wysyłane tylko przez HTTPS','staje się publiczne','zapisuje się w SQL'],a:1,e:'Secure ogranicza wysyłanie ciasteczek do połączeń HTTPS.'},
 {l:'wydajnosc',q:'12 000 żądań w 8 sekund to ile RPS?',o:['96000','1500','800','1200'],a:1,e:'RPS = liczba żądań / czas = 12000 / 8 = 1500.'},
 {l:'wydajnosc',q:'1800 RPS przy 800 RPS na serwer: ile serwerów potrzeba?',o:['2','2,25','3','4'],a:2,e:'1800/800 = 2,25, więc zaokrąglamy w górę do 3.'},
 {l:'wydajnosc',q:'Ile serwerów pozostaje po awarii jednego w układzie z trzema?',o:['0','1','2','3'],a:2,e:'Przy trzech maszynach i awarii jednej dwie pozostają aktywne.'}
];
