// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxjy9pqeA-JGYEB0mHdtkPwW5Ie8vjYeQ",
  authDomain: "bible-verse-emoji-game.firebaseapp.com",
  projectId: "bible-verse-emoji-game",
  storageBucket: "bible-verse-emoji-game.firebasestorage.app",
  messagingSenderId: "781380545410",
  appId: "1:781380545410:web:d024acf9b3e8b8f10dfd9b",
  measurementId: "G-0NWQ5V6EHT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// Firestore Functions
/**
 * Save player's time to the leaderboard
 * @param {string} playerName - Name of the player
 * @param {number} time - Player's time
 */
export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}
export async function logIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}
export async function logOut() {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

export async function saveTimeToLeaderboard(username, time) {
  try {
    await addDoc(collection(db, 'leaderboard'), {
      username: username, // Store username
      time: time,         // Store the player's time
      timestamp: new Date(), // Optional: for future sorting if needed
    });
  } catch (error) {
    console.error('Error saving time:', error);
  }
}

// Save the username to Firestore
async function saveUsernameToFirestore(userId, username) {
  try {
    const userDocRef = doc(db, 'users', userId); // 'users' collection with userId as the document ID
    await setDoc(userDocRef, { username: username }, { merge: true });
    console.log('Username saved to Firestore');
  } catch (error) {
    console.error('Error saving username to Firestore:', error);
    throw error;
  }
}

/**
 * Fetch the leaderboard data
 * @returns {Array} Leaderboard data
 */
export async function fetchLeaderboard() {
  try {
    const leaderboardRef = collection(db, 'leaderboard');
    const leaderboardQuery = query(leaderboardRef, orderBy('time', 'asc'), limit(10));
    const querySnapshot = await getDocs(leaderboardQuery);

    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}


/**
 * Update the leaderboard in the DOM
 * @param {Array} data - Leaderboard data
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
