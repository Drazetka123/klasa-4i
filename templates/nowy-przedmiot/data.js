/**
 * SZABLON: To są treści DEMONSTRACYJNE, a nie gotowy drugi przedmiot.
 * Skopiuj folder do subjects/<nazwa>/ i zastąp zawartość własnymi materiałami.
 * storageKey musi być taki sam jak wpis w subjects/catalog.js.
 */
window.CLASS4I_COURSE = {
  id: 'nowy-przedmiot',
  title: 'Nowy przedmiot',
  subtitle: 'Wstaw tutaj opis nauki i zakresu materiału.',
  storageKey: 'klasa4i-nowy-przedmiot-v1',
  modules: [
    { id: 'start', title: 'Wprowadzenie', description: 'Pierwsze zagadnienia tego przedmiotu.' }
  ],
  lessons: [
    { id: 'lekcja-1', module: 'start', title: 'Przykładowa lekcja', duration: 5,
      summary: 'Zastąp ten tekst własnym opisem lekcji.',
      sections: [
        { heading: 'Pierwsze pojęcie', text: 'Tu wstaw zrozumiałe wyjaśnienie pojęcia i jego zastosowania.' },
        { heading: 'Przykład', text: 'Tu możesz wytłumaczyć krok po kroku przykładowe zadanie.' }
      ]
    }
  ],
  flashcards: [
    { question: 'Przykładowe pytanie na fiszce', answer: 'Przykładowa odpowiedź — wpisz swoją.' }
  ],
  questions: [
    { question: 'Którą odpowiedź wstawisz do pierwszego pytania?', answers: ['A', 'B', 'C', 'D'], correct: 0, explanation: 'Tu wpisz wyjaśnienie poprawnej odpowiedzi.' }
  ]
};
