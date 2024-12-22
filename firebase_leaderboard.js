// firebase_leaderboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDxjy9pqeA-JGYEB0mHdtkPwW5Ie8vjYeQ",
    authDomain: "bible-verse-emoji-game.firebaseapp.com",
    projectId: "bible-verse-emoji-game",
    storageBucket: "bible-verse-emoji-game.firebasestorage.app",
    messagingSenderId: "781380545410",
    appId: "1:781380545410:web:d024acf9b3e8b8f10dfd9b",
    measurementId: "G-0NWQ5V6EHT"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
/**
 * Save player's time to the leaderboard.
 * @param {string} playerName - Name of the player.
 * @param {number} time - Completion time.
 */
export async function saveTimeToLeaderboard(playerName, time) {
  try {
    await addDoc(collection(db, 'leaderboard'), {
      name: playerName,
      time: time,
      timestamp: new Date(), // Optional for sorting
    });
    console.log('Time saved to leaderboard');
  } catch (error) {
    console.error('Error saving time:', error);
  }
}

/**
 * Fetch the leaderboard data.
 */
export async function fetchLeaderboard() {
  try {
    const leaderboardRef = collection(db, 'leaderboard');
    const leaderboardQuery = query(leaderboardRef, orderBy('time', 'asc'), limit(10));
    const querySnapshot = await getDocs(leaderboardQuery);

    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push(doc.data());
    });

    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

/**
 * Update the leaderboard in the DOM.
 * @param {Array} data - Leaderboard data to display.
 */
export function updateLeaderboard(data) {
  const leaderboardList = document.getElementById('leaderboard');
  leaderboardList.innerHTML = '';
  data.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = `${entry.name} - ${entry.time}s`;
    leaderboardList.appendChild(li);
  });
}
