const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const authenticate = require('./users');
const user = require('./users');

/**
 * Get all Items
 */

router.get('', authenticate, (req, res) => {
    Item.find({
        _userId: user.userId
    }).then(data => {
        res.send(data[0]?.items && data[0].items.length ? data[0].items : []);
    })
});

/**
 * Create a new Item or remove category
 */

router.post('', authenticate, (req, res) => {
        let item = {
            items: req.body,
            _userId: user.userId
        }

        Item.findOneAndUpdate({
            _userId: user.userId
        }, {
            $set: item
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
