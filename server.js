require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT
const path = require('path')
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// databse connection
const connection = mongoose.connect('mongodb://localhost/pizza-app')
    .then(() => {
        console.log('database connected successfully');
    }).catch((err) => {
        console.log(err);
    })

var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/pizza-app',
    collection: 'mySessions'
});

// Catch errors
store.on('error', function (error) {
    console.log(error);
});

// session configuration
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //24 hrs
}))

// express flash confifuration
app.use(flash())


// global miidlewares
app.use((req,res,next) => {
    res.locals.session = req.session
    next()
})

// set view engine
app.use(expressLayout)
app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', 'ejs')


// assets
app.use(express.static('public'))

// 
app.use(express.json())

// calling routes
require('./routes/web')(app)


app.listen(PORT, () => {
    console.log(`Listening on the port ${PORT}`);
})