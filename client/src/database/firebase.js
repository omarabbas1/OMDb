import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCozqtU31BXepbw2pk-IoFgUGCmD1KTAH8",
    authDomain: "imdb-db24f.firebaseapp.com",
    projectId: "imdb-db24f",
    storageBucket: "imdb-db24f.appspot.com",
    messagingSenderId: "335576641763",
    appId: "1:335576641763:web:4d7d1a141743dfc89f95d6",
    measurementId: "G-5C9R0TP296"
};

// // init firebase app
initializeApp(firebaseConfig);


// // init services
const db = getFirestore()


//export to use 
export { db };

