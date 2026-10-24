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
  }
];
