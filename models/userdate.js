const fs = require("fs")
let bookings = JSON.parse(fs.readFileSync("bookings.json","utf-8"))
let pendingBookings = JSON.parse(fs.readFileSync('pendingbookings.json', 'utf-8'))
let oldBookings = JSON.parse(fs.readFileSync('oldbookings.json', 'utf-8'))
let totalBookings = [...bookings,...pendingBookings,...oldBookings]

class UserDate {

  constructor(user,userId) {
    this.name = this.setName(user.name)
    this.phone = this.setPhone(user.phone)
    this.email = this.setEmail(user.email)
    this.date = user.date
    this.hour = user.hour
    this.id = this.setId(userId)
  }

  setName(name) {
    this.name = name.toString()
    return this.name
  }

  setPhone(phone) {
    this.phone = phone.toString()
    return this.phone
  }

  setEmail(email) {
    this.email = email.toString()
    return this.email
  }

  setId(userId) {
    if(userId){
      return userId
    }else{
      let num1 = (Math.round(Math.random()*899+100)).toString()
      let num2 = totalBookings.length+100
      let id = num1 + num2
      return id
    }
  }

  validate() {
    let errors = {};
    
    const regExpName = /^[a-zÀ-ÿ\u00f1\u00d1\s]{2,}$/i
    const regExpPhone = /(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/
    const regExpEmail = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/

    if(!regExpName.test(this.name)) errors.name = true
    if(!regExpPhone.test(this.phone)) errors.phone = true
    if(!regExpEmail.test(this.email)) errors.email = true
    if(!this.hour) errors.hour = true

    return errors
  }

}

module.exports = UserDate