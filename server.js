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
const passport = require('passport')
const Emitter = require('events')

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

// event emitter
const eventEmitter = new Emitter()

app.set('eventEmitter', eventEmitter)

// session configuration
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //24 hrs
}))

// passport configuration
const paasportInit = require('./app/config/passport')
const order = require('./app/models/order')
paasportInit(passport)
app.use(passport.initialize())
app.use(passport.session())



// express flash confifuration
app.use(flash())


// global miidlewares
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// set view engine
app.use(expressLayout)
app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', 'ejs')


// assets
app.use(express.static('public'))

// to accept json data
app.use(express.json())

// to accept url encoded data
app.use(express.urlencoded({ extended: false }))

// calling routes
require('./routes/web')(app)


const server = app.listen(PORT, () => {
    console.log(`Listening on the port ${PORT}`);
})

// socket 

const io = require('socket.io')(server)

io.on('connection', (socket) => {
    // Join 
    console.log(socket.id);
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('prderPlaced', data)
})