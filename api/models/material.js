const mongoose = require('mongoose');

const MaterialsSchema = new mongoose.Schema({
    materials: {
        type: [String],
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Material = mongoose.model('Material', MaterialsSchema);

module.exports = Material;

