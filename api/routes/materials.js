const express = require('express');
const router = express.Router();
const Material = require('../models/material');
const authenticate = require('./users');

/**
 * Get all Materials
 */

router.get('', authenticate, (req, res) => {
    Material.find({
        _userId: req.session.userId
    }).then(data => {
        res.send(data[0]?.materials && data[0].materials.length ? data[0].materials : []);
    })
});

/**
 * Create a new Material or remove category
 */

router.post('', authenticate, (req, res) => {
        let material = {
            materials: req.body,
            _userId: req.session.userId
        }

        Material.findOneAndUpdate({
            _userId: req.session.userId
        }, {
            $set: material
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
