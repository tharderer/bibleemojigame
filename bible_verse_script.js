import { signUp, logIn, saveTimeToLeaderboard, fetchLeaderboard, updateLeaderboard } from './firebase_leaderboard.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const auth = getAuth(app);
const correctOrder = [
  "for 🙏 so 💓 the 🌍,",
  "that he gave his only 🧒,",
  "that whosoever believeth in him",
  "should 🚫☠️",
  "but have ♾️💓."
];
const signUpForm = document.getElementById('signUpForm');
const logInForm = document.getElementById('logInForm');
const logOutButton = document.getElementById('logOutButton');
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
const setUsernameForm = document.getElementById('setUsernameForm');

let timer = 0;
let timerInterval;
// Global variable to store the current username
let currentUsername = null;


startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', resetGame);

setUsernameForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('usernameInput').value;

  if (username) {
    try {
      // Save the username locally for this session
      currentUsername = username;

      // Save the username to Firestore
      await saveUsernameToFirestore(auth.currentUser.uid, username);

      // Notify the user
      alert(`Username saved as: ${username}`);
      document.getElementById('setUsernamePrompt').classList.add('hidden'); // Hide username prompt
    } catch (error) {
      console.error('Error setting username:', error);
      alert('Failed to set username. Please try again.');
    }
  }
});

document.getElementById('signUpForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('signUpEmail').value;
  const password = document.getElementById('signUpPassword').value;

  try {
    await signUp(email, password);
    alert('Sign-up successful! Your score will be saved.');
    document.getElementById('authPrompt').classList.add('hidden'); // Hide auth prompt
    saveScoreAfterAuth(); // Save score
  } catch (error) {
    alert(`Error signing up: ${error.message}`);
  }
});

document.getElementById('logInForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('logInEmail').value;
  const password = document.getElementById('logInPassword').value;

  try {
    await logIn(email, password);
    alert('Log-in successful! Your score will be saved.');
    document.getElementById('authPrompt').classList.add('hidden'); // Hide auth prompt
    saveScoreAfterAuth(); // Save score
  } catch (error) {
    alert(`Error logging in: ${error.message}`);
  }
});

// Function to save the player's score after authentication
function saveScoreAfterAuth() {
  if (auth.currentUser) {
    saveTimeToLeaderboard(auth.currentUser.email, timer).then(() => {
      fetchLeaderboard().then((data) => updateLeaderboard(data));
      leaderboardSection.classList.remove('hidden'); // Show leaderboard
    });
  }
}
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

  if (auth.currentUser) {
    if (currentUsername) {
      // Save the score directly if the username is set
      saveTimeToLeaderboard(currentUsername, timer).then(() => {
        fetchLeaderboard().then((data) => updateLeaderboard(data));
        leaderboardSection.classList.remove('hidden'); // Show leaderboard
      });
    } else {
      // Prompt the user to set a username if not set
      document.getElementById('setUsernamePrompt').classList.remove('hidden');
    }
  } else {
    // Prompt login/signup if the user is not authenticated
    document.getElementById('authPrompt').classList.remove('hidden');
  }
}



function resetGame() {
  initializeGame();
  completionScreen.classList.add('hidden');
  gameArea.classList.remove('hidden');
  timerDisplay.classList.remove('hidden');
  startTimer();
}
