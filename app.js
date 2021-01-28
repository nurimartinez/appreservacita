const express = require('express')
const app = express()
const rtmain = require('./routes/rtmain')
const rtdates = require('./routes/rtdates')
const path = require('path')
const port = process.env.PORT || 3000

//Template engine
const exphbs = require('express-handlebars')
app.engine('.hbs', exphbs({extname: '.hbs'}))
app.set('view engine', '.hbs')

//Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

//Router
app.use('/', rtmain)
app.use('/citas', rtdates)

//Server
app.listen(port, ()=> console.log(`Server runs on port ${port}`))