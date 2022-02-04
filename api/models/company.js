const mongoose = require('mongoose');

const CompaniesSchema = new mongoose.Schema({
    companies: {
        type: [String],
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Company = mongoose.model('Company', CompaniesSchema);

module.exports = Company;

