/**
 * Calcola quali carte togliere in base al numero di giocatori
 * @param {number} playerCount - numero di giocatori
 * @param {number} cardsPerPlayer - numero di carte iniziali (7)
 * @returns {string[]} - valori delle carte da togliere
 */
export function getCardsToRemove(playerCount, cardsPerPlayer = 7) {
  const totalCards = 52; // carte francesi, senza jolly
  const inGame = playerCount * cardsPerPlayer + 1; // +1 briscola
  const toRemove = totalCards - inGame;

  if (toRemove <= 0) return []; // non serve togliere nulla

  const quads = Math.floor(toRemove / 4);

  // valori carte in ordine crescente (A ultimo)
  const values = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];

  return values.slice(0, quads);
}
