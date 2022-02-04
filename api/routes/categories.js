const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const authenticate = require('./users');
const user = require('./users');
const Expense = require("../models/expense");

/**
 * Get all categories
 */

router.get('', authenticate, (req, res) => {
    Category.find({
        _userId: user.userId
    }).then(data => {
        res.send(data[0]?.categories && data[0].categories.length ? data[0].categories : []);
    })

    // Category.find({}).then((data) => {
    //     const userCategories = data.find(item => item?.categories?.get(user.userId));
    //     if (userCategories && userCategories.categories && userCategories.categories.get(user.userId)) {
    //         res.send(userCategories.categories.get(user.userId));
    //     } else {
    //         res.send([]);
    //     }
    //
    //
    // }).catch((e) => {
    //     res.status(400).send(e);
    // })
});

/**
 * Create a new category or remove category
 */

router.post('', authenticate, (req, res) => {

        // let category = {
        //     categories: {
        //         [user.userId]: req.body
        //     },
        //     _userId: user.userId
        // }

        let category = {
            categories: req.body,
            _userId: user.userId
        }

        Category.findOneAndUpdate({
            _userId: user.userId
        }, {
            $set: category
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


        // Category.find({}).then((data) => {
        //     const userCategories = data.find(item => item?.categories?.get(user.userId) || []);
        //     let category = {
        //         categories: {
        //             [user.userId]: req.body
        //         }
        //     }
        //     if (userCategories && userCategories.categories && userCategories.categories.get(user.userId)) {
        //         Category.findOneAndUpdate({
        //             _id: userCategories._id,
        //         }, {
        //             $set: category
        //         }, {useFindAndModify: false}).then(() => {
        //             res.send();
        //         }).catch((e) => {
        //             res.status(400).send(e);
        //         })
        //     } else {
        //         let newUserCategory = new Category(category);
        //         newUserCategory.save().then((newCategoryDoc) => {
        //             // the full expense document (incl. id) is passed to this callback
        //             res.send(newCategoryDoc);
        //         }).catch((e) => {
        //             res.status(400).send(e);
        //         })
        //     }
        // }).catch((e) => {
        //     res.status(400).send(e);
        // })
    }
);

module.exports = router;
