const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

const mongoose = require('mongoose');


// Check whether the request has a valid JWT Access Token // NEW CODE CHECK LATER
const authenticate = module.exports = (req, res, next) => {
    // Grab the access token from the request header
    const token = req.header('Authorization').split(' ')[2];

    // Verify the JWT
    jwt.verify(token, config.secret, (error, decoded) => {
        console.log('authenticate ELSE: decodedId ::', decoded._id)
        if (error) {
            // there was an error
            // jwt is invalid - DO NOT AUTHENTICATE
            res.status(401).send({error});
        } else {
            // JWT is valid
            console.log('authenticate ELSE: decodedId ::', decoded._id)
            req.userId = decoded._id;
            next();
        }
    })
}

// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({success: false, msg: 'Failed to register user'});
        } else {
            res.json({success: true, msg: 'User registered'});
        }
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({data: user}, config.secret, {
                    // expiresIn: 604800 // 1 week
                    expiresIn: 10800
                });

                // We set user ID to particular session
                req.session.userId = user._id;

                module.exports.userId = req.session.userId;
                console.log('SET SESSION USER ID::: ', user._id);
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
                req.session.save();
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;
