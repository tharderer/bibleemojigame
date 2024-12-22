// firebase_leaderboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
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
