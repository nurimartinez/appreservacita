const express = require('express')
const daoCitas = require('../dao/daoCitas')
const rtmain = express.Router()

//Routes

rtmain.get('/', (req, res) => {
  daoCitas.removeOldBookings()
  res.render('index', ({
    title: "Barber Shop"
  }))
})

module.exports = rtmain