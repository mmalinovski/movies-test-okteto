const mongoose = require('mongoose');

const outputItemsSchema = new mongoose.Schema({
    item: {
        type: String,
        minlength: 1,
        required: false,
        trim: true
    },
    price: {
        type: Number,
        required: false,
    },
    priceWithVat: {
        type: Number,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    }
});

const OutputsSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        // default: Date.now,
        required: true
    },
    items: [outputItemsSchema],
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Output = mongoose.model('Output', OutputsSchema);

module.exports = Output;
