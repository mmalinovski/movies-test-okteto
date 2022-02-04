require('dotenv').config();

module.exports = {
    database: process.env.NODE_ENV !== 'production' ?
        'mongodb://localhost:27017/mlin' :
        'mongodb+srv://mlinadmin:mlinadmin@mlin-cluster.a23gs.mongodb.net/mlin?retryWrites=true&w=majority',
    secret: 'yoursecret'
}
