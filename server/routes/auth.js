const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        if (req.user) {
            const { displayName, emails } = req.user;
            console.log(req.user);
            const userPayload = {
                name: displayName,
                email: emails[0].value
            }
            const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.redirect(`http://localhost:3000/success?token=${accessToken}`)
        }
        else {
            res.status(403).json({ error: true, message: "Not authorized" })
        }
    }
)

router.get('/google',
    passport.authenticate('google', { scope: ["profile", "email"], prompt: 'select_account', session: false }
    ));

router.get('/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    (req, res) => {
        if (req.user) {
            const { displayName, emails } = req.user;
            console.log(req.user);
            const userPayload = {
                name: displayName,
                email: emails[0].value
            }
            const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.redirect(`http://localhost:3000/success?token=${accessToken}`)
        }
        else {
            res.status(403).json({ error: true, message: "Not authorized" })
        }
    }
)

router.get('/facebook',
    passport.authenticate('facebook', { scope: ["email"], session: false, authType: 'reauthenticate' })
);


module.exports = router;



// router.get('/login/success', (req, res) => {
//     if (req.user) {
//         const { profile, email } = req.user;
//         const userPayload = {
//             name: profile,
//             email: email
//         }
//         const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
//         res.redirect(`http://localhost:3000/success?token=${accessToken}`)
//     }
//     else {
//         res.status(403).json({ error: true, message: "Not authorized" })
//     }
// });

// router.get('/login/failed', (req, res) => {
//     res.redirect(`http://localhost:3000/registration?error=NotAuthorized`);
// });