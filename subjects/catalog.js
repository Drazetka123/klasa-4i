/**
 * Katalog przedmiotów klasy 4i.
 * Aby dodać nowy przedmiot, utwórz subjects/<id>/index.html i dopisz obiekt poniżej.
 * Pole storageKey jest opcjonalne; przechowuj postępy oddzielnie dla każdego przedmiotu.
 */
window.CLASS4I_SUBJECTS = [
  {
    id: 'witryny',
    name: 'Witryny i aplikacje internetowe',
    shortName: 'Witryny',
    category: 'Przedmioty zawodowe',
    description: 'Tematy na sprawdziany i materiały do nauki. Wybierz dział, ucz się i wracaj do starszych powtórek.',
    href: 'subjects/witryny/index.html',
    icon: '</>',
    color: 'mint',
    tags: ['HTTP / HTTPS', 'WWW', 'Aplikacje', 'Kolejne sprawdziany'],
    lessons: 23,
    flashcards: 57,
    quizzes: 66,
    labs: 8,
    storageKey: 'witryny-lab-v1',
    topicCatalog: 'CLASS4I_WITRYNY_TOPICS'
  },
  {
    id: 'teoria-programowania',
    name: 'Teoria programowania',
    shortName: 'Teoria',
    category: 'Przedmioty zawodowe',
    description: 'Metody JavaScript, fiszki i trening kartkówki w formie tabeli. Każdy nowy sprawdzian ma osobny temat.',
    href: 'subjects/teoria-programowania/index.html',
    icon: '{ }',
    color: 'violet',
    tags: ['Math', 'Array', 'String', 'Kartkówka – tabela'],
    lessons: 3,
    flashcards: 109,
    quizzes: 109,
    labs: 0,
    storageKey: 'klasa4i-teoria-metody-v1',
    topicCatalog: 'CLASS4I_TEORIA_TOPICS'
  },
  {
    id: 'geografia',
    name: 'Geografia',
    shortName: 'Geografia',
    category: 'Przedmioty ogólne',
    description: 'Materiały do sprawdzianów z geografii. Wybieraj tematy, ucz się z lekcji i sprawdzaj wiedzę.',
    href: 'subjects/geografia/index.html',
    icon: '🌍',
    color: 'mint',
    tags: ['Rolnictwo na świecie', 'Uprawy', 'Hodowla', 'Lasy'],
    lessons: 12,
    flashcards: 36,
    quizzes: 24,
    labs: 0,
    storageKey: 'klasa4i-geografia-rolnictwo-v1',
    topicCatalog: 'CLASS4I_GEOGRAFIA_TOPICS'
  },
  {
    id: 'systemy-baz-danych',
    name: 'Systemy baz danych',
    shortName: 'SBD',
    category: 'Przedmioty zawodowe',
    description: 'Podzapytania, JOIN-y i widoki. Ucz się na przykładach i testuj własne kwerendy w laboratorium SQL.',
    href: 'subjects/systemy-baz-danych/index.html',
    icon: 'SQL',
    color: 'blue',
    tags: ['Podzapytania', 'JOIN', 'Widoki', 'Laboratorium SQL'],
    lessons: 5,
    flashcards: 24,
    quizzes: 20,
    labs: 1,
    storageKey: 'klasa4i-sbd-zapytania-join-widoki-v1',
    topicCatalog: 'CLASS4I_SBD_TOPICS'
  }
];
