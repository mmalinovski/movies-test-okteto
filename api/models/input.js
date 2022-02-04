const mongoose = require('mongoose');

const InputsSchema = new mongoose.Schema({
    material: {
        type: String,
        minlength: 1,
        required: false,
        trim: true
    },
    price: {
        type: Number,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    },
    companyFrom: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        // default: Date.now,
        required: true
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Input = mongoose.model('Input', InputsSchema);

module.exports = Input;
