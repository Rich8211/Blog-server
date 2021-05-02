const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');


require('dotenv').config();

module.exports = passport => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/users/auth/google/callback"
      },
      (accessToken, refreshToken, profile, cb) => {
        User.findOne({ googleId: profile.id }, async (err, user) => {
            if (err) return cb(err, null);
            if (!user) {
                const salt = await bcrypt.genSalt();
                const pwHash = await bcrypt.hash(profile.id, salt);
                const newUser = new User({
                  googleId: profile.id,
                  username: profile.name.givenName,
                  email: profile.emails[0].value,
                  password: pwHash
            });
                await newUser.save();
                cb(null, newUser);
            }
        cb(null, user)
        });
      }
    ));
    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });
    passport.deserializeUser((id, cb) => {
        User.findOne({ _id: id }, (err, user) => {
        const userInformation = {
            username: user.username,
            id: user._id
        };
        cb(err, userInformation);
        });
    });
}
