window.CLASS4I_COURSE = {
  "id": "systemy-baz-danych-sql",
  "title": "Systemy baz danych · Zapytania, JOIN i widoki",
  "subtitle": "Podzapytania zwykłe i skorelowane, rodzaje JOIN oraz operacje na widokach. Na końcu uruchomisz własne zapytania w SQL LAB.",
  "storageKey": "klasa4i-sbd-zapytania-join-widoki-v1",
  "resources": [
    {
      "title": "Notatki z systemów baz danych",
      "description": "Oryginalny plik PDF z materiałami do tematu.",
      "href": "../../../../assets/pdf/notatki-systemy-baz-danych.pdf",
      "filename": "notatki-systemy-baz-danych.pdf",
      "size": "379 KB"
    }
  ],
  "modules": [
    {
      "id": "podzapytania",
      "title": "Zapytania zagnieżdżone",
      "description": "Podzapytania zwykłe i skorelowane."
    },
    {
      "id": "join",
      "title": "Złączenia tabel (JOIN)",
      "description": "INNER, LEFT, RIGHT, FULL, CROSS i SELF JOIN."
    },
    {
      "id": "widoki",
      "title": "Widoki (perspektywy)",
      "description": "Tworzenie, odczyt, modyfikowanie i usuwanie widoków."
    }
  ],
  "lessons": [
    {
      "id": "podzapytania",
      "module": "podzapytania",
      "title": "Zapytanie zagnieżdżone (podzapytanie)",
      "duration": 7,
      "summary": "Zapytanie SELECT umieszczone wewnątrz innego zapytania SELECT.",
      "sections": [
        {
          "heading": "Czym jest podzapytanie?",
          "text": "Zapytanie zagnieżdżone (podzapytanie) jest typem zapytania użytym wewnątrz instrukcji SELECT innego zapytania. Serwer najpierw wykonuje zapytanie wewnętrzne, a jego wynik wykorzystuje w zapytaniu zewnętrznym. Możliwe jest wiele poziomów zagnieżdżenia."
        },
        {
          "heading": "Schemat ogólny",
          "text": "Zewnętrzna kwerenda filtruje wiersze w WHERE, korzystając z wyniku zapytania wewnętrznego.",
          "code": "SELECT atrybuty\nFROM tabela\nWHERE kolumna operator (\n    SELECT ...\n);"
        },
        {
          "heading": "Przykład — pensja większa od średniej",
          "text": "Podzapytanie oblicza średnią pensję w firmie. Zapytanie zewnętrzne wybiera pracowników zarabiających więcej niż ta średnia.",
          "code": "SELECT imie, pensja\nFROM pracownicy\nWHERE pensja > (\n    SELECT AVG(pensja)\n    FROM pracownicy\n);"
        },
        {
          "heading": "IN i EXISTS",
          "text": "IN sprawdza, czy wartość znajduje się w zbiorze zwróconym przez podzapytanie. EXISTS sprawdza, czy podzapytanie zwróciło przynajmniej jeden wiersz. W notatkach wymieniono też NOT IN i NOT EXISTS.",
          "code": "SELECT *\nFROM klienci k\nWHERE EXISTS (\n    SELECT *\n    FROM zamowienia z\n    WHERE z.id_klienta = k.id\n);"
        }
      ]
    },
    {
      "id": "zapytanie-skorelowane",
      "module": "podzapytania",
      "title": "Zapytanie skorelowane",
      "duration": 6,
      "summary": "Podzapytanie odwołuje się do wiersza aktualnie przetwarzanego przez zapytanie zewnętrzne.",
      "sections": [
        {
          "heading": "Definicja",
          "text": "Zapytanie skorelowane to zapytanie, w którym zapytanie wewnętrzne odwołuje się do wartości z aktualnie przetwarzanego wiersza zapytania zewnętrznego."
        },
        {
          "heading": "Przykład — średnia w dziale",
          "text": "Podzapytanie liczy średnią pensję osobno dla działu pracownika. Warunek dzial = p.dzial wiąże zapytanie wewnętrzne z aktualnym pracownikiem.",
          "code": "SELECT imie, nazwisko\nFROM pracownicy p\nWHERE pensja > (\n    SELECT AVG(pensja)\n    FROM pracownicy\n    WHERE dzial = p.dzial\n);"
        },
        {
          "heading": "Najważniejsze do zapamiętania",
          "text": "W zapytaniu skorelowanym występuje odwołanie do aliasu zapytania zewnętrznego — tutaj p.dzial. Dzięki temu średnia jest liczona dla danego działu, a nie dla całej firmy."
        }
      ]
    },
    {
      "id": "inner-i-outer-join",
      "module": "join",
      "title": "INNER JOIN i OUTER JOIN",
      "duration": 9,
      "summary": "Złączenia wewnętrzne i zewnętrzne: LEFT, RIGHT, FULL.",
      "sections": [
        {
          "heading": "Po co używa się JOIN?",
          "text": "Złączenia są używane, gdy trzeba uzyskać dostęp do więcej niż jednej tabeli lub więcej niż jednej krotki. Warunek złączenia opisuje, które rekordy są ze sobą powiązane."
        },
        {
          "heading": "INNER JOIN",
          "text": "Tabela wynikowa zawiera tylko rekordy, dla których warunek złączenia jest spełniony w obu tabelach. Może to być równozłączenie albo nierównozłączenie, np. z warunkiem <, >, != lub BETWEEN.",
          "code": "SELECT Customers.customer_id,\n       Customers.first_name,\n       Orders.amount\nFROM Customers\nINNER JOIN Orders\n    ON Customers.customer_id = Orders.customer_id;"
        },
        {
          "heading": "LEFT OUTER JOIN",
          "text": "Zawiera wszystkie wiersze pierwszej (lewej) tabeli oraz pasujące wiersze z drugiej tabeli. Jeśli nie ma dopasowania, kolumny z prawej tabeli przyjmują wartość NULL.",
          "code": "SELECT Customers.customer_id,\n       Customers.first_name,\n       Orders.amount\nFROM Customers\nLEFT JOIN Orders\n    ON Customers.customer_id = Orders.customer_id;"
        },
        {
          "heading": "RIGHT OUTER JOIN",
          "text": "Zawiera wszystkie wiersze drugiej (prawej) tabeli oraz pasujące wiersze z pierwszej. Jeśli nie ma klienta po lewej stronie, jego pola będą NULL.",
          "code": "SELECT Customers.customer_id,\n       Customers.first_name,\n       Orders.amount\nFROM Customers\nRIGHT JOIN Orders\n    ON Customers.customer_id = Orders.customer_id;"
        },
        {
          "heading": "FULL OUTER JOIN",
          "text": "Zawiera wszystkie wiersze obu złączonych tabel — zarówno dopasowane, jak i niedopasowane. Łączy zachowanie LEFT i RIGHT JOIN.",
          "code": "SELECT Customers.customer_id,\n       Customers.first_name,\n       Orders.amount\nFROM Customers\nFULL OUTER JOIN Orders\n    ON Customers.customer_id = Orders.customer_id;"
        }
      ]
    },
    {
      "id": "cross-self-wiele-tabel",
      "module": "join",
      "title": "CROSS JOIN, SELF JOIN i wiele tabel",
      "duration": 8,
      "summary": "Iloczyn kartezjański, połączenie tabeli z samą sobą i kolejne JOIN-y.",
      "sections": [
        {
          "heading": "CROSS JOIN",
          "text": "Tworzy kombinację każdego wiersza pierwszej tabeli z każdym wierszem drugiej tabeli, czyli iloczyn kartezjański. W przykładzie z dwiema tabelami po 5 rekordów otrzymamy 5 × 5 = 25 wierszy.",
          "code": "SELECT Customers.customer_id,\n       Customers.first_name,\n       Orders.order_id\nFROM Customers\nCROSS JOIN Orders;"
        },
        {
          "heading": "SELF JOIN",
          "text": "To złączenie w obrębie jednej tabeli. Po obu stronach występuje ta sama tabela, dlatego używa się aliasów, aby rozróżnić jej role.",
          "code": "SELECT p.imie AS pracownik,\n       k.imie AS kierownik\nFROM pracownicy p\nLEFT JOIN pracownicy k\n    ON p.id_kierownika = k.id;"
        },
        {
          "heading": "Łączenie więcej niż dwóch tabel",
          "text": "Można dodawać kolejne złączenia JOIN, jedno po drugim. W przykładzie łączymy klientów, zamówienia i wysyłki.",
          "code": "SELECT c.first_name, o.item, s.status\nFROM Customers c\nLEFT JOIN Orders o\n    ON c.customer_id = o.customer_id\nLEFT JOIN Shippings s\n    ON o.customer_id = s.customer_id;"
        }
      ]
    },
    {
      "id": "widoki",
      "module": "widoki",
      "title": "Widoki (perspektywy)",
      "duration": 8,
      "summary": "Wirtualna tabela utworzona na podstawie zapytania.",
      "sections": [
        {
          "heading": "Czym jest widok?",
          "text": "Widok (perspektywa) to wirtualna tabela, której zawartość jest wyliczana przez system z tabel źródłowych. Widok jest definiowany jako zapytanie (kwerenda). Tabela przechowuje dane, a widok przechowuje definicję zapytania."
        },
        {
          "heading": "Tworzenie widoku",
          "text": "CREATE VIEW tworzy widok. W poniższym przykładzie widok zawiera nazwy i ceny produktów tańszych niż 100.",
          "code": "CREATE VIEW produkty_tanie AS\nSELECT nazwa, cena\nFROM produkty\nWHERE cena < 100;"
        },
        {
          "heading": "Odpytanie widoku",
          "text": "Widok można odpytywać podobnie jak zwykłą tabelę.",
          "code": "SELECT * FROM produkty_tanie;"
        },
        {
          "heading": "Modyfikowanie i usuwanie widoku",
          "text": "W notatkach pokazano CREATE OR REPLACE VIEW jako sposób nadpisania istniejącego widoku oraz DROP VIEW jako sposób jego usunięcia.",
          "code": "CREATE OR REPLACE VIEW pracownicy_it AS\nSELECT * FROM pracownicy\nWHERE dzial = 'IT';\n\nDROP VIEW nazwa_widoku;"
        },
        {
          "heading": "Zalety i wady widoków",
          "text": "Zalety: upraszczanie zapytań, bezpieczeństwo, łatwiejsze zarządzanie i ponowne wykorzystanie kodu. Wady: mogą obniżać wydajność i mają ograniczoną możliwość modyfikacji."
        },
        {
          "heading": "Uwaga do laboratorium SQLite",
          "text": "Laboratorium działa na SQLite w przeglądarce. SQLite nie obsługuje składni CREATE OR REPLACE VIEW. W ćwiczeniach przygotowano zgodny odpowiednik: DROP VIEW IF EXISTS nazwa; CREATE VIEW nazwa AS ... . Jeśli wpiszesz zapis CREATE OR REPLACE VIEW, laboratorium automatycznie zamieni go na odpowiednik SQLite."
        }
      ]
    }
  ],
  "flashcards": [
    {
      "question": "Czym jest zapytanie zagnieżdżone?",
      "answer": "Zapytaniem SELECT umieszczonym wewnątrz innego zapytania SELECT."
    },
    {
      "question": "Które zapytanie jest wykonywane jako pierwsze?",
      "answer": "Najpierw wykonywane jest zapytanie wewnętrzne (podzapytanie), a potem zewnętrzne."
    },
    {
      "question": "Do czego służy IN w podzapytaniu?",
      "answer": "Sprawdza, czy wartość znajduje się w zbiorze wartości zwróconych przez podzapytanie."
    },
    {
      "question": "Co sprawdza EXISTS?",
      "answer": "Czy podzapytanie zwraca przynajmniej jeden wiersz."
    },
    {
      "question": "Co oznaczają NOT IN i NOT EXISTS?",
      "answer": "Odpowiednio: wartość nie znajduje się w zbiorze; podzapytanie nie zwraca żadnego wiersza."
    },
    {
      "question": "Czym jest zapytanie skorelowane?",
      "answer": "Podzapytaniem, które odwołuje się do wartości z aktualnie przetwarzanego wiersza zapytania zewnętrznego."
    },
    {
      "question": "Czym jest JOIN?",
      "answer": "Złączeniem umożliwiającym pobranie danych z więcej niż jednej tabeli lub krotki."
    },
    {
      "question": "Jak działa INNER JOIN?",
      "answer": "Zwraca tylko rekordy pasujące do warunku złączenia w obu tabelach."
    },
    {
      "question": "Jak działa LEFT JOIN?",
      "answer": "Zwraca wszystkie rekordy z lewej tabeli i pasujące z prawej; przy braku dopasowania po prawej jest NULL."
    },
    {
      "question": "Jak działa RIGHT JOIN?",
      "answer": "Zwraca wszystkie rekordy z prawej tabeli i pasujące z lewej; przy braku dopasowania po lewej jest NULL."
    },
    {
      "question": "Jak działa FULL OUTER JOIN?",
      "answer": "Zwraca wszystkie rekordy obu tabel, także te bez odpowiedników."
    },
    {
      "question": "Co to jest CROSS JOIN?",
      "answer": "Złączenie tworzące iloczyn kartezjański — każdą kombinację wierszy obu tabel."
    },
    {
      "question": "Co to jest SELF JOIN?",
      "answer": "Złączenie tabeli z samą sobą; do rozróżnienia ról używa się aliasów."
    },
    {
      "question": "Jak obliczyć liczbę wierszy CROSS JOIN dla tabel 5 × 5?",
      "answer": "5 × 5 = 25 wierszy."
    },
    {
      "question": "Jak połączyć trzy tabele?",
      "answer": "Dodać kolejne klauzule JOIN, każdą z własnym warunkiem ON."
    },
    {
      "question": "Czym jest widok?",
      "answer": "Wirtualną tabelą definiowaną zapytaniem; jej definicja jest przechowywana zamiast osobnej kopii danych."
    },
    {
      "question": "Czym różni się tabela od widoku?",
      "answer": "Tabela przechowuje dane, a widok przechowuje definicję zapytania."
    },
    {
      "question": "Do czego służy CREATE VIEW?",
      "answer": "Do utworzenia widoku na podstawie zapytania SELECT."
    },
    {
      "question": "Jak odpytać widok?",
      "answer": "Np. SELECT * FROM nazwa_widoku;"
    },
    {
      "question": "Do czego służy CREATE OR REPLACE VIEW w notatkach?",
      "answer": "Do modyfikacji (nadpisania) istniejącego widoku."
    },
    {
      "question": "Do czego służy DROP VIEW?",
      "answer": "Do usunięcia widoku z bazy danych."
    },
    {
      "question": "Wymień dwie zalety widoków.",
      "answer": "Np. upraszczanie zapytań, bezpieczeństwo, łatwiejsze zarządzanie, ponowne wykorzystanie kodu."
    },
    {
      "question": "Wymień dwie wady widoków.",
      "answer": "Mogą obniżać wydajność i mieć ograniczoną możliwość modyfikacji."
    },
    {
      "question": "Co oznacza NULL w wyniku LEFT JOIN?",
      "answer": "Brak pasującego wiersza z prawej tabeli dla danego rekordu z lewej."
    }
  ],
  "questions": [
    {
      "question": "Co jest wykonywane jako pierwsze w typowym podzapytaniu opisanym w notatkach?",
      "answers": [
        "Zapytanie zewnętrzne",
        "Zapytanie wewnętrzne",
        "JOIN",
        "CREATE VIEW"
      ],
      "correct": 1,
      "explanation": "Najpierw wykonywane jest podzapytanie, którego wynik jest używany przez zapytanie zewnętrzne."
    },
    {
      "question": "W której klauzuli często wykorzystuje się wynik podzapytania?",
      "answers": [
        "ORDER BY",
        "WHERE",
        "CREATE",
        "ALTER"
      ],
      "correct": 1,
      "explanation": "W notatkach pokazano schemat WHERE kolumna operator (SELECT ...)."
    },
    {
      "question": "Co sprawdza EXISTS?",
      "answers": [
        "Czy tabela ma indeks",
        "Czy podzapytanie zwraca co najmniej jeden wiersz",
        "Czy kolumna ma typ tekstowy",
        "Czy rekord jest ostatni"
      ],
      "correct": 1,
      "explanation": "EXISTS sprawdza istnienie wyniku podzapytania."
    },
    {
      "question": "Co wyróżnia zapytanie skorelowane?",
      "answers": [
        "Nie zawiera WHERE",
        "Odwołuje się do wartości z aktualnego wiersza zapytania zewnętrznego",
        "Zawsze używa CROSS JOIN",
        "Tworzy widok"
      ],
      "correct": 1,
      "explanation": "Wewnętrzne zapytanie odwołuje się do aliasu zapytania zewnętrznego, np. p.dzial."
    },
    {
      "question": "Który JOIN zwraca wyłącznie pasujące rekordy z obu tabel?",
      "answers": [
        "LEFT JOIN",
        "RIGHT JOIN",
        "INNER JOIN",
        "CROSS JOIN"
      ],
      "correct": 2,
      "explanation": "INNER JOIN pozostawia tylko dopasowania spełniające warunek ON."
    },
    {
      "question": "Który JOIN zwraca wszystkie rekordy z lewej tabeli?",
      "answers": [
        "LEFT JOIN",
        "RIGHT JOIN",
        "INNER JOIN",
        "SELF JOIN"
      ],
      "correct": 0,
      "explanation": "LEFT JOIN zachowuje wszystkie wiersze tabeli zapisanej po lewej stronie."
    },
    {
      "question": "Co pojawia się w kolumnach prawej tabeli przy braku dopasowania w LEFT JOIN?",
      "answers": [
        "0",
        "FALSE",
        "NULL",
        "Pusty ciąg zawsze"
      ],
      "correct": 2,
      "explanation": "Brak dopasowania jest prezentowany jako NULL."
    },
    {
      "question": "Który JOIN zwraca wszystkie rekordy z prawej tabeli?",
      "answers": [
        "LEFT JOIN",
        "RIGHT JOIN",
        "INNER JOIN",
        "CROSS JOIN"
      ],
      "correct": 1,
      "explanation": "RIGHT JOIN zachowuje wszystkie wiersze drugiej, prawej tabeli."
    },
    {
      "question": "Co zwraca FULL OUTER JOIN?",
      "answers": [
        "Wyłącznie pasujące rekordy",
        "Wszystkie rekordy obu tabel, również niedopasowane",
        "Iloczyn kartezjański",
        "Tylko rekordy lewej tabeli"
      ],
      "correct": 1,
      "explanation": "FULL OUTER JOIN łączy działanie LEFT i RIGHT JOIN."
    },
    {
      "question": "Co tworzy CROSS JOIN?",
      "answers": [
        "Tylko dopasowania",
        "Tylko rekordy bez odpowiednika",
        "Iloczyn kartezjański",
        "Widok"
      ],
      "correct": 2,
      "explanation": "Każdy wiersz pierwszej tabeli łączy z każdym wierszem drugiej."
    },
    {
      "question": "Ile wierszy może dać CROSS JOIN dwóch tabel po 5 rekordów?",
      "answers": [
        "10",
        "15",
        "20",
        "25"
      ],
      "correct": 3,
      "explanation": "5 × 5 = 25 kombinacji."
    },
    {
      "question": "Na czym polega SELF JOIN?",
      "answers": [
        "Łączeniu tabeli z samą sobą",
        "Łączeniu dowolnych dwóch baz",
        "Tworzeniu kopii bazy",
        "Usuwaniu duplikatów"
      ],
      "correct": 0,
      "explanation": "Ta sama tabela występuje po obu stronach złączenia i używa się aliasów."
    },
    {
      "question": "Po co stosuje się aliasy w SELF JOIN?",
      "answers": [
        "Aby zmienić typ kolumny",
        "Aby rozróżnić role tej samej tabeli",
        "Aby usunąć NULL",
        "Aby utworzyć widok"
      ],
      "correct": 1,
      "explanation": "Alias pozwala odróżnić np. pracownika p od kierownika k."
    },
    {
      "question": "Czym jest widok?",
      "answers": [
        "Fizyczną kopią całej bazy",
        "Wirtualną tabelą zdefiniowaną zapytaniem",
        "Indeksem",
        "Procedurą"
      ],
      "correct": 1,
      "explanation": "Widok przechowuje definicję zapytania, a jego zawartość jest wyliczana z tabel źródłowych."
    },
    {
      "question": "Które zdanie jest prawdziwe?",
      "answers": [
        "Tabela przechowuje definicję zapytania, widok dane",
        "Tabela i widok są tym samym",
        "Tabela przechowuje dane, widok definicję zapytania",
        "Widok nie może korzystać z JOIN"
      ],
      "correct": 2,
      "explanation": "Tak rozróżniono tabelę i widok w notatkach."
    },
    {
      "question": "Która instrukcja tworzy widok?",
      "answers": [
        "SELECT VIEW",
        "CREATE VIEW",
        "DROP VIEW",
        "INSERT VIEW"
      ],
      "correct": 1,
      "explanation": "CREATE VIEW nazwa AS SELECT ... tworzy widok."
    },
    {
      "question": "Jak odczytać dane z widoku historia_zamowien?",
      "answers": [
        "SHOW historia_zamowien",
        "SELECT * FROM historia_zamowien",
        "GET VIEW historia_zamowien",
        "OPEN historia_zamowien"
      ],
      "correct": 1,
      "explanation": "Widok odpytuje się tak, jak zwykłą tabelę."
    },
    {
      "question": "Która instrukcja usuwa widok?",
      "answers": [
        "DELETE VIEW",
        "REMOVE VIEW",
        "DROP VIEW",
        "CLEAR VIEW"
      ],
      "correct": 2,
      "explanation": "DROP VIEW nazwa_widoku usuwa widok."
    },
    {
      "question": "Która z podanych pozycji jest zaletą widoków z notatek?",
      "answers": [
        "Mogą obniżać wydajność",
        "Ograniczona możliwość modyfikacji",
        "Upraszczanie zapytań",
        "Brak możliwości ponownego użycia"
      ],
      "correct": 2,
      "explanation": "Upraszczanie zapytań wymieniono jako zaletę widoków."
    },
    {
      "question": "Która z podanych pozycji jest wadą widoków z notatek?",
      "answers": [
        "Bezpieczeństwo",
        "Łatwiejsze zarządzanie",
        "Ponowne wykorzystanie kodu",
        "Mogą obniżać wydajność"
      ],
      "correct": 3,
      "explanation": "Obniżanie wydajności wymieniono jako wadę."
    }
  ],
  "tables": [
    {
      "name": "Customers",
      "label": "klienci (Customers)",
      "columns": [
        "customer_id · INTEGER · PK",
        "first_name · TEXT"
      ],
      "rows": 5,
      "about": "Tabela klientów z przykładu INNER/OUTER JOIN."
    },
    {
      "name": "Orders",
      "label": "zamówienia (Orders)",
      "columns": [
        "order_id · INTEGER · PK",
        "amount · INTEGER",
        "customer_id · INTEGER"
      ],
      "rows": 5,
      "about": "Zamówienia z przykładów JOIN. Część customer_id nie ma odpowiednika w Customers."
    },
    {
      "name": "Shippings",
      "label": "Shippings",
      "columns": [
        "shipping_id · INTEGER · PK",
        "customer_id · INTEGER",
        "item · TEXT",
        "status · TEXT"
      ],
      "rows": 3,
      "about": "Tabela do przykładu łączenia wielu tabel."
    },
    {
      "name": "pracownicy",
      "label": "pracownicy",
      "columns": [
        "id · INTEGER · PK",
        "imie · TEXT",
        "nazwisko · TEXT",
        "pensja · REAL",
        "dzial · TEXT",
        "id_kierownika · INTEGER"
      ],
      "rows": 6,
      "about": "Tabela do zapytań skorelowanych i SELF JOIN."
    },
    {
      "name": "kategorie",
      "label": "kategorie",
      "columns": [
        "id · INTEGER · PK",
        "nazwa · TEXT"
      ],
      "rows": 3,
      "about": "Kategorie produktów do podzapytania IN."
    },
    {
      "name": "produkty",
      "label": "produkty",
      "columns": [
        "id · INTEGER · PK",
        "nazwa · TEXT",
        "cena · REAL",
        "id_klienta · INTEGER"
      ],
      "rows": 5,
      "about": "Tabela produktów do podzapytania IN i widoku tanich produktów."
    },
    {
      "name": "klienci",
      "label": "klienci",
      "columns": [
        "id · INTEGER · PK",
        "nazwa · TEXT"
      ],
      "rows": 4,
      "about": "Tabela klientów do przykładów EXISTS / NOT EXISTS."
    },
    {
      "name": "zamowienia",
      "label": "zamowienia",
      "columns": [
        "id · INTEGER · PK",
        "id_klienta · INTEGER",
        "data · TEXT",
        "wartosc · REAL"
      ],
      "rows": 3,
      "about": "Tabela zamówień do przykładów podzapytań i widoków."
    }
  ],
  "sqlPresets": [
    {
      "id": "all-customers",
      "title": "Wyświetl klientów — SELECT",
      "group": "Podstawy",
      "sql": "SELECT * FROM Customers;"
    },
    {
      "id": "sub-avg",
      "title": "Pensja większa od średniej w firmie",
      "group": "Podzapytania",
      "sql": "SELECT imie, nazwisko, pensja\nFROM pracownicy\nWHERE pensja > (\n    SELECT AVG(pensja)\n    FROM pracownicy\n);"
    },
    {
      "id": "sub-in",
      "title": "IN — produkty z kategorii Komputery",
      "group": "Podzapytania",
      "sql": "SELECT nazwa, cena\nFROM produkty\nWHERE id_klienta IN (\n    SELECT id\n    FROM kategorie\n    WHERE nazwa = 'Komputery'\n);"
    },
    {
      "id": "sub-exists",
      "title": "EXISTS — klienci z zamówieniem",
      "group": "Podzapytania",
      "sql": "SELECT *\nFROM klienci k\nWHERE EXISTS (\n    SELECT *\n    FROM zamowienia z\n    WHERE z.id_klienta = k.id\n);"
    },
    {
      "id": "sub-not-exists",
      "title": "NOT EXISTS — klienci bez zamówień",
      "group": "Podzapytania",
      "sql": "SELECT *\nFROM klienci k\nWHERE NOT EXISTS (\n    SELECT *\n    FROM zamowienia z\n    WHERE z.id_klienta = k.id\n);"
    },
    {
      "id": "sub-correlated",
      "title": "Podzapytanie skorelowane — średnia w dziale",
      "group": "Podzapytania",
      "sql": "SELECT imie, nazwisko, dzial, pensja\nFROM pracownicy p\nWHERE pensja > (\n    SELECT AVG(pensja)\n    FROM pracownicy\n    WHERE dzial = p.dzial\n);"
    },
    {
      "id": "inner",
      "title": "INNER JOIN — tylko dopasowania",
      "group": "JOIN",
      "sql": "SELECT Customers.customer_id, Customers.first_name, Orders.amount\nFROM Customers\nINNER JOIN Orders\n    ON Customers.customer_id = Orders.customer_id;"
    },
    {
      "id": "left",
      "title": "LEFT JOIN — wszyscy klienci",
      "group": "JOIN",
      "sql": "SELECT Customers.customer_id, Customers.first_name, Orders.amount\nFROM Customers\nLEFT JOIN Orders\n    ON Customers.customer_id = Orders.customer_id;"
    },
    {
      "id": "right",
      "title": "RIGHT JOIN — wszystkie zamówienia",
      "group": "JOIN",
      "sql": "SELECT Customers.customer_id, Customers.first_name, Orders.amount\nFROM Customers\nRIGHT JOIN Orders\n    ON Customers.customer_id = Orders.customer_id;"
    },
    {
      "id": "full",
      "title": "FULL OUTER JOIN — wszystkie rekordy",
      "group": "JOIN",
      "sql": "SELECT Customers.customer_id, Customers.first_name, Orders.amount\nFROM Customers\nFULL OUTER JOIN Orders\n    ON Customers.customer_id = Orders.customer_id;"
    },
    {
      "id": "cross",
      "title": "CROSS JOIN — iloczyn kartezjański",
      "group": "JOIN",
      "sql": "SELECT Customers.customer_id, Customers.first_name, Orders.order_id\nFROM Customers\nCROSS JOIN Orders;"
    },
    {
      "id": "self",
      "title": "SELF JOIN — pracownicy i kierownicy",
      "group": "JOIN",
      "sql": "SELECT p.imie AS pracownik, k.imie AS kierownik\nFROM pracownicy p\nLEFT JOIN pracownicy k\n    ON p.id_kierownika = k.id;"
    },
    {
      "id": "multi",
      "title": "Trzy tabele — klienci, zamówienia i wysyłki",
      "group": "JOIN",
      "sql": "SELECT c.first_name, o.order_id, o.amount, s.item, s.status\nFROM Customers c\nLEFT JOIN Orders o\n    ON c.customer_id = o.customer_id\nLEFT JOIN Shippings s\n    ON o.customer_id = s.customer_id;"
    },
    {
      "id": "view-create",
      "title": "CREATE VIEW — utwórz widok tanich produktów",
      "group": "Widoki",
      "sql": "CREATE VIEW produkty_tanie AS\nSELECT nazwa, cena\nFROM produkty\nWHERE cena < 100;"
    },
    {
      "id": "view-select",
      "title": "SELECT — odczytaj widok tanich produktów",
      "group": "Widoki",
      "sql": "SELECT * FROM produkty_tanie;"
    },
    {
      "id": "view-replace",
      "title": "CREATE OR REPLACE VIEW — zmień widok",
      "group": "Widoki",
      "sql": "CREATE OR REPLACE VIEW produkty_tanie AS\nSELECT nazwa, cena\nFROM produkty\nWHERE cena < 200;"
    },
    {
      "id": "view-drop",
      "title": "DROP VIEW — usuń widok",
      "group": "Widoki",
      "sql": "DROP VIEW IF EXISTS produkty_tanie;"
    },
    {
      "id": "view-history",
      "title": "Widok historii zamówień klientów",
      "group": "Widoki",
      "sql": "CREATE VIEW historia_zamowien AS\nSELECT k.nazwa, z.id, z.data, z.wartosc\nFROM klienci k\nINNER JOIN zamowienia z\n    ON k.id = z.id_klienta;\n\nSELECT * FROM historia_zamowien;"
    }
  ],
  "sqlSeed": "PRAGMA foreign_keys = ON;\n\n-- Tabele Customers i Orders: dane zgodne z przykładem w notatkach.\nCREATE TABLE Customers (\n  customer_id INTEGER PRIMARY KEY,\n  first_name TEXT NOT NULL\n);\nINSERT INTO Customers (customer_id, first_name) VALUES\n  (1, 'John'),\n  (2, 'Robert'),\n  (3, 'David'),\n  (4, 'John'),\n  (5, 'Betty');\n\nCREATE TABLE Orders (\n  order_id INTEGER PRIMARY KEY,\n  amount INTEGER NOT NULL,\n  customer_id INTEGER NOT NULL\n);\nINSERT INTO Orders (order_id, amount, customer_id) VALUES\n  (1, 200, 10),\n  (2, 500, 3),\n  (3, 300, 6),\n  (4, 800, 5),\n  (5, 150, 8);\n\nCREATE TABLE Shippings (\n  shipping_id INTEGER PRIMARY KEY,\n  customer_id INTEGER NOT NULL,\n  item TEXT NOT NULL,\n  status TEXT NOT NULL\n);\nINSERT INTO Shippings (shipping_id, customer_id, item, status) VALUES\n  (1, 3, 'Laptop', 'Wysłane'),\n  (2, 5, 'Monitor', 'W przygotowaniu'),\n  (3, 10, 'Klawiatura', 'Dostarczone');\n\n-- Pracownicy: dane do podzapytania skorelowanego i SELF JOIN.\nCREATE TABLE pracownicy (\n  id INTEGER PRIMARY KEY,\n  imie TEXT NOT NULL,\n  nazwisko TEXT NOT NULL,\n  pensja REAL NOT NULL,\n  dzial TEXT NOT NULL,\n  id_kierownika INTEGER\n);\nINSERT INTO pracownicy (id, imie, nazwisko, pensja, dzial, id_kierownika) VALUES\n  (1, 'Adam', 'Kowalski', 9500, 'IT', NULL),\n  (2, 'Jan', 'Nowak', 7500, 'IT', 1),\n  (3, 'Anna', 'Wiśniewska', 8500, 'IT', 1),\n  (4, 'Basia', 'Wójcik', 6100, 'HR', 2),\n  (5, 'Piotr', 'Mazur', 5200, 'HR', 2),\n  (6, 'Ewa', 'Kamińska', 4000, 'Sprzedaż', 1);\n\n-- Kategorie i produkty: prosty przykład podzapytania IN.\nCREATE TABLE kategorie (\n  id INTEGER PRIMARY KEY,\n  nazwa TEXT NOT NULL\n);\nINSERT INTO kategorie (id, nazwa) VALUES\n  (1, 'Komputery'),\n  (2, 'Akcesoria'),\n  (3, 'Dom');\n\nCREATE TABLE produkty (\n  id INTEGER PRIMARY KEY,\n  nazwa TEXT NOT NULL,\n  cena REAL NOT NULL,\n  id_klienta INTEGER NOT NULL\n);\n-- id_klienta jest nazwą kolumny zachowaną zgodnie z przykładem z notatek;\n-- w tym zestawie ćwiczeniowym jej wartości wskazują identyfikator kategorii.\nINSERT INTO produkty (id, nazwa, cena, id_klienta) VALUES\n  (1, 'Laptop', 3999, 1),\n  (2, 'Monitor', 899, 1),\n  (3, 'Mysz', 79, 2),\n  (4, 'Klawiatura', 149, 2),\n  (5, 'Lampka', 59, 3);\n\n-- Klienci i zamówienia: przykłady EXISTS / NOT EXISTS i widok historii.\nCREATE TABLE klienci (\n  id INTEGER PRIMARY KEY,\n  nazwa TEXT NOT NULL\n);\nINSERT INTO klienci (id, nazwa) VALUES\n  (1, 'Anna'),\n  (2, 'Bartek'),\n  (3, 'Celina'),\n  (4, 'Daniel');\n\nCREATE TABLE zamowienia (\n  id INTEGER PRIMARY KEY,\n  id_klienta INTEGER NOT NULL,\n  data TEXT NOT NULL,\n  wartosc REAL NOT NULL\n);\nINSERT INTO zamowienia (id, id_klienta, data, wartosc) VALUES\n  (101, 1, '2026-10-02', 240),\n  (102, 1, '2026-10-08', 510),\n  (103, 3, '2026-10-11', 180);\n"
};
