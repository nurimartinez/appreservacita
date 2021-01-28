const fs = require("fs")
const functions = require("../components/functions")

let daoCitas = {}

let bookings = JSON.parse(fs.readFileSync("bookings.json","utf-8"))
let pendingBookings = JSON.parse(fs.readFileSync('pendingbookings.json', 'utf-8'))
let oldBookings = JSON.parse(fs.readFileSync('oldbookings.json', 'utf-8'))
let realBookings = [...bookings,...pendingBookings]
let totalBookings = [...bookings,...oldBookings]

//Funciones para el calendario en el formulario

daoCitas.occupiedDates=function occupiedDates(){
  return new Promise((resolved,reject)=>{
    let occupiedDates = []
    for(let date of realBookings){
      let occupiedHours = []
      for(let i=0;i<realBookings.length;i++){
        if(date.date==realBookings[i].date)
          occupiedHours.push(realBookings[i].hour)
      }    
      if(occupiedHours.length==3 && !occupiedDates.includes(date.date))
        occupiedDates.push(date.date)
    }
    resolved(occupiedDates)
    reject("error")
  })
}

daoCitas.freeHours=function freeHours(date){
  return new Promise((resolved,reject)=>{
    let availableHours = ['18:00','20:00','22:00']
    availableHours.forEach(hour=>{
      let timeDifference = functions.checkDates(date,hour)
      if(timeDifference<=0){
        let index = availableHours.findIndex(thisHour=>thisHour==hour)
        availableHours.splice(index,1)
      }
    })
    let bookHours = realBookings.filter(user=>user.date==date).map(user=>user.hour)
    let freeHours = []
    for(let availableHour of availableHours){
      if(!bookHours.includes(availableHour))
        freeHours.push(availableHour)
    }
    resolved(freeHours)
    reject("error")
  })
}

//Función para buscar usuarios

daoCitas.searchUser=function searchUser(id){
  let index = realBookings.findIndex(user=>user.id==id)
  let user = realBookings[index]
  return user
}

daoCitas.searchUserByEmail=function searchUserByEmail(email){
  let index = totalBookings.findIndex(user=>user.email==email)
  let user = totalBookings[index]
  return user
}

daoCitas.searchUserById=function searchUserById(id){
  let index = totalBookings.findIndex(user=>user.id==id)
  let user = totalBookings[index]
  return user
}

daoCitas.searchUserTotal=function searchUserTotal(email){
  let userBookings = []
  let userOldBookings = []
  bookings.forEach(user=>{
    if(user.email==email)
      userBookings.push(user)
  })
  console.log(oldBookings)
  oldBookings.forEach(user=>{
    if(user.email==email)
      userOldBookings.push(user)
  })
  let userTotalBookings = []
  userTotalBookings.push(userBookings,userOldBookings)
  return userTotalBookings
}

daoCitas.searchUserBooked=function searchUserBooked(id){
  let index = bookings.findIndex(user=>user.id==id)
  let user = bookings[index]
  return user
}

daoCitas.searchUserPending=function searchUserPending(id){
  let index = pendingBookings.findIndex(user=>user.id==id)
  let user = pendingBookings[index]
  return user
}

//Funciones para modificar las bases de datos

daoCitas.pushPending=function pushPending(user){
  pendingBookings.push(user)
  fs.writeFileSync("pendingbookings.json",JSON.stringify(pendingBookings),"utf-8")
}

daoCitas.pushBooking=function pushBooking(userId){
  let index = pendingBookings.findIndex(user=>user.id==userId)
  if(index!=-1){
    let user = pendingBookings[index]
    pendingBookings.splice(index,1)
    fs.writeFileSync("pendingbookings.json",JSON.stringify(pendingBookings),"utf-8")
    bookings.push(user)
    fs.writeFileSync("bookings.json",JSON.stringify(bookings),"utf-8")  
  }
}

daoCitas.modifyBooking=function modifyBooking(user){
  let index = bookings.findIndex(oldUser=>oldUser.id==user.id)
  bookings.splice(index,1,user)
  fs.writeFileSync("bookings.json",JSON.stringify(bookings),"utf-8")
}

daoCitas.removeBooking=function removeBooking(user){
  let index = bookings.findIndex(oldUser=>oldUser.id==user.id)
  oldBookings.push(user)
  fs.writeFileSync("oldbookings.json",JSON.stringify(oldBookings),"utf-8")
  bookings.splice(index,1)
  fs.writeFileSync("bookings.json",JSON.stringify(bookings),"utf-8")
}

daoCitas.removeOldBookings=function removeOldBookings(){
  bookings.forEach(user=>{
    let index = bookings.findIndex(oldUser=>oldUser.id==user.id)
    let timeDifference = functions.checkDates(user.date, user.hour)
    if(timeDifference<=0){
      oldBookings.push(user)
      bookings.splice(index,1)
    }
  })
  fs.writeFileSync("bookings.json",JSON.stringify(bookings),"utf-8")
  fs.writeFileSync("oldbookings.json",JSON.stringify(oldBookings),"utf-8")
}


module.exports=daoCitas