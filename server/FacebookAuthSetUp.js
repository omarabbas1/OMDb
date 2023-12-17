const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
},
    function (accessToken, refreshToken, profile, cb) {
        cb(null, profile);
    }
))

