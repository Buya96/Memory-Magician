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

// Fisher-Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create visual game board
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

// Handle card flip
function flipCard(event) {
    if (!gameStarted) return;
    
    const cardElement = event.currentTarget;
    const cardId = cardElement.dataset.cardId;
    
    // Prevent invalid flips
    if (cardElement.classList.contains('flipped') || 
        cardElement.classList.contains('matched') ||
        flippedCards.length >= 2) {
        return;
    }
    
    const cardData = gameBoard.find(card => card.id === cardId);

    // Flip the card
    cardElement.classList.remove('face-down');
    cardElement.classList.add('flipped');
    cardElement.textContent = cardData.content;
    
    flippedCards.push({ element: cardElement, data: cardData });
    
    // Check for match when 2 cards flipped
    if (flippedCards.length === 2) {
        moves++;
        updateDisplay();
        setTimeout(checkMatch, 1000);
    }
}
// Check if cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.data.pairId === card2.data.pairId) {
        // Match found
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
        
        matchedPairs++;
        updateDisplay();
        
        // Check if game complete
        if (matchedPairs === chemistryPairs.length) {
            endGame();
        }
    } else {
        // No match - flip back
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
        card1.element.classList.add('face-down');
        card2.element.classList.add('face-down');
        card1.element.textContent = '';
        card2.element.textContent = '';
    }
    
    flippedCards = [];
}

// Start game
function startGame() {
    gameStarted = true;
    startTimer();
    startBtn.textContent = 'Game Started';
    startBtn.disabled = true;
}

// Timer functions
function startTimer() {
    timerInterval = setInterval(() => {
        gameTimer++;
        updateDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Update display
function updateDisplay() {
    movesElement.textContent = moves;
    matchesElement.textContent = `${matchedPairs}/${chemistryPairs.length}`;
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
    victoryMessage.classList.remove('hidden');
}

function hideVictoryMessage() {
    victoryMessage.classList.add('hidden');
}

// Reset game
function resetGame() {
    stopTimer();
    startBtn.textContent = 'Start Game';
    startBtn.disabled = false;
    initializeGame();
}

// Event listeners
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeGame);
