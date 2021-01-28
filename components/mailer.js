const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'aletha.rogahn10@ethereal.email',
    pass: 'R7zQVTfcBRRtQPnA17'
  }
})

module.exports=transporter