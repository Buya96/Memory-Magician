// Chemistry data
const chemistryPairs = [
    { id: 1, element: "Hydrogen", symbol: "H" },
    { id: 2, element: "Carbon", symbol: "C" },
    { id: 3, element: "Nitrogen", symbol: "N" },
    { id: 4, element: "Oxygen", symbol: "O" },
    { id: 5, element: "Sodium", symbol: "Na" },
    { id: 6, element: "Iron", symbol: "Fe" },
    { id: 7, element: "Gold", symbol: "Au" },
    { id: 8, element: "Silver", symbol: "Ag" }
];

// Game state
let gameBoard = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let gameTimer = 0;
let timerInterval = null;

// DOM elements
const gameBoardElement = document.getElementById('game-board');
const movesElement = document.getElementById('moves-count');
const matchesElement = document.getElementById('matches-count');
const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const victoryMessage = document.getElementById('victory-message');

// Initialize game
function initializeGame() {
    // Create card pairs
    gameBoard = [];
    chemistryPairs.forEach(pair => {
        gameBoard.push({
            id: `${pair.id}-element`,
            content: pair.element,
            pairId: pair.id,
            type: 'element'
        });
        gameBoard.push({
            id: `${pair.id}-symbol`,
            content: pair.symbol,
            pairId: pair.id,
            type: 'symbol'
        });
    });
    
    shuffleArray(gameBoard);

    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameStarted = false;
    gameTimer = 0;
    
    updateDisplay();
    createGameBoard();
    hideVictoryMessage();
}

