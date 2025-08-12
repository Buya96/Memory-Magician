/* jshint esversion: 11 */

// Game state
let gameBoard = [];
let flippedCards = [];
let selectedPairs = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let gameTimer = 0;
let timerInterval = null;
let gameCategory = "";

// DOM elements
const gameBoardElement = document.getElementById('game-board');
const movesElement = document.getElementById('moves-count');
const matchesElement = document.getElementById('matches-count');
const timerElement = document.getElementById('timer');
const startBtns = document.querySelectorAll('.start-btn');
const resetBtn = document.getElementById('reset-btn');
const categoryButtonsContainer = document.querySelector('.category-buttons');
const victoryMessage = document.getElementById('victory-message');
const playAgainBtn = document.getElementById('play-again-btn');
const overlay = document.getElementById('overlay');

// Category button click listener
startBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        categoryButtonsContainer.classList.add("hidden");
        resetBtn.classList.remove("hidden");
        gameCategory = btn.id;
        initializeGame(gameCategory);
        startGame();
    });
});

// Initialise with chosen category
function initializeGame(category) {
    if (category === "capitals") {
        selectedPairs = capitalsPairs;
    } else if (category === "chemistry") {
        selectedPairs = chemistryPairs;
    } else if (category === "german") {
        selectedPairs = germanPairs;
    }
    gameBoard = [];
    selectedPairs.forEach(pair => {
        gameBoard.push({ id: `${pair.id}-element`, content: pair.element, pairId: pair.id });
        gameBoard.push({ id: `${pair.id}-symbol`, content: pair.symbol, pairId: pair.id });
    });
    shuffleArray(gameBoard);
    flippedCards = [];
    matchedPairs = 0; moves = 0; gameStarted = false; gameTimer = 0;
    updateDisplay();
    createGameBoard();
    hideVictoryMessage();
}

// Shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create board UI
function createGameBoard() {
    gameBoardElement.innerHTML = '';
    gameBoard.forEach(card => {
        const el = document.createElement('div');
        el.className = 'card';
        el.classList.add('face-down');
        el.dataset.cardId = card.id;
        el.dataset.pairId = card.pairId;
        el.addEventListener('click', flipCard);
        gameBoardElement.appendChild(el);
    });
}

// Flip card
function flipCard(e) {
    if (!gameStarted) return;
    const cardElement = e.currentTarget;
    const cardId = cardElement.dataset.cardId;
    if (cardElement.classList.contains('flipped') || 
        cardElement.classList.contains('matched') || 
        flippedCards.length >= 2) return;

    const cardData = gameBoard.find(card => card.id === cardId);
    cardElement.classList.remove('face-down');
    cardElement.classList.add('flipped');
    cardElement.textContent = cardData.content;
    flippedCards.push({ element: cardElement, data: cardData });

    if (flippedCards.length === 2) {
        moves++;
        updateDisplay();
        setTimeout(checkMatch, 1000);
    }
}

// Check match
function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.data.pairId === c2.data.pairId) {
        c1.element.classList.add('matched');
        c2.element.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === selectedPairs.length) endGame();
    } else {
        c1.element.classList.remove('flipped');
        c2.element.classList.remove('flipped');
        c1.element.classList.add('face-down');
        c2.element.classList.add('face-down');
        c1.element.textContent = '';
        c2.element.textContent = '';
    }
    flippedCards = [];
    updateDisplay();
}

// Start game
function startGame() {
    gameStarted = true;
    startTimer();
}

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        gameTimer++;
        updateDisplay();
    }, 1000);
}
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}
function formatTime(seconds) {
    const m = Math.floor(seconds / 60), s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// Display
function updateDisplay() {
    movesElement.textContent = moves;
    matchesElement.textContent = `${matchedPairs}/${selectedPairs.length}`;
    timerElement.textContent = formatTime(gameTimer);
}

// End game
function endGame() {
    gameStarted = false;
    stopTimer();
    showVictoryMessage();
}
function showVictoryMessage() {
    document.getElementById('final-moves').textContent = moves;
    document.getElementById('final-time').textContent = formatTime(gameTimer);
    overlay.classList.remove('hidden');
    victoryMessage.classList.remove('hidden');
}
function hideVictoryMessage() {
    overlay.classList.add('hidden');
    victoryMessage.classList.add('hidden');
}

// Reset
function resetGame() {
    stopTimer();
    categoryButtonsContainer.classList.remove("hidden");
    resetBtn.classList.add("hidden");
    gameBoardElement.innerHTML = '';
    matchedPairs = moves = gameTimer = 0;
    updateDisplay();
    hideVictoryMessage();
}

// Events
resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);
document.addEventListener('DOMContentLoaded', hideVictoryMessage);

