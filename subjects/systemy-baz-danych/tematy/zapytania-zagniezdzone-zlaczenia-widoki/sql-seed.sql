PRAGMA foreign_keys = ON;

-- Tabele Customers i Orders: dane zgodne z przykładem w notatkach.
CREATE TABLE Customers (
  customer_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL
);
INSERT INTO Customers (customer_id, first_name) VALUES
  (1, 'John'),
  (2, 'Robert'),
  (3, 'David'),
  (4, 'John'),
  (5, 'Betty');

CREATE TABLE Orders (
  order_id INTEGER PRIMARY KEY,
  amount INTEGER NOT NULL,
  customer_id INTEGER NOT NULL
);
INSERT INTO Orders (order_id, amount, customer_id) VALUES
  (1, 200, 10),
  (2, 500, 3),
  (3, 300, 6),
  (4, 800, 5),
  (5, 150, 8);

CREATE TABLE Shippings (
  shipping_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  item TEXT NOT NULL,
  status TEXT NOT NULL
);
INSERT INTO Shippings (shipping_id, customer_id, item, status) VALUES
  (1, 3, 'Laptop', 'Wysłane'),
  (2, 5, 'Monitor', 'W przygotowaniu'),
  (3, 10, 'Klawiatura', 'Dostarczone');

-- Pracownicy: dane do podzapytania skorelowanego i SELF JOIN.
CREATE TABLE pracownicy (
  id INTEGER PRIMARY KEY,
  imie TEXT NOT NULL,
  nazwisko TEXT NOT NULL,
  pensja REAL NOT NULL,
  dzial TEXT NOT NULL,
  id_kierownika INTEGER
);
INSERT INTO pracownicy (id, imie, nazwisko, pensja, dzial, id_kierownika) VALUES
  (1, 'Adam', 'Kowalski', 9500, 'IT', NULL),
  (2, 'Jan', 'Nowak', 7500, 'IT', 1),
  (3, 'Anna', 'Wiśniewska', 8500, 'IT', 1),
  (4, 'Basia', 'Wójcik', 6100, 'HR', 2),
  (5, 'Piotr', 'Mazur', 5200, 'HR', 2),
  (6, 'Ewa', 'Kamińska', 4000, 'Sprzedaż', 1);

-- Kategorie i produkty: prosty przykład podzapytania IN.
CREATE TABLE kategorie (
  id INTEGER PRIMARY KEY,
  nazwa TEXT NOT NULL
);
INSERT INTO kategorie (id, nazwa) VALUES
  (1, 'Komputery'),
  (2, 'Akcesoria'),
  (3, 'Dom');

CREATE TABLE produkty (
  id INTEGER PRIMARY KEY,
  nazwa TEXT NOT NULL,
  cena REAL NOT NULL,
  id_klienta INTEGER NOT NULL
);
-- id_klienta jest nazwą kolumny zachowaną zgodnie z przykładem z notatek;
-- w tym zestawie ćwiczeniowym jej wartości wskazują identyfikator kategorii.
INSERT INTO produkty (id, nazwa, cena, id_klienta) VALUES
  (1, 'Laptop', 3999, 1),
  (2, 'Monitor', 899, 1),
  (3, 'Mysz', 79, 2),
  (4, 'Klawiatura', 149, 2),
  (5, 'Lampka', 59, 3);

-- Klienci i zamówienia: przykłady EXISTS / NOT EXISTS i widok historii.
CREATE TABLE klienci (
  id INTEGER PRIMARY KEY,
  nazwa TEXT NOT NULL
);
INSERT INTO klienci (id, nazwa) VALUES
  (1, 'Anna'),
  (2, 'Bartek'),
  (3, 'Celina'),
  (4, 'Daniel');

CREATE TABLE zamowienia (
  id INTEGER PRIMARY KEY,
  id_klienta INTEGER NOT NULL,
  data TEXT NOT NULL,
  wartosc REAL NOT NULL
);
INSERT INTO zamowienia (id, id_klienta, data, wartosc) VALUES
  (101, 1, '2026-10-02', 240),
  (102, 1, '2026-10-08', 510),
  (103, 3, '2026-10-11', 180);
