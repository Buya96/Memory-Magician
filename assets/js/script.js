/* jshint esversion: 11 */

// Game state vars
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
const gameDescription = document.getElementById('game-description');

// Category select
startBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        categoryButtonsContainer.classList.add("hidden");
        resetBtn.classList.remove("hidden");
        gameCategory = btn.id;

        document.body.classList.remove("chemistry-theme", "capitals-theme", "german-theme");
        if (gameCategory === "chemistry") {
            document.body.classList.add("chemistry-theme");
            gameDescription.textContent = "🧪 Match chemical elements with their symbols";
        } else if (gameCategory === "capitals") {
            document.body.classList.add("capitals-theme");
            gameDescription.textContent = "🌍 Match world capitals with their countries";
        } else if (gameCategory === "german") {
            document.body.classList.add("german-theme");
            gameDescription.textContent = "🇩🇪 Match German words to their meanings or icons";
        }

        initializeGame(gameCategory);
        startGame();
    });
});

// Initialise
function initializeGame(category) {
    if (category === "capitals") selectedPairs = capitalsPairs;
    else if (category === "chemistry") selectedPairs = chemistryPairs;
    else if (category === "german") selectedPairs = germanPairs;

    gameBoard = [];
    selectedPairs.forEach(pair => {
        gameBoard.push({ id: `${pair.id}-element`, content: pair.element, pairId: pair.id });
        gameBoard.push({ id: `${pair.id}-symbol`, content: pair.symbol, pairId: pair.id });
    });

    shuffleArray(gameBoard);
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameStarted = false;
    gameTimer = 0;
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

// Create board with fade & stagger
function createGameBoard() {
    if (gameBoardElement.children.length > 0) {
        gameBoardElement.classList.remove('fade-in');
        gameBoardElement.classList.add('fade-out');
        setTimeout(() => {
            renderCards();
            gameBoardElement.classList.remove('fade-out');
            gameBoardElement.classList.add('fade-in');
        }, 300);
    } else {
        renderCards();
        gameBoardElement.classList.add('fade-in');
    }
}

// Render cards
function renderCards() {
    gameBoardElement.innerHTML = '';
    gameBoard.forEach((card, index) => {
        const el = document.createElement('div');
        el.className = 'card face-down stagger-in';
        el.dataset.cardId = card.id;
        el.dataset.pairId = card.pairId;
        el.addEventListener('click', flipCard);
        el.style.animationDelay = `${index * 0.05}s`;
        gameBoardElement.appendChild(el);
    });

    // Remove stagger-in after deal animation
    setTimeout(() => {
        document.querySelectorAll('.card.stagger-in').forEach(card => {
            card.classList.remove('stagger-in');
        });
    }, 800);
}

// Flip
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

// Check match — fixed order
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
        c1.element.classList.remove('flipped');
        c2.element.classList.remove('flipped');
        c1.element.classList.add('face-down');
        c2.element.classList.add('face-down');
    }
    flippedCards = [];
    updateDisplay();
}

// Start
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

// UI updates
function updateDisplay() {
    movesElement.textContent = moves;
    matchesElement.textContent = `${matchedPairs}/${selectedPairs.length}`;
    timerElement.textContent = formatTime(gameTimer);
}

// Endgame
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
    matchedPairs = 0;
    moves = 0;
    gameTimer = 0;
    updateDisplay();
    hideVictoryMessage();
    gameDescription.textContent = "Select a category and match the pairs";
    document.body.classList.remove("chemistry-theme", "capitals-theme", "german-theme");
}

// Events
resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);
document.addEventListener('DOMContentLoaded', hideVictoryMessage);


