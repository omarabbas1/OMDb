const { initializeApp } = require('@firebase/app');
const { getFirestore, collection, getDocs, addDoc, updateDoc, Timestamp, doc, getDoc } = require('@firebase/firestore');
const { getStorage } = require('@firebase/storage');


const firebaseConfig = { // new
    apiKey: "AIzaSyCdXCDX3KmLfCSzCvyb6gtkNHsy5daGy7I",
    authDomain: "imdb-final-a70ca.firebaseapp.com",
    projectId: "imdb-final-a70ca",
    storageBucket: "imdb-final-a70ca.appspot.com",
    messagingSenderId: "431556448450",
    appId: "1:431556448450:web:374e181241f24602cbeb5b",
    measurementId: "G-CBSH2QSG2X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const moviesRef = collection(db, 'movies');
const usersRef = collection(db, 'users');
const reviewRef = collection(db, 'reviews');
const actorsRef = collection(db, 'actors');

module.exports = { db, getDocs, addDoc, usersRef, updateDoc, moviesRef, storage, Timestamp, doc, getDoc, reviewRef, actorsRef };

