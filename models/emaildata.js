class EmailData {

  constructor(user,subject){
    this.from = "NEGOCIO nombre"
    this.to = user.email
    this.subject = subject
    this.html = this.setHtml(user,subject)
  }

  setHtml(user,subject){
    if(subject=="Confirmación de reserva"){
      return `<h1>Hola ${user.name}</h1>
      <p>Confirma tu reserva pulsando en el botón:</p>
      <a href="http://localhost:3000/citas/reservado/${user.id}" target="_blank"><input type="button" value="Confirmar reserva"></a>`
    }
    if(subject=="Resguardo de reserva"){
      return `<h1>Hola ${user.name}</h1>
      <p>Tu reserva ha sido confirmada. Te esperamos el día ${user.date} a las ${user.hour}</p>
      <a href="http://localhost:3000/citas/reservado/${user.id}" target="_blank"><input type="button" value="Consultar reserva"></a>`
    }
    if(subject=="Consulta de reservas"){
      return `<h1>Hola ${user.name}</h1>
      <p>Consulta tus citas pulsando en el botón</p>
      <a href="http://localhost:3000/citas/consulta/${user.id}" target="_blank"><input type="button" value="Consultar reserva"></a>`
    }
  }
}

module.exports = EmailData