export function createHUD() {
  const scoreDisplay = document.getElementById('score-display');
  const hearts = [
    document.getElementById('heart-1'),
    document.getElementById('heart-2'),
    document.getElementById('heart-3'),
  ];

  let currentScore = -1;
  let currentLives = -1;

  function update(gameState) {
    // Csak akkor nyúlunk a DOM-hoz, ha tényleg változott az érték (teljesítmény optimalizálás)
    if (currentScore !== gameState.score) {
      scoreDisplay.innerText = gameState.score;
      currentScore = gameState.score;
    }

    if (currentLives !== gameState.lives) {
      hearts.forEach((heart, index) => {
        // Ha az index kisebb, mint ahány élete van, akkor piros, különben szürke (elvesztett)
        if (index < gameState.lives) {
          heart.classList.remove('lost');
        } else {
          heart.classList.add('lost');
        }
      });
      currentLives = gameState.lives;
    }
  }

  return {
    update,
  };
}
