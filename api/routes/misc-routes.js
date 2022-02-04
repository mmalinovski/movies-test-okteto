const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Misc = require('../models/misc');
const authenticate = require('./users');

/**
 * Retrieves all miscs for some user
 */

router.get('', authenticate, (req, res) => {
    Misc.find({
        _userId: req.session.userId
    }).then((miscs) => {
        res.send(miscs);

    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * Retrieves all miscs for some user for particular date(data is for whole MONTH when is that date)
 */

router.get('/:date', authenticate, (req, res) => {
    const date = new Date(req.params.date)
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    Misc.find({
        _userId: req.session.userId,
        date: {$gte: `${year}-${month}-1`, $lte: `${year}-${month}-${daysInMonth}`}
        // .sort({ date: 1 })
    }).then((miscs) => {
        res.send(miscs);

    }).catch((e) => {
        res.status(400).send(e);
    })
});

/**
 * Retrieves all miscs for some user for particular date(data is for whole YEAR when is that date)
 */

router.get('/year/:date', authenticate, (req, res) => {
    const year = req.params.date;
    Misc.find({
        _userId: req.session.userId,
        date: {$gte: `${year}-01-1`, $lte: `${year}-12-31`}
    }).then((miscs) => {
        res.send(miscs);

    }).catch((e) => {
        res.status(400).send(e);
    })
});

/**
 * Retrieves a specific misc (by id)
 */
// router.get('/:id', authenticate, (req, res) => {
//     Misc.findOne({
//         _id: req.params.id,
//         _userId: req.session.userId
//     }).then((misc) => {
//         res.send(misc);
//     }).catch(e => {
//         res.status(400).send(e);
//     })
// })

/**
 * Create a new misc
 */
router.post('', authenticate, (req, res) => {
    let misc = {
        _userId: req.session.userId,
        text: req.body.text || '',
        date: req.body.date || null,
    }
    let newMisc = new Misc(misc);
    newMisc.save().then((newMiscDoc) => {
        res.send(newMiscDoc);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * Update an misc
 */
router.patch('/:id', authenticate, (req, res) => {
    Misc.findOneAndUpdate({
        _id: req.params.id,
        _userId: req.session.userId
    }, {
        $set: req.body
    }).then(() => {
        res.send();
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * Delete an misc
 */
router.delete('/:id', authenticate, (req, res) => {
    Misc.findOneAndRemove({
        _id: req.params.id,
        _userId: req.session.userId
    }, {useFindAndModify: false}).then((removedMiscDoc) => {
        res.send(removedMiscDoc);
    })
})

module.exports = router;
