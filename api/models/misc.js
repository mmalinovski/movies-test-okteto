const mongoose = require('mongoose');

const MiscSchema = new mongoose.Schema({
    text: {
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

const Misc = mongoose.model('Misc', MiscSchema);

module.exports = Misc;
