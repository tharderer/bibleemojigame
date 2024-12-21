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
const correctVerse = document.getElementById('correctVerse');
const playAgainBtn = document.getElementById('playAgainBtn');

let timer = 0;
let timerInterval;

startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', resetGame);

function startGame() {
  initializeGame();
  startScreen.classList.add('hidden');
  gameArea.classList.remove('hidden');
  timerDisplay.classList.remove('hidden');

  timerInterval = setInterval(() => {
    timer++;
    updateTimer();
  }, 1000);
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
    div.draggable = true;
    scrambleBox.appendChild(div);
  });

  setupDragAndDrop();
}

function shuffleWithoutCorrectPositions(array) {
  let isDeranged;
  do {
    array.sort(() => Math.random() - 0.5);
    isDeranged = array.every((line, index) => line !== correctOrder[index]);
  } while (!isDeranged);
  return array;
}

function setupDragAndDrop() {
  const draggables = document.querySelectorAll('.draggable');
  const slots = document.querySelectorAll('.slot');

  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', (e) => {
      draggable.classList.add('dragging');
      e.dataTransfer.setData('text/plain', draggable.textContent);
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });
  });

  slots.forEach((slot) => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    slot.addEventListener('drop', (e) => {
      const draggingElement = document.querySelector('.dragging');
      if (draggingElement) {
        slot.appendChild(draggingElement);
        checkOrder();
      }
    });
  });

  scrambleBox.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  scrambleBox.addEventListener('drop', (e) => {
    const draggingElement = document.querySelector('.dragging');
    if (draggingElement) {
      scrambleBox.appendChild(draggingElement);
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

function updateTimer() {
  timerDisplay.textContent = `Time: ${timer}s`;
}

function showCompletionScreen() {
  gameArea.classList.add('hidden');
  timerDisplay.classList.add('hidden');
  completionScreen.classList.remove('hidden');

  finalTime.textContent = `You solved the puzzle in ${timer} seconds!`;
  correctVerse.innerHTML = '';
  correctOrder.forEach((line) => {
    const li = document.createElement('li');
    li.textContent = line;
    correctVerse.appendChild(li);
  });
}

function resetGame() {
  initializeGame();
  completionScreen.classList.add('hidden');
  gameArea.classList.remove('hidden');
  timerDisplay.classList.remove('hidden');
}
