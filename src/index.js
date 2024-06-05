import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'firebase/firestore';
import firebase from 'firebase/app'; // Import Firebase
import 'bootstrap/dist/css/bootstrap.min.css';
import fbConfig from './fbConfig'; // Import firebase from your firebase.js file

firebase.initializeApp(fbConfig);

// Wait for Firebase authentication to be ready before rendering the app
firebase.auth().onAuthStateChanged(() => {
  const root = document.getElementById('root');
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
