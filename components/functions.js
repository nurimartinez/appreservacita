const functions = {}

functions.checkDates=function checkDates(date, hour){
  let dateSplit = date.split("-")
  let hourSplit = hour.split(":")
  let actualDate = Date.parse(new Date())
  let userDate = Date.parse(new Date(dateSplit[2],parseInt(dateSplit[1])-1,dateSplit[0],hourSplit[0]))
  return userDate-actualDate
}

module.exports=functions