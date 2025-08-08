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
