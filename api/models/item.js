const mongoose = require('mongoose');

const ItemsSchema = new mongoose.Schema({
    items: {
        type: [String],
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Item = mongoose.model('Item', ItemsSchema);

module.exports = Item;

