import { saveTimeToLeaderboard, fetchLeaderboard, updateLeaderboard } from './firebase_leaderboard.js';

const correctOrder = [
  "for 🙏 so 💓 the 🌍,",
  "that he gave his only 🧒,",
  "that whosoever believeth in him",
  "should 🚫☠️",
  "but have ♾️💓."
];

const startBtn = document.getElementById('startBtn');
const scrambleBox = document.getElementById('scrambleBox');
const unscrambleBox = document.getElementById('unscrambleBox');
const timerDisplay = document.getElementById('timer');
const gameArea = document.getElementById('gameArea');
const startScreen = document.getElementById('startScreen');
const completionScreen = document.getElementById('completionScreen');
const finalTime = document.getElementById('finalTime');
const leaderboardSection = document.getElementById('leaderboardSection');
const playAgainBtn = document.getElementById('playAgainBtn');
const leaderboardList = document.getElementById('leaderboard');

let timer = 0;
let timerInterval;

startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', resetGame);

function startGame() {
  initializeGame();
  startScreen.classList.add('hidden');
  gameArea.classList.remove('hidden');
  timerDisplay.classList.remove('hidden');

  startTimer();
}

function initializeGame() {
  clearInterval(timerInterval);
  timer = 0;
  updateTimer();
  scrambleBox.innerHTML = '';
  unscrambleBox.querySelectorAll('.slot').forEach((slot) => {
    slot.innerHTML = '';
  });

  const scrambledOrder = shuffleWithoutCorrectPositions([...correctOrder]);

  scrambledOrder.forEach((line) => {
    const div = document.createElement('div');
    div.classList.add('draggable');
    div.textContent = line;
    scrambleBox.appendChild(div);
  });

  setupInteractDrag();
}

function shuffleWithoutCorrectPositions(array) {
  let isDeranged;
  do {
    array.sort(() => Math.random() - 0.5);
    isDeranged = array.every((line, index) => line !== correctOrder[index]);
  } while (!isDeranged);
  return array;
}

function setupInteractDrag() {
  interact('.draggable').unset();

  interact('.draggable').draggable({
    inertia: true,
    listeners: {
      start(event) {
        event.target.classList.add('dragging');
      },
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
      end(event) {
        event.target.classList.remove('dragging');
      }
    }
  });

  interact('.slot').unset();

  interact('.slot').dropzone({
    accept: '.draggable',
    overlap: 0.5,
    ondrop(event) {
      const draggableElement = event.relatedTarget;
      const dropzoneElement = event.target;

      dropzoneElement.appendChild(draggableElement);
      draggableElement.style.transform = 'none';
      draggableElement.removeAttribute('data-x');
      draggableElement.removeAttribute('data-y');

      checkOrder();
    }
  });
}

function checkOrder() {
  const slots = document.querySelectorAll('.slot');
  const currentOrder = Array.from(slots).map((slot) => slot.textContent.trim());

  if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
    clearInterval(timerInterval);
    showCompletionScreen();
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    updateTimer();
  }, 1000);
}

function updateTimer() {
  timerDisplay.textContent = `Time: ${timer}s`;
}

function showCompletionScreen() {
  gameArea.classList.add('hidden');
  timerDisplay.classList.add('hidden');
  completionScreen.classList.remove('hidden');

  finalTime.textContent = `You solved the puzzle in ${timer} seconds!`;

  const playerName = prompt('Enter your name for the leaderboard:');
  if (playerName) {
    saveTimeToLeaderboard(playerName, timer).then(() => {
      fetchLeaderboard().then((data) => {
        updateLeaderboard(data);
        leaderboardSection.classList.remove('hidden'); // Show the leaderboard
      });
    });
  } else {
    fetchLeaderboard().then((data) => {
      updateLeaderboard(data);
      leaderboardSection.classList.remove('hidden');
    });
  }
}

function resetGame() {
  initializeGame();
  completionScreen.classList.add('hidden');
  gameArea.classList.remove('hidden');
  timerDisplay.classList.remove('hidden');
  startTimer();
}
