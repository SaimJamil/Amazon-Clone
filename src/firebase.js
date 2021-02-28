import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAQAYzVsGC6ruIAyaEw5p57-7PjQHTaHT8",
    authDomain: "clone-5fe02.firebaseapp.com",
    projectId: "clone-5fe02",
    storageBucket: "clone-5fe02.appspot.com",
    messagingSenderId: "677272212345",
    appId: "1:677272212345:web:a8017bcc5c881908f495a8",
    measurementId: "G-S705SX1852"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db=firebaseApp.firestore();
  const auth=firebaseApp.auth();

  export {db , auth};