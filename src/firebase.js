import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCNv6Gf32bZ1hCZPyUWOYRq5WsVSthuXrc",
  authDomain: "kanashiro-pasteis.firebaseapp.com",
  databaseURL: "https://kanashiro-pasteis-default-rtdb.firebaseio.com",
  projectId: "kanashiro-pasteis",
  storageBucket: "kanashiro-pasteis.appspot.com",
  messagingSenderId: "696012329640",
  appId: "1:696012329640:web:d841e8a347f70450c2a89d",
  measurementId: "G-G4K9FWPRCT"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };
