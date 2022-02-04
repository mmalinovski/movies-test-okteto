const express = require('express');
const router = express.Router();
const Company = require('../models/company');
const authenticate = require('./users');
const user = require('./users');

/**
 * Get all Companies
 */

router.get('', authenticate, (req, res) => {
    Company.find({
        _userId: user.userId
    }).then(data => {
        res.send(data[0]?.companies && data[0].companies.length ? data[0].companies : []);
    })
});

/**
 * Create a new Company or remove Company
 */

router.post('', authenticate, (req, res) => {
        let company = {
            companies: req.body,
            _userId: user.userId
        }

        Company.findOneAndUpdate({
            _userId: user.userId
        }, {
            $set: company
        }, {
            useFindAndModify: false,
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        }).then(() => {
            res.send();
        }).catch(e => {
            res.status(400).send(e);
        });
    }
);

module.exports = router;
