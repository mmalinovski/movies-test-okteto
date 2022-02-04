const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Output = require('../models/output');
const authenticate = require('./users');

/**
 * Retrieves all outputs for some user
 */
// TODO authenticate as a middleware (was removed for testing)
router.get('', (req, res) => {
    Output.find({
        _userId: req.session.userId
    }).then((outputs) => {
        res.send(outputs);

    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * Retrieves all outputs for some user for particular date(data is for whole MONTH when is that date)
 */

router.get('/:date', authenticate, (req, res) => {
    const date = new Date(req.params.date)
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    Output.find({
        _userId: req.session.userId,
        date: {$gte: `${year}-${month}-1`, $lte: `${year}-${month}-${daysInMonth}`}
        // .sort({ date: 1 })
    }).then((outputs) => {
        res.send(outputs);

    }).catch((e) => {
        res.status(400).send(e);
    })
});

/**
 * Retrieves all outputs for some user for particular date(data is for whole YEAR when is that date)
 */

router.get('/year/:date', authenticate, (req, res) => {
    // const date = new Date(req.params.date);
    const year = req.params.date;
    // const month = date.getMonth() + 1;
    // const year = date.getFullYear();
    // const daysInMonth = new Date(year, month, 0).getDate();
    Output.find({
        _userId: req.session.userId,
        date: {$gte: `${year}-01-1`, $lte: `${year}-12-31`}
        // .sort({ date: 1 })
    }).then((outputs) => {
        res.send(outputs);

    }).catch((e) => {
        res.status(400).send(e);
    })
});

/**
 * Retrieves a specific output (by id)
 */
// router.get('/:id', authenticate, (req, res) => {
//     Output.findOne({
//         _id: req.params.id,
//         _userId: req.session.userId
//     }).then((output) => {
//         res.send(output);
//     }).catch(e => {
//         res.status(400).send(e);
//     })
// })

/**
 * Create a new output
 */
router.post('', authenticate, (req, res) => {
    let output = {
        _userId: req.session.userId,
        invoiceId: req.body.invoiceId || '',
        company: req.body.company || '',
        date: req.body.date || null,
        items: req.body.items || [],
        // item: req.body.itemName || '',
        // price: req.body.price || '',
        // priceWithVat: req.body.priceWithVat || '',
        // amount: req.body.amount || '',
    }
    let newOutput = new Output(output);
    newOutput.save().then((newOutputDoc) => {
        // the full output document (incl. id) is passed to this callback
        res.send(newOutputDoc);
    }).catch((e) => {
        // console.log(e);
        res.status(400).send(e);
    })
})

/**
 * Update an output
 */
router.patch('/:id', authenticate, (req, res) => {
    Output.findOneAndUpdate({
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
 * Delete an output
 */
router.delete('/:id', authenticate, (req, res) => {
    Output.findOneAndRemove({
        _id: req.params.id,
        _userId: req.session.userId
    }, {useFindAndModify: false}).then((removedOutputDoc) => {
        res.send(removedOutputDoc);
    })
})

module.exports = router;
