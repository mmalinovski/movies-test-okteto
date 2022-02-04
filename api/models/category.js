const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    // `categories` is a map whose values are strings. A map's
    // keys are always strings. You specify the type of values using `of`.
    // categories: {
    //     type: Map,
    //     of: [String]
    // },
    categories: {
        type: [String],
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Category = mongoose.model('Category', CategoriesSchema);

module.exports = Category;

