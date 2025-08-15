// State
let gameBoard = [], flippedCards = [], selectedPairs = [];
let matchedPairs = 0, moves = 0, gameStarted = false;
let gameTimer = 0, timerInterval = null, gameCategory = "";

// DOM
const gameBoardElement = document.getElementById('game-board');
const movesElement = document.getElementById('moves-count');
const matchesElement = document.getElementById('matches-count');
const timerElement = document.getElementById('timer');
const categoryButtonsContainer = document.querySelector('.category-buttons');
const resetBtn = document.getElementById('reset-btn');
const startBtns = document.querySelectorAll('.start-btn');
const victoryMessage = document.getElementById('victory-message');
const overlay = document.getElementById('overlay');
const playAgainBtn = document.getElementById('play-again-btn');
const gameDescription = document.getElementById('game-description');
const instructions = document.getElementById('game-instructions');

// Events
startBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtonsContainer.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    gameCategory = btn.id;
    document.body.className = gameCategory + '-theme';

    if (gameCategory === 'chemistry')
      gameDescription.textContent = '🧪 Match chemical elements with their symbols';
    else if (gameCategory === 'capitals')
      gameDescription.textContent = '🌍 Match capitals with their countries';
    else
      gameDescription.textContent = '🇩🇪 Match German words with their meanings';

    // Hide instructions after category is selected
    if (instructions) instructions.style.display = "none";

    initializeGame(gameCategory);
    startGame();
  });
});

resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);

// Functions
function initializeGame(category) {
  if (category === 'capitals') selectedPairs = capitalsPairs;
  else if (category === 'chemistry') selectedPairs = chemistryPairs;
  else selectedPairs = germanPairs;

  gameBoard = [];
  selectedPairs.forEach(p => {
    gameBoard.push({id: `${p.id}-a`, content: p.element, pairId: p.id});
    gameBoard.push({id: `${p.id}-b`, content: p.symbol, pairId: p.id});
  });

  shuffle(gameBoard);
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  gameStarted = false;
  gameTimer = 0;
  updateDisplay();
  renderBoard();
  hideVictory();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function renderBoard() {
  gameBoardElement.innerHTML = '';
  gameBoard.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card face-down';
    div.dataset.cardId = card.id;
    div.dataset.pairId = card.pairId;
    div.addEventListener('click', flipCard);
    gameBoardElement.appendChild(div);
  });
}

function flipCard(e) {
  if (!gameStarted) return;
  const el = e.currentTarget;
  if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
  if (flippedCards.length >= 2) return;

  const data = gameBoard.find(c => c.id === el.dataset.cardId);
  el.classList.replace('face-down', 'flipped');
  el.textContent = data.content;
  flippedCards.push({element: el, data});

  if (flippedCards.length === 2) {
    moves++;
    updateDisplay();
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [c1, c2] = flippedCards;
  if (c1.data.pairId === c2.data.pairId) {
    c1.element.classList.add('matched');
    c2.element.classList.add('matched');
    matchedPairs++;
    if (matchedPairs === selectedPairs.length) endGame();
  } else {
    c1.element.textContent = '';
    c2.element.textContent = '';
    c1.element.classList.replace('flipped', 'face-down');
    c2.element.classList.replace('flipped', 'face-down');
  }
  flippedCards = [];
}

function startGame() {
  gameStarted = true;
  startTimer();
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    gameTimer++;
    updateDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateDisplay() {
  movesElement.textContent = moves;
  matchesElement.textContent = `${matchedPairs}/${selectedPairs.length}`;
  timerElement.textContent = formatTime(gameTimer);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function endGame() {
  stopTimer();
  gameStarted = false;
  showVictory();
}

function showVictory() {
  document.getElementById('final-moves').textContent = moves;
  document.getElementById('final-time').textContent = formatTime(gameTimer);
  overlay.classList.remove('hidden');
  victoryMessage.classList.remove('hidden');
}

function hideVictory() {
  overlay.classList.add('hidden');
  victoryMessage.classList.add('hidden');
}

function resetGame() {
  stopTimer();
  categoryButtonsContainer.classList.remove('hidden');
  resetBtn.classList.add('hidden');
  gameBoardElement.innerHTML = '';
  matchedPairs = 0;
  moves = 0;
  gameTimer = 0;
  updateDisplay();
  hideVictory();
  document.body.className = 'chemistry-theme';
  gameDescription.textContent = 'Select a category and match the pairs';

  // Show instructions again after reset
  if (instructions) instructions.style.display = "";
}




