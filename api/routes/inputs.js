const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Input = require('../models/input');
const authenticate = require('./users');

/**
 * Retrieves all inputs for some user
 */

router.get('', authenticate, (req, res) => {
    Input.find({
        _userId: req.session.userId
    }).then((inputs) => {
        res.send(inputs);

    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * Retrieves all inputs for some user for particular date(data is for whole MONTH when is that date)
 */

router.get('/:date', authenticate, (req, res) => {
    const date = new Date(req.params.date)
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    Input.find({
        _userId: req.session.userId,
        date: {$gte: `${year}-${month}-1`, $lte: `${year}-${month}-${daysInMonth}`}
        // .sort({ date: 1 })
    }).then((inputs) => {
        res.send(inputs);

    }).catch((e) => {
        res.status(400).send(e);
    })
});

/**
 * Retrieves all inputs for some user for particular date(data is for whole YEAR when is that date)
 */

router.get('/year/:date', authenticate, (req, res) => {
    const year = req.params.date;
    Input.find({
        _userId: req.session.userId,
        date: {$gte: `${year}-01-1`, $lte: `${year}-12-31`}
    }).then((inputs) => {
        res.send(inputs);

    }).catch((e) => {
        res.status(400).send(e);
    })
});

/**
 * Retrieves a specific input (by id)
 */
// router.get('/:id', authenticate, (req, res) => {
//     Input.findOne({
//         _id: req.params.id,
//         _userId: req.session.userId
//     }).then((input) => {
//         res.send(input);
//     }).catch(e => {
//         res.status(400).send(e);
//     })
// })

/**
 * Create a new input
 */
router.post('', authenticate, (req, res) => {
    let input = {
        _userId: req.session.userId,
        material: req.body.material || '',
        date: req.body.date || null,
        price: req.body.price || '',
        companyFrom: req.body.companyFrom || '',
        amount: req.body.amount || '',
    }
    let newInput = new Input(input);
    newInput.save().then((newInputtDoc) => {
        res.send(newInputtDoc);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * Update an input
 */
router.patch('/:id', authenticate, (req, res) => {
    Input.findOneAndUpdate({
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
 * Delete an input
 */
router.delete('/:id', authenticate, (req, res) => {
    Input.findOneAndRemove({
        _id: req.params.id,
        _userId: req.session.userId
    }, {useFindAndModify: false}).then((removedInputDoc) => {
        res.send(removedInputDoc);
    })
})

module.exports = router;
