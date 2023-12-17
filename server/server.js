const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const { db, getDocs, addDoc, usersRef, updateDoc, moviesRef, Timestamp, doc, getDoc, reviewRef, actorsRef } = require('./config');
// const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./GoogleAuthSetUp')
require('./FacebookAuthSetUp');
require('dotenv').config();
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const watchListRoute = require('./routes/watchlist');


app.use(express.json());

// Allow requests from localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(passport.initialize());
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use('/watchlist', watchListRoute);

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

app.get('/token', authenticateToken, (req, res) => {
    const name = req.user.name;
    const email = req.user.email;
    res.json({
        name: name,
        email: email
    });
})

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    // const usersRef = collection(db, 'users');
    const time = Timestamp.now().toDate();
    const readableDate = time.getFullYear() + '-'
        + ('0' + (time.getMonth() + 1)).slice(-2) + '-'
        + ('0' + time.getDate()).slice(-2)
    try {
        const snapshot = await getDocs(usersRef);
        const emailFound = snapshot.docs.some(doc => doc.data().email === email);
        let newUser;
        if (emailFound) {
            res.json('email already exists')
            return;
        }
        else if (password === undefined) {
            newUser = {
                name,
                email,
                gender: '',
                dateOfBirth: '',
                country: '',
                profile_pic: '',
                watchlist: [],
                createdAt: readableDate,
                reviews: [],
                topPicks: []
            }
        }
        else {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds)
            const hashedpassword = await bcrypt.hash(password, salt)
            newUser = {
                name,
                email,
                password: hashedpassword,
                gender: '',
                dateOfBirth: '',
                country: '',
                profile_pic: '',
                watchlist: [],
                createdAt: readableDate,
                reviews: []
            }
        }
        addDoc(usersRef, newUser)
        res.json('user created')
    }
    catch (error) {
        console.log(error);
        res.status(500).json('Server Error');
    }
})


app.post('/signin', async (req, res) => {
    const { password, email, rememberMe } = req.body;
    // const usersRef = collection(db, 'users');
    let user = {};

    try {
        const snapshot = await getDocs(usersRef);
        user = snapshot.docs.find(doc => doc.data().email === email);
        if (user === undefined) {
            res.json('email not found');
        } else {
            const isMatch = await bcrypt.compare(password, user.data().password);
            if (isMatch) {
                const userPayload = {
                    name: user.data().name,
                    email: user.data().email
                }
                const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: rememberMe ? '7d' : '1d' })
                res.json({ userPayload, accessToken })
            } else {
                res.json('password incorrect');
            }
        }
    } catch (error) {
        console.log(error);
    }
});

app.get('/recentmovies', async (req, res) => {
    try {
        const snapshot = await getDocs(moviesRef);
        const movies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        const notComingSoonMovies = movies.filter(movie => movie.status !== 'coming soon');
        res.json(notComingSoonMovies.slice(-5)); // Return last 5 movies
    }
    catch (err) {
        res.status(500).send('error')
        console.error('Error updating document', error);
    }
})

app.get('/comingsoon', async (req, res) => {  // getting comming soon movies
    try {
        const snapshot = await getDocs(moviesRef);
        const movies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        const commingsoon = movies.filter((movie) => movie.status === 'coming soon');
        res.json(commingsoon);
    }
    catch (err) {
        res.status(500).send('error');
        console.error('Error fetching coming soon movies', err);
    }
});

app.get('/featured', async (req, res) => {   // getting featured movies
    try {
        const random = [];
        const snapshot = await getDocs(moviesRef);
        const filtermovies = snapshot.docs.filter((doc) => doc.data().status !== 'coming soon');
        const movies = filtermovies.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        function getRandomMoviesArray(array, count) {
            const randomMovies = [];
            const moviesCopy = [...array];
            for (let i = 0; i < count; i++) {
                const randomIndex = getRandomInt(0, moviesCopy.length - 1);
                const randomMovie = moviesCopy.splice(randomIndex, 1)[0];
                randomMovies.push(randomMovie);
            }
            return randomMovies;
        }
        const threeRandomMovies = getRandomMoviesArray(movies, 3);
        res.json(threeRandomMovies);
    }
    catch (error) {
        res.status(500).send('error');
        console.error('Error getting the featured movies', error);
    }
})


app.get('/movie/:id', async (req, res) => { //for moviesdetails1 
    const movieId = req.params.id;
    try {
        const docRef = doc(moviesRef, movieId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log(docSnap.data());
            res.json(docSnap.data());
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.error('Error fetching movie details', error);
    }
});

// app.get('movies/featuredmovies/:id', async (req, res) => { //to get feautred movie detail

// })

// app.get('movies/recentmovies/:id', async (req, res) => {  //to get recent movie detail

// })





// app.get('/watchlist', authenticateToken, async (req, res) => {
//     const { email } = req.user;
//     try {
//         const userSnapshot = await getDocs(usersRef);
//         const user = userSnapshot.docs.find(doc => doc.data().email === email);
//         const watchlist = user.data().watchlist;
//         const movieSnapshot = await getDocs(moviesRef);
//         const movies = movieSnapshot.docs.filter((movie) => watchlist.includes(movie.id));
//         res.json(movies);
//     }
//     catch (error) {
//         console.log(error);
//     }
// });

// app.get('/')


app.post('/reviews/:id', authenticateToken, async (req, res) => {
    const { email } = req.user;
    const { rating, review_title, review_body } = req.body.reviewData;
    const movie_id = req.params.id;
    // console.log('rating', rating);
    // console.log(review_title);
    // console.log(review_body);
    try {
        const userSnapshot = await getDocs(usersRef);
        const user = userSnapshot.docs.find((doc) => doc.data().email === email);
        // console.log(user.data());
        const moviesdocRef = doc(moviesRef, movie_id);
        const movie = await getDoc(moviesdocRef);
        // console.log(movie.data());

        const newReview = {
            title: review_title,
            rating: rating,
            reviewBody: review_body,
            movie_name: movie.data().name,
            added_by: user.data().name,
            created_at: new Date().toISOString() // Add a timestamp in ISO 8601 format
        }
        let prevMovieReviews = movie.data().reviews;
        // console.log(prevMovieReviews);
        prevMovieReviews.push(newReview);
        let updatedData = {
            reviews: prevMovieReviews,
            review_count: movie.data().review_count + 1
        }
        await updateDoc(movie.ref, updatedData);

        let prevUserReviews = user.data().reviews /*|| []*/;
        prevUserReviews.push(newReview);
        if (rating >= 8) {
            let prevTopPicks = user.data().topPicks;
            const found = prevTopPicks.some((review) => review.movie_name === newReview.movie_name)
            if (!found) {
                prevTopPicks.push(newReview);
                updatedData = {
                    reviews: prevUserReviews,
                    topPicks: prevTopPicks
                }
            }
            else {
                updatedData = {
                    reviews: prevUserReviews
                }
            }
        }
        else {
            updatedData = {
                reviews: prevUserReviews
            }
        }
        await updateDoc(user.ref, updatedData);
        res.json('successfully posted review');
    }
    catch (error) {
        console.log(error);
    }
});

app.get('/reviews/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const movieRef = doc(moviesRef, movieId);
        const movie = await getDoc(movieRef);
        res.json({ reviews: movie.data().reviews, message: 'success' })
    }
    catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
});

app.get('/actors', async (req, res) => {
    const snapshot = await getDocs(actorsRef);
    const actors = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    // console.log(actors);
    res.json(actors);
});

// app.get('/overwrite', async (req, res) => {
//     // for (var i = 0; i < 60; i++) {
//     //     let newfield = {
//     //         name: '',
//     //         bio: '',
//     //         dob: '',
//     //         image: '',
//     //         movies: []
//     //     };
//     //     addDoc(actorsRef, newfield);
//     // }
//     // res.json('success');
//     try {
//         const moviesSnap = await getDocs(moviesRef);
//         const updatePromises = moviesSnap.docs.map(doc => {
//             let newfield = { watchlist: [] };
//             return updateDoc(doc.ref, newfield);
//         });

//         await Promise.all(updatePromises); // Wait for all update operations to complete
//         console.log("All documents updated successfully");
//     } catch (error) {
//         console.error("Error updating documents: ", error);
//     }

// });
app.get('/overwrite', async (req, res) => {
    const movieSnapshot = await getDocs(moviesRef);
    let newfield = { watchlist: [] };
    for (const doc of movieSnapshot.docs) {
        await updateDoc(doc.ref, newfield);
    }
    res.json('success');
})

// app.get('/createcollection', async (req, res) => {

//     const temp = {
//         'value': 'test'
//     }
//     addDoc(actorsRef, temp);

// });


app.get('/actorsdetails/:id', async (req, res) => {
    const actorId = req.params.id;
    // console.log(actorId);
    try {
        const actorRef = doc(actorsRef, actorId);
        const actorSnapshot = await getDoc(actorRef);

        if (actorSnapshot.exists()) {
            const actorData = actorSnapshot.data();
            res.json(actorData);
        } else {
            res.status(404).json({ message: 'Actor not found' });
        }
    } catch (error) {
        console.error('Error fetching actor:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});



app.listen(5000, () => console.log('listening on port 5000'));

