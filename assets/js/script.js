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
const playAgainBtn = document.getElementById('play-again-btn'); // New reference

// Category button click listener
startBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        categoryButtonsContainer.classList.add("hidden"); // hide category buttons
        resetBtn.classList.remove("hidden");              // show reset
        gameCategory = btn.id;
        initializeGame(gameCategory);
        startGame();
    });
});

// Initialise with chosen category
function initializeGame(category) {
    // Pick dataset based on category
    if (category === "capitals") {
        selectedPairs = capitalsPairs;
    } else if (category === "chemistry") {
        selectedPairs = chemistryPairs;
    } else if (category === "german") {
        selectedPairs = germanPairs;
    } else {
        selectedPairs = chemistryPairs; // fallback
    }

    // Build card set
    gameBoard = [];
    selectedPairs.forEach(pair => {
        gameBoard.push({ id: `${pair.id}-element`, content: pair.element, pairId: pair.id, type: 'element' });
        gameBoard.push({ id: `${pair.id}-symbol`, content: pair.symbol, pairId: pair.id, type: 'symbol' });
    });

    shuffleArray(gameBoard);

    // Reset state vars
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameStarted = false;
    gameTimer = 0;

    updateDisplay();
    createGameBoard();
    hideVictoryMessage();
}

// Shuffle function
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
        const cardElement = document.createElement('div');
        cardElement.className = 'card face-down';
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.pairId = card.pairId;
        cardElement.addEventListener('click', flipCard);
        gameBoardElement.appendChild(cardElement);
    });
}

// Card flip logic
function flipCard(e) {
    if (!gameStarted) return;
    
    const cardElement = e.currentTarget;
    const cardId = cardElement.dataset.card

