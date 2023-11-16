require('dotenv').config({path:'../.env'});
const {createTransport} = require('nodemailer')
const fs = require('fs/promises')
const path = require('path')

const transporter = createTransport({
  service:'gmail',
  auth:{
    user: process.env.EMAIL, 
    pass: process.env.APP_PASSWORD
  }
})

let email = {
  from:`president@whitehouse.com<${process.env.EMAIL}>` , 
  to:'alfred.rezk@gmail.com',
  subject:'Welcome to our platform',
  attachments:[
    {
      filename:'house.jpg',
      path:path.join(__dirname, 'house.jpg'),
      contentType: 'image/jpg'
    }
  ] 
}


const sendMail = async(email)=>{
  const html = await fs.readFile('./index.html', {encoding:'utf-8'})
  email.html = html;
  let info = await transporter.sendMail(email)
  console.log(info);
}

sendMail(email);