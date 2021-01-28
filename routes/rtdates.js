const express = require('express')
const rtdates = express.Router()
const UserDate = require('../models/userdate')
const EmailData = require('../models/emaildata')
const daoCitas = require("../dao/daoCitas")
const transporter = require("../components/mailer")
const functions = require("../components/functions")

//Routes

//Formulario para nueva reserva
rtdates.get('/formulario', (req, res) => {
  daoCitas.occupiedDates()
    .then(dates => {
      res.render('form', ({
        title: "Reserva",
        action: "/citas/pendiente",
        occupiedDates: dates
      }))
    })
})

//Para ver las horas libres en el calendario
rtdates.get("/horaslibres/:date", (req, res) => {
  daoCitas.freeHours(req.params.date)
    .then(hours => {
      res.json(hours)
    })
})

//Validar el formulario y enviar email de confirmación
rtdates.post('/pendiente', (req, res) => {
  const user = new UserDate(req.body)
  if (user.validate().name == true || user.validate().phone == true || user.validate().email == true || user.validate().hour == true) {
    daoCitas.occupiedDates()
    .then(dates=>{
      res.render('form', ({
      title: "Reserva",
      action: "/citas/pendiente",
      occupiedDates: dates,
      errors: user.validate(),
      user
      }))
    })
  } else {
    let mailOptions = new EmailData(user, "Confirmación de reserva")
    transporter.sendMail(mailOptions, () => {
      res.render("pending", ({ 
        title: "Pendiente",
        user
      }))
      daoCitas.pushPending(user)
    })
  }
})

//Pantalla de confirmación con los datos de la reserva y envío del resguardo
rtdates.get("/reservado/:id", (req, res) => {
  let id = req.params.id
  let user = daoCitas.searchUser(id)
  let userComprobation = daoCitas.searchUserPending(id)
  if (userComprobation != undefined) {
    let mailOptions = new EmailData(user, "Resguardo de reserva")
    transporter.sendMail(mailOptions, () => {
      daoCitas.pushBooking(id)
    })
  }
  if (user == undefined)
    res.render("notbooked", ({ title: "Sin reserva"}))
  else
    res.render("booked", ({ title: "Reservado", user }))
})

//Pantalla de introducción de id para modificar o cancelar
rtdates.get("/:action/id", (req, res) => {
  let action = req.params.action
  if (action == "modificar") {
    res.render("id", ({ title: "Modificar", action: "/citas/" + action }))
  } else if (action == "cancelar") {
    res.render("id", ({ title: "Cancelar", action: "/citas/" + action }))
  } else
    res.render("error")
})

//Verificación de id y formulario para modificar
rtdates.post("/modificar", (req, res) => {
  let id = req.body.number
  let user = daoCitas.searchUserBooked(id)
  if (user == undefined) {
    res.render("id", ({
      title: "Modificar",
      action: "/citas/modificar",
      errorId: true
    }))
  } else {
    let timeDifference = functions.checkDates(user.date, user.hour)
    let day = 86400000
    if(timeDifference > day){
      res.render('form', ({
        title: "Modificar",
        user,
        action: "/citas/modificado",
        id: true
      }))
    }else{
      res.render("id", ({
        title: "Modificar",
        action: "/citas/modificar",
        errorHour: true
      }))
    }
  }
})

//Validar el formulario y envio de resguardo
rtdates.post("/modificado",(req,res)=>{
  let id = req.body.number
  const user = new UserDate(req.body,id)
  if (user.validate().name == true || user.validate().phone == true || user.validate().email == true || user.validate().hour == true) {
    daoCitas.occupiedDates()
    .then(dates=>{
      res.render('form', ({
      title: "Modificar",
      action: "/citas/modificado",
      occupiedDates: dates,
      errors: user.validate(),
      user,
      id: true
      }))
    })
  } else {
    let mailOptions = new EmailData(user, "Resguardo de reserva")
    transporter.sendMail(mailOptions, () => {
      daoCitas.modifyBooking(user)
      res.render("booked", ({ title: "Reservado", user }))
    })
  }
})

//Verificación de id y pantalla de confiramción de cancelación
rtdates.post("/cancelar", (req, res) => {
  let id = req.body.number
  let user = daoCitas.searchUserBooked(id)
  if (user == undefined) {
    res.render("id", ({
      title: "Cancelar",
      action: "/citas/cancelar",
      errorId: true
    }))
  } else {
    res.render('cancel', ({
      title: "Cancelar",
      user
    }))
  }
})

//Cancelación realizada
rtdates.post("/cancelado",(req,res)=>{
  let id = req.body.number
  let user = daoCitas.searchUserBooked(id)
  daoCitas.removeBooking(user)
  res.render('cancelok', ({
    title: "Cancelado",
    user
  }))
})

//Pantalla de introducción de email para comprobar reservas
rtdates.get("/consultar/email", (req, res) => {
  res.render("email", ({
    title: "Consultar"
  }))
})

//
rtdates.post("/consultado",(req,res)=>{
  let email = req.body.email
  let bookings = daoCitas.searchUserTotal(email)
  if(bookings[0].length==0&&bookings[1].length==0){
    res.render("email", ({
      title: "Consultar",
      error: true
    }))   
  }else{
    let user = daoCitas.searchUserByEmail(email)
    let mailOptions = new EmailData(user, "Consulta de reservas")
    transporter.sendMail(mailOptions, () => {
      res.render("email", ({
        title: "Consultar",
        resolve: true
      })) 
    })
  }
})

rtdates.get("/consulta/:id",(req,res)=>{
  let id = req.params.id
  let user = daoCitas.searchUserById(id)
  let bookings = daoCitas.searchUserTotal(user.email)
  let listBookings = false
  let listOldBookings = false
  if(bookings[0].length!=0)
    listBookings = true
  if(bookings[1].length!=0)
    listOldBookings = true
  res.render("list", ({
    title: "Reservas",
    listBookings,
    bookings: bookings[0],
    listOldBookings,
    oldBookings: bookings[1]
  }))
})

module.exports = rtdates