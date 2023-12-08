import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, set,get, update} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDWqGs9vUxSrR1Vd4jvrN-u0fxtp6pXY4U",
    authDomain: "simple-quiz-253e5.firebaseapp.com",
    databaseURL: "https://simple-quiz-253e5-default-rtdb.firebaseio.com",
    projectId: "simple-quiz-253e5",
    storageBucket: "simple-quiz-253e5.appspot.com",
    messagingSenderId: "706223871533",
    appId: "1:706223871533:web:a6d5bfb8983441fc4c0aa4"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  export default db;