<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const analytics = getAnalytics(app);
</script>
