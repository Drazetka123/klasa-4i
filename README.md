# Klasa 4i — Centrum Nauki

![Strona główna klasy 4i](assets/platform-desktop.png)

Platforma edukacyjna klasy **4i**, rozwijana tak, żeby dodawać kolejne przedmioty. **Są już dwa przedmioty: Witryny i aplikacje internetowe oraz Teoria programowania**. Po wejściu na stronę uczniowie widzą katalog przedmiotów, a po kliknięciu Witryn pojawia się osobny **wybór tematów/sprawdzianów**. Dopiero po wybraniu tematu otwiera się jego kurs. Bez backendu, frameworków i budowania projektu — idealne do **GitHub Pages**.

## NOWOŚĆ: Teoria programowania — Metody Math, Array i String

**Ścieżka:** `index.html` → `subjects/teoria-programowania/index.html` → `subjects/teoria-programowania/tematy/metody-math-array-string/index.html`.

Plik notatek `Metody obiektu Math w JS.docx` dostarczył opisy 109 metod. **Uwaga:** opisy pochodzą z notatek, natomiast argumenty/typy i przykłady dopisano dydaktycznie do wymagań kartkówki. Metody dzielą się na **z lekcji (66)** i **dodatkowe z W3Schools (43)**. Zapis postępów: `klasa4i-teoria-metody-v1` (inny od starego `witryny-lab-v1`).

Tryby nauki:
- **Baza metod** — filtry Math/Array/String, źródło, wyszukiwarka po opisie, szczegóły argumentów i typów, zakładki, odhaczanie działów.
- **Fiszki** — losowanie, odpowiedź, „Umiem”/„Powtórzę”, filtrowanie trudniejszych metod i zapis znajomości.
- **Kartkówka** — podana metoda i trzy pola do uzupełnienia: „Co robi?”, „Co wstawiamy (argument i typ)?”, „Co zwróci (typ)?”. Wybierz 5/10/15/20 lub wszystkie metody, filtr i opcjonalny limit 10 minut. Po sprawdzeniu widać wzory. **Nie ma automatycznego oceniania wolnego tekstu**: uczeń sam oznacza poprawność każdego wiersza, żeby równoważne sformułowania były uznawane.
- **Postępy** — historia wyników, ukończone działy, eksport/import zapisu JSON (nie zamieszczaj tych plików w publicznym repozytorium).

### Aktualizacja już opublikowanej strony GitHub Pages

1. Rozpakuj nowy ZIP na komputerze.
2. **Wgraj zawartość całej paczki** do istniejącego repozytorium, zachowując strukturę podfolderów. Nie wrzucaj samego ZIP-a i nie dodawaj niepotrzebnego folderu nadrzędnego.
3. Zastąp istniejące pliki tylko tam, gdzie są nowsze, a folder `subjects/teoria-programowania/` dodaj w całości. **Nie usuwaj** `subjects/witryny/`.
4. Zapisz zmiany (Commit changes). GitHub Pages automatycznie opublikuje aktualizację.
5. Przetestuj: strona główna → Teoria programowania → temat → kartkówka 5 pytań → Sprawdź → ocenianie → Postępy. Otwórz też stary temat Witryn.

**Uwaga:** postępy są zapisywane lokalnie przez przeglądarkę, nie na GitHubie. Jeśli adres GitHub Pages i urządzenie się nie zmienią, zapisane postępy Witryn powinny pozostać dostępne. Dla nowego kursu można je eksportować i importować.

### Jak dodać następny temat do teorii programowania?

Dodaj nowy folder w `subjects/teoria-programowania/tematy/`, a w `subjects/teoria-programowania/tematy.js` dopisz nowy wpis (osobny `id`, `href`, `storageKey`). Nie nadpisuj ani nie usuwaj `metody-math-array-string`. Następnie zaktualizuj liczniki i listę plików w `sw.js` oraz zmień jego `CACHE_NAME`.

### Testy

Szybka kontrola struktury i JavaScript: `python tests/check_static.py`. Test interfejsu: `python tests/smoke.py` (wymaga Playwright i Chromium). W dostarczonym środowisku wykonano poprawnie test statyczny; pełnego testu przeglądarkowego nie udało się przeprowadzić z powodu ograniczeń środowiska.

## Co jest dostępne

- **Strona główna** `index.html`: wybór przedmiotu, wyszukiwarka przedmiotów, statystyki i postęp.
- **Witryny i aplikacje internetowe → Protokoły HTTP/HTTPS i aplikacje internetowe**: dotychczasowy pełny kurs — 23 lekcje, 57 fiszek, 66 pytań, quiz, egzamin, 8 laboratoriów HTML/CSS/JS, słownik, notatki, historia wyników i postępy.
- **Teoria programowania → Metody obiektów: Math, Array, String**: 109 metod (34 Math, 40 Array, 35 String), wyszukiwanie, przykłady argumentów i typów, 109 fiszek, losowa kartkówka w postaci czterokolumnowej tabeli z samodzielnym ocenianiem, statystyki, historia wyników i eksport/import danych.
- Motyw ciemny i jasny, responsywność, obsługa klawiatury, PWA i podstawowe działanie offline po zapisaniu zasobów.
- Każdy przedmiot ma **osobną podstronę**, a jego postępy są przechowywane w osobnym kluczu `localStorage`. Obecny kurs nadal korzysta z `witryny-lab-v1`, żeby zachować wcześniejsze dane na tej samej domenie.

## Jak uruchomić

1. Otwórz główny `index.html` w przeglądarce (linki prowadzą bezpośrednio do plików, więc działają też lokalnie) lub uruchom `python -m http.server 8000` w katalogu repozytorium.
2. Otwórz `http://localhost:8000/`.
3. Wybierz jeden z dwóch przedmiotów, potem temat. Każdy przedmiot ma osobną podstronę wyboru tematów i możliwość powrotu na stronę główną.

**GitHub Pages:** prześlij całą zawartość projektu do repozytorium, tak żeby plik `index.html` leżał w katalogu głównym. W **Settings → Pages → Build and deployment** wybierz **Deploy from a branch**, `main`, `/(root)`. Strona będzie dostępna zwykle pod `https://LOGIN.github.io/REPO/`. Ścieżki są względne, więc działają także pod podkatalogiem repozytorium.

## Struktura plików

```text
klasa-4i/
├── index.html                         # główna strona / wybór przedmiotu
├── css/
│   └── portal.css                     # style głównej strony
├── js/
│   └── portal.js                      # działanie katalogu przedmiotów
├── subjects/
│   ├── catalog.js                     # CENTRALNY SPIS PRZEDMIOTÓW
│   └── witryny/
│       ├── index.html                 # wybór tematów tego przedmiotu
│       ├── tematy.js                  # CENTRALNY SPIS TEMATÓW WITRYN
│       ├── tematy/
│       │   └── protokoly-http-https-i-aplikacje-internetowe/
│       │       └── index.html         # poprzedni kurs, teraz jako temat nr 1
│       ├── css/
│       │   ├── topics.css             # wygląd wyboru tematów
│       │   ├── styles.css             # wygląd kursu
│       │   └── extra.css
│       └── js/
│           ├── topics.js              # obsługa katalogu tematów
│           ├── data.js                # lekcje, fiszki, pytania tematu nr 1
│           ├── labs.js                # ćwiczenia tematu nr 1
│           ├── app.js                 # kurs tematu nr 1
│           └── pwa.js
│   └── teoria-programowania/
│       ├── index.html                 # wybór tematów teorii
│       ├── tematy.js                  # KATALOG TEMATÓW teorii
│       ├── css/topics.css             # style wyboru tematów
│       ├── js/topics.js               # obsługa wyboru tematów
│       └── tematy/metody-math-array-string/
│           ├── index.html             # nowy kurs — baza/fiszki/kartkówka
│           ├── css/methods.css
│           ├── js/methods.js           # DANE: 109 metod
│           └── js/app.js               # logika nauki
├── assets/                            # ikony PWA
├── manifest.webmanifest
├── sw.js                               # offline/cache całej platformy
├── tests/
└── README.md
```

## Dodawanie nowego przedmiotu

Nie trzeba zmieniać HTML ani CSS strony głównej. Robisz to w **2 krokach**:

**Krok 1.** Utwórz katalog, np. `subjects/matematyka/`, a w nim plik `index.html` (i własne `css/`, `js/`, jeśli potrzebujesz). To może być osobna strona lub kopia istniejącego silnika Witryn ze zmienionymi treściami.

**Krok 2.** Dodaj wpis w `subjects/catalog.js`:

```js
{
  id: 'matematyka',
  name: 'Matematyka',
  shortName: 'Matma',
  category: 'Przedmioty ogólne',
  description: 'Zadania, powtórki i sprawdziany.',
  href: 'subjects/matematyka/index.html',
  icon: '∑',
  color: 'mint',
  tags: ['Funkcje', 'Równania'],
  lessons: 12,
  flashcards: 30,
  quizzes: 40,
  labs: 0,
  storageKey: 'klasa4i-matematyka-v1'
}
```

Wstaw obiekt do tablicy `window.CLASS4I_SUBJECTS`, **po przecinku**, obok `witryny`. Nowy przedmiot sam pojawi się na stronie głównej i będzie uwzględniany w liczniku. Dodanie danych kursu i jego działania jest osobnym zadaniem — wpis w katalogu sam nie tworzy lekcji ani quizów.

**Postęp na stronie głównej:** skrypt `js/portal.js` sumuje liczbę lekcji i ukończenia wszystkich tematów dla przedmiotów, które mają `topicCatalog`. W pojedynczych kursach liczy ukończone lekcje z obiektu `completed` w kluczu `storageKey`. Jeśli kolejny kurs użyje innego formatu, dodaj dla niego odpowiedni adapter w `getDone()`.

**Offline dla przyszłych przedmiotów:** aby kolejne kursy działały offline już po pierwszym odwiedzeniu strony głównej, wpisz ich zasoby do `CORE` w `sw.js` i zmień `CACHE_NAME`. Bez tego zasoby wciąż mogą być zapisane po pierwszym otwarciu kursu przy aktywnym service workerze.

## Przechowywanie danych

Postępy, notatki, zapisane kody z laboratorium i motyw są lokalne, w danej przeglądarce. Nie ma wspólnej bazy wyników całej klasy, logowania ani synchronizacji pomiędzy urządzeniami. W kursie Witryny możesz eksportować/importować postępy jako JSON. Nie przesyłaj tych danych do repozytorium.

## Uwaga do testów

Do ręcznego testowania uruchom `python -m http.server 8000`. Test automatyczny Playwright znajduje się w `tests/smoke.py` (wymaga modułu `playwright` i przeglądarki Chromium).

Materiały kursu Witryny opierają się na przesłanym pliku `witryny_ai.pdf`.

## Gotowy szablon do przyszłych przedmiotów

Nie musisz kopiować rozbudowanego kursu Witryn. W repozytorium jest **`templates/nowy-przedmiot/`** — prosta, uniwersalna baza przyszłych kursów, korzystająca ze współdzielonego silnika `js/course-template.js` i styli `css/course-template.css`.

1. Skopiuj **zawartość** `templates/nowy-przedmiot/` do np. `subjects/matematyka/`.
2. W `subjects/matematyka/data.js` zmień `id`, `title`, `subtitle`, `storageKey` i uzupełnij tablice `modules`, `lessons`, `flashcards`, `questions` własnymi treściami. Usuń demonstracyjne pytania.
3. Dopisz przedmiot do `subjects/catalog.js`. Upewnij się, że `href`, `lessons` i `storageKey` odpowiadają rzeczywistemu folderowi i danym.
4. Prześlij zmiany na GitHuba. Kafelek pojawi się na stronie głównej automatycznie. Jeśli nowy przedmiot ma mieć kilka sprawdzianów, skopiuj podejście opisane poniżej.

Szablon obsługuje: **lekcje z sekcjami, odhaczanie ukończenia, własne notatki, fiszki, quiz z wyjaśnieniami, pasek postępu i jasny/ciemny motyw**. Może być bazą do dalszych funkcji specyficznych dla przedmiotu. Sam szablon nie jest dodatkowym przedmiotem i nie pojawia się na stronie głównej. Katalog zawiera obecnie Witryny i aplikacje internetowe oraz Teorię programowania.

## Dodawanie kolejnego sprawdzianu z Witryn (WAŻNE)

**Nie zastępuj poprzednich plików tematu.** Każdy nowy sprawdzian to osobna karta widoczna po wybraniu przedmiotu. Zawsze zachowuj stare materiały.

1. Utwórz nowy folder `subjects/witryny/tematy/NAZWA-NOWEGO-TEMATU/`.
2. Dodaj w nim własny `index.html`, ewentualnie `data.js`, `css/` i `js/` z lekcjami, fiszkami i quizami. Możesz wykorzystać `templates/nowy-przedmiot/` i dostosować jego ścieżki do nowego podfolderu.
3. W `subjects/witryny/tematy.js` **dopisz** obiekt do `window.CLASS4I_WITRYNY_TOPICS`, np.:

```js
{
  id: 'nowy-sprawdzian',
  title: 'Nazwa nowego sprawdzianu',
  description: 'Krótki opis materiału.',
  subtitle: 'Sprawdzian 02',
  category: 'Materiał do następnego sprawdzianu',
  tags: ['CSS', 'JavaScript'],
  href: 'tematy/nowy-sprawdzian/index.html',
  lessons: 10,
  flashcards: 20,
  questions: 25,
  labs: 0,
  storageKey: 'klasa4i-witryny-nowy-sprawdzian-v1'
}
```

**Wskazówka:** `href` w `tematy.js` jest względny względem `subjects/witryny/index.html`, więc musi prowadzić do istniejącego `index.html` w folderze tematu. Każdy nowy kurs powinien używać własnego `storageKey` i nie nadpisywać `witryny-lab-v1` — ten klucz służy do zachowania postępów pierwszego tematu. Po dodaniu lekcji zaktualizuj liczniki `lessons`, `flashcards`, `questions` oraz listę zasobów offline w `sw.js` i zmień `CACHE_NAME`.

**Poprzedni kurs:** `subjects/witryny/tematy/protokoly-http-https-i-aplikacje-internetowe/` korzysta z istniejącego silnika w `subjects/witryny/js/` i istniejącego klucza zapisu `witryny-lab-v1`. Nie trzeba przenosić postępów na ten sam adres GitHub Pages — są przypisane do domeny i klucza localStorage. Zmiana nazwy tematu nie zmienia zapisanych lekcji.

## Jak aktualizować repozytorium na GitHubie

Prześlij **wszystkie pliki z tego wydania** z zachowaniem podfolderów. Zastąp stare wersje plików zmienionych (np. `index.html`, `subjects/catalog.js`, `css/portal.css`, `sw.js`, `README.md`) i **dodaj folder `subjects/teoria-programowania/` w całości**. Nie usuwaj `subjects/witryny/` ani istniejących materiałów. Nie przesyłaj wyłącznie ZIP-a do repozytorium. Pamiętaj, że GitHubowe przesyłanie pojedynczych plików przez WWW bywa niewygodne dla głębokich katalogów; można też użyć GitHub Desktop albo edycji plików online.

**Automatyczne statystyki:** dla Witryn strona główna pobiera tematy z `window.CLASS4I_WITRYNY_TOPICS` (wczytane z `subjects/witryny/tematy.js`), a nie jedynie z pojedynczego klucza kursu. Po dodaniu kolejnego sprawdzianu i aktualizacji danych karty pojawią się sumaryczne lekcje oraz postępy również na poziomie listy przedmiotów.

**Uwaga do nazwy:** w opisie użytkownika pojawiło się `HHTP`; poprawną nazwą protokołu jest **HTTP**, dlatego temat na stronie to „Protokoły HTTP/HTTPS i aplikacje internetowe”.
