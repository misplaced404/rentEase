// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDJvw_LQe7DFUTV3uegJbyrFDcI7aemgw",
  authDomain: "rentease-73c75.firebaseapp.com",
  projectId: "rentease-73c75",
  storageBucket: "rentease-73c75.appspot.com",
  messagingSenderId: "207104531702",
  appId: "1:207104531702:web:291cb5b64c3f213f45a0d7",
  measurementId: "G-86NS6HJVFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
