const router = require('express').Router();
const { db, getDocs, addDoc, usersRef, updateDoc, moviesRef, Timestamp, doc, getDoc, reviewRef } = require('../config');
const { ref, uploadBytes, getDownloadURL } = require('@firebase/storage');
const jwt = require('jsonwebtoken');
const { route } = require('./auth');



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return null;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.json('token expired');
        }
        req.user = user;
        next();
    })
}


router.get('/', authenticateToken, async (req, res) => {
    const { email } = req.user;
    try {
        const userSnapshot = await getDocs(usersRef);
        const user = userSnapshot.docs.find(doc => doc.data().email === email);
        const watchlist = user.data().watchlist;
        // console.log(watchlist);
        res.json(watchlist);
    }
    catch (error) {
        console.log(error);
    }
});

router.post('/additem', authenticateToken, async (req, res) => {
    const { id } = req.body;
    const { email } = req.user;
    console.log(email);
    try {
        const docRef = doc(moviesRef, id);
        const movieSnap = await getDoc(docRef);
        const movie = {
            ...movieSnap.data(),
            id: movieSnap.id
        }
        const userSnap = await getDocs(usersRef);
        const user = userSnap.docs.find((doc) => doc.data().email === email)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // console.log(movie.id);
        // const movieFound = user.data().watchlist.find((movie) => movie.id === id);
        // console.log(movieFound);
        // if (movieFound !== undefined) {
        //     res.json({ message: 'movie already in watchlist' });
        // }
        // else {
        const watchlist = user.data().watchlist;
        watchlist.push(movie);
        await updateDoc(user.ref, { watchlist: watchlist });
        res.json({ data: user.data().watchlist, message: 'success' });
        // }
    }
    catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
})


router.delete('/deleteitem', authenticateToken, async (req, res) => {
    const { id } = req.body;
    const { email } = req.user;
    const userSnap = await getDocs(usersRef);
    const user = userSnap.docs.find((doc) => doc.data().email === email);
    const watchlist = user.data().watchlist;
    console.log(watchlist);
    const filteredWatchList = watchlist.filter((movie) => movie.id !== id)
    // console.log('filtered:', filteredWatchList);
    await updateDoc(user.ref, { watchlist: filteredWatchList });
    res.json('movie successfully removed from watchlist');
})

router.get('/checkwatchlist/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    if (req.user === undefined) {
        res.json('movie not in watchlist');
    }
    else {
        const { email } = req.user;
        console.log(email);
        console.log('here')
        const userSnap = await getDocs(usersRef);
        const user = userSnap.docs.find((doc) => doc.data().email === email)
        console.log(user);
        const movieFound = user.data().watchlist.some((movie) => movie.id === id);
        console.log(movieFound);
        if (movieFound) {
            res.json('movie in watchlist');
        }
        else {
            res.json('movie not in watchlist');
        }
    }
});

module.exports = router;


