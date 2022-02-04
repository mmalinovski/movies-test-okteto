const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
var cookieParser = require('cookie-parser');
var session = require('express-session');
require('dotenv').config();

const redis = require('redis');
const connectRedis = require('connect-redis');

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
mongoose.connect(config.database.toString(), connectionParams)
    .then(() => {
        console.log('Connected to database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

const app = express();

// enable this if you run behind a proxy (e.g. nginx)
app.set('trust proxy', 1);

const RedisStore = connectRedis(session);

//Configure redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

redisClient.on('error', function (err) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Could not establish a connection with redis. ' + err);
    }
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});


const users = require('./routes/users');
const expenses = require('./routes/expenses');
const categories = require('./routes/categories');
const materials = require('./routes/materials');
const items = require('./routes/items');
const companies = require('./routes/companies');
const outputs = require('./routes/outputs');
const inputs = require('./routes/inputs');
const miscs = require('./routes/misc-routes');

// Port Number
const port = process.env.PORT || 8080;

// CORS Middleware
// app.use(cors());
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: true
}));

// app.use(session({
//   cookieName: 'session',
//   secret: config.secret,
//   duration: 30 * 60 * 1000,
//   activeDuration: 5 * 60 * 1000,
// })); this is for client-sessions

// app.use(session({
//     name: 'mySession',
//     secret: "Shh, its a secret!",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false,
//         maxAge: 1000 * 60 * 60 * 2,
//         sameSite: true
//     }
// })); with express-session

//Configure session middleware wit REDIS
// app.use(session({
//     // store: new RedisStore({client: redisClient}),
//     store: process.env.NODE_ENV === 'production' ? new RedisStore({url: process.env.REDIS_URL}) : new RedisStore({client: redisClient}),
//     secret: 'secret$%^134',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false, // if true only transmit cookie over https
//         httpOnly: false, // if true prevent client side JS from reading the cookie
//         maxAge: 1000 * 60 * 10 // session max age in miliseconds
//     }
// }));


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
// app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

require('./config/passport')(passport);

app.use('/expenses', expenses);
app.use('/categories', categories);
app.use('/materials', materials);
app.use('/items', items);
app.use('/companies', companies);
app.use('/outputs', outputs);
app.use('/inputs', inputs);
app.use('/miscs', miscs);


app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
    res.send('invalid endpoint');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});
