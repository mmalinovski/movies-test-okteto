const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Expense = require('../models/expense');
const authenticate = require('./users');
const user = require('./users');

/**
 * Retrieves all expenses for some user
 */

router.get('', authenticate, (req, res) => {
    Expense.find({
        _userId: user.userId
    }).then((expenses) => {
        res.send(expenses);

    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * Retrieves all expenses for some user for particular date
 */

router.get('/:date', authenticate, (req, res) => {
    const date = new Date(req.params.date)
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    Expense.find({
        _userId: user.userId,
        date: { $gte: `${year}-${month}-1`, $lte: `${year}-${month}-${daysInMonth}` }
            // .sort({ date: 1 })
    }).then((expenses) => {
        res.send(expenses);

    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * Retrieves a specific expense (by id)
 */
// router.get('/:id', authenticate, (req, res) => {
//     Expense.findOne({
//         _id: req.params.id,
//         _userId: user.userId
//     }).then((expense) => {
//         res.send(expense);
//     }).catch(e => {
//         res.status(400).send(e);
//     })
// })

/**
 * Create a new expense
 */
router.post('', authenticate, (req, res) => {
    let expense = {
        _userId: user.userId,
        name: req.body.name || '',
        comment: req.body.comment || '',
        amount: req.body.amount || '',
        date: req.body.date || null,
        category: req.body.category || '',
    }
    let newExpense = new Expense(expense);
    newExpense.save().then((newExpenseDoc) => {
        // the full expense document (incl. id) is passed to this callback
        res.send(newExpenseDoc);
    }).catch((e) => {
        // console.log(e);
        res.status(400).send(e);
    })
})

/**
 * Update an expense
 */
router.patch('/:id', authenticate, (req, res) => {
    Expense.findOneAndUpdate({
        _id: req.params.id,
        _userId: user.userId
    }, {
        $set: req.body
    }).then(() => {
        res.send();
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * Delete an expense
 */
router.delete('/:id', authenticate, (req, res) => {
    Expense.findOneAndRemove({
        _id: req.params.id,
        _userId: user.userId
    }).then((removedExpenseDoc) => {
        res.send(removedExpenseDoc);
    })
})

module.exports = router;
