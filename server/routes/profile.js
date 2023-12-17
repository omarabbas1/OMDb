const router = require('express').Router();
const { db, getDocs, addDoc, usersRef, updateDoc, moviesRef, storage } = require('../config');
const { ref, uploadBytes, getDownloadURL } = require('@firebase/storage');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');


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


router.post('/', async (req, res) => {
    const { email } = req.body;
    try {
        // const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const user = snapshot.docs.find(doc => doc.data().email === email);
        if (user !== undefined) {
            res.json(user.data());
            return;
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Error');
    }
});


const storage_ = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage_ });


router.put('/', authenticateToken, upload.single('profile_pic'), async (req, res) => {
    const { gender, dateOfBirth, country, email, dateJoined, removePic } = req.body;
    const file = req.file;
    let url = '';
    if (file) {
        const storageRef = ref(storage, file.originalname);
        try {
            await uploadBytes(storageRef, file.buffer);
            url = await getDownloadURL(storageRef);
        }
        catch (error) {
            console.log(error);
        }
    }
    try {
        let updatedUser = {
            gender,
            dateOfBirth,
            country,
            profile_pic: url
        }
        console.log(removePic);
        const snapshot = await getDocs(usersRef);
        const user = snapshot.docs.find(doc => doc.data().email === email);
        console.log(url);

        if (removePic === 'false' && url === '') {
            const newurl = await user.data().profile_pic;
            updatedUser.profile_pic = newurl
            await updateDoc(user.ref, updatedUser);
        }
        else {
            await updateDoc(user.ref, updatedUser);
        }
        console.log('User profile updated successfully');
        res.json('saved');
    }

    catch (error) {
        res.status(500).send('error');
        console.error('Error updating document', error);
    }
})

module.exports = router;