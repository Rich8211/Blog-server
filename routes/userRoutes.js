const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const validateSignUpInput = require('../validation/signup');
const validateLoginInput = require('../validation/login');
const User = require('../models/userModel');
const passport = require('passport');

router.post('/register', async (req, res) => {

    try {
        const {errors, isValid} = validateSignUpInput(req.body);
    const {username, email, password, passwordCheck} = req.body;

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const existingUser = await User.findOne({$or:[{email},{username}]});

    if (existingUser) {
        if (existingUser.email = email) {
            return res.status(400).json({msg: "An account with that email already exists"});
        }

        else return res.status(400).json({msg: "An account with that user name already exists"});
    }

    if (password !== passwordCheck) return res.status(400).json({msg:'Password does not match confirmation.'});

    const salt = await bcrypt.genSalt();
    const pwHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        email,
        password: pwHash
    });

    const savedUser = await newUser.save();
    
    res.json(savedUser);
    }

    catch (err) {
        console.error(err);
    }
    

});

router.post('/login', passport.authenticate("local"), (req, res) => {
    res.json(req.isAuthenticated());
});

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }),
    function(req, res) {
        res.redirect('http://localhost:3000/posts/');
});

router.get("/user", async (req, res) => {
    try {

        if (req.isAuthenticated()) {
           res.json(req.user);
        }
        else res.json(false);
    
    }
    catch (err) {
        console.error(err);
    }
        
});

router.get("/logout", (req, res) => {
    
    try {
        req.logOut();
        res.json('Logged Out')
    }

    catch (err) {
        console.error(err)
    }

})
module.exports = router;