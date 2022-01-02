const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 8000
const path = require('path')



// set template engine
app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine','ejs')
app.use(expressLayout)



app.get('/', (req,res) => {
    res.render('home')
})

app.listen(PORT,() => {
    console.log(`Listening on the port ${PORT}`);
})