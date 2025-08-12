/* jshint esversion: 11 */
// State
let gameBoard = [], flippedCards = [], selectedPairs = [];
let matchedPairs = 0, moves = 0, gameStarted = false;
let gameTimer = 0, timerInterval = null, gameCategory = "";

// Elements
const gameBoardElement       = document.getElementById('game-board');
const movesElement           = document.getElementById('moves-count');
const matchesElement         = document.getElementById('matches-count');
const timerElement           = document.getElementById('timer');
const startBtns              = document.querySelectorAll('.start-btn');
const resetBtn               = document.getElementById('reset-btn');
const categoryButtonsContainer = document.querySelector('.category-buttons');
const victoryMessage         = document.getElementById('victory-message');
const playAgainBtn           = document.getElementById('play-again-btn');
const overlay                = document.getElementById('overlay');
const gameDescription        = document.getElementById('game-description');

// Theme toggle
startBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtonsContainer.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    gameCategory = btn.id;
    document.body.classList.remove('chemistry-theme','capitals-theme','german-theme');
    if (gameCategory==='chemistry') {
      document.body.classList.add('chemistry-theme');
      gameDescription.textContent = '🧪 Match chemical elements with their symbols';
    } else if (gameCategory==='capitals') {
      document.body.classList.add('capitals-theme');
      gameDescription.textContent = '🌍 Match world capitals with their countries';
    } else {
      document.body.classList.add('german-theme');
      gameDescription.textContent = '🇩🇪 Match German words to their meanings or icons';
    }
    initializeGame(gameCategory);
    startGame();
  });
});

// Initialize
function initializeGame(category) {
  if      (category==='capitals') selectedPairs=capitalsPairs;
  else if (category==='chemistry') selectedPairs=chemistryPairs;
  else                              selectedPairs=germanPairs;
  gameBoard=[]; selectedPairs.forEach(p=>{
    gameBoard.push({id:`${p.id}-element`,content:p.element,pairId:p.id});
    gameBoard.push({id:`${p.id}-symbol`, content:p.symbol,pairId:p.id});
  });
  shuffleArray(gameBoard);
  flippedCards=[]; matchedPairs=0; moves=0; gameStarted=false; gameTimer=0;
  updateDisplay(); createGameBoard(); hideVictoryMessage();
}

// Shuffle
function shuffleArray(a) {
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}

// Create board
function createGameBoard() {
  if (gameBoardElement.children.length>0) {
    gameBoardElement.classList.replace('fade-in','fade-out');
    setTimeout(()=>{
      renderCards();
      gameBoardElement.classList.replace('fade-out','fade-in');
    },300);
  } else {
    renderCards();
    gameBoardElement.classList.add('fade-in');
  }
}

// Render with stagger
function renderCards() {
  gameBoardElement.innerHTML='';
  gameBoard.forEach((card,i)=>{
    const el=document.createElement('div');
    el.className='card face-down stagger-in';
    el.dataset.cardId=card.id;
    el.dataset.pairId=card.pairId;
    el.addEventListener('click',flipCard);
    el.style.animationDelay=`${i*0.05}s`;
    gameBoardElement.appendChild(el);
  });
  setTimeout(()=>{
    document.querySelectorAll('.card.stagger-in')
      .forEach(c=>c.classList.remove('stagger-in'));
  },800);
}

// Flip card
function flipCard(e) {
  if(!gameStarted) return;
  const el=e.currentTarget;
  if(el.classList.contains('flipped')||
     el.classList.contains('matched')||
     flippedCards.length>=2) return;
  const data=gameBoard.find(c=>c.id===el.dataset.cardId);
  el.classList.replace('face-down','flipped');
  el.textContent=data.content;
  flippedCards.push({element:el,data});
  if(flippedCards.length===2){
    moves++; updateDisplay();
    setTimeout(checkMatch,1000);
  }
}

// Check match with soft fade-back
function checkMatch(){
  const [c1,c2]=flippedCards;
  if(c1.data.pairId===c2.data.pairId){
    c1.element.classList.add('matched');
    c2.element.classList.add('matched');
    matchedPairs++;
    if(matchedPairs===selectedPairs.length) endGame();
    flippedCards=[];
  } else {
    c1.element.classList.add('fade-back');
    c2.element.classList.add('fade-back');
    setTimeout(()=>{
      [c1,c2].forEach(c=>{
        c.element.textContent='';
        c.element.classList.remove('flipped','fade-back');
        c.element.classList.add('face-down');
      });
      flippedCards=[]; updateDisplay();
    },500);
  }
}

// Start & timer
function startGame(){ gameStarted=true; startTimer(); }
function startTimer(){
  timerInterval=setInterval(()=>{
    gameTimer++; updateDisplay();
  },1000);
}
function stopTimer(){ clearInterval(timerInterval); timerInterval=null; }
function formatTime(sec){
  const m=Math.floor(sec/60), s=sec%60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

// Update UI
function updateDisplay(){
  movesElement.textContent=moves;
  matchesElement.textContent=`${matchedPairs}/${selectedPairs.length}`;
  timerElement.textContent=formatTime(gameTimer);
}

// End & victory
function endGame(){ gameStarted=false; stopTimer(); showVictoryMessage(); }
function showVictoryMessage(){
  document.getElementById('final-moves').textContent=moves;
  document.getElementById('final-time').textContent=formatTime(gameTimer);
  overlay.classList.remove('hidden');
  victoryMessage.classList.remove('hidden');
}
function hideVictoryMessage(){
  overlay.classList.add('hidden');
  victoryMessage.classList.add('hidden');
}

// Reset
function resetGame(){
  stopTimer();
  categoryButtonsContainer.classList.remove('hidden');
  resetBtn.classList.add('hidden');
  gameBoardElement.innerHTML='';
  matchedPairs=0; moves=0; gameTimer=0;
  updateDisplay(); hideVictoryMessage();
  gameDescription.textContent='Select a category and match the pairs';
  document.body.classList.remove('chemistry-theme','capitals-theme','german-theme');
}

// Events
resetBtn.addEventListener('click',resetGame);
playAgainBtn.addEventListener('click',resetGame);
document.addEventListener('DOMContentLoaded',hideVictoryMessage);



