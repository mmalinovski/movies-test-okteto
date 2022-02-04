const mongoose = require('mongoose');

const ExpensesSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        required: false,
        trim: true
    },
    category: {
        type: String,
        minlength: 2,
        required: false,
        trim: true
    },
    comment: {
        type: String,
        required: false,
        trim: true
    },
    amount: {
        type: Number,
        required: false,
    },
    date: {
        type: Date,
        // default: Date.now,
        // type: String,
        required: true
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Expense = mongoose.model('Expense', ExpensesSchema);

module.exports = Expense;
