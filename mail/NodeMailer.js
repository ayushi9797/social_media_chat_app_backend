require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendEmail(data) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        
        auth: {

            user: "soniayushi345@gmail.com",
            password: process.env.GoogleKey
        }
    });

    transporter.sendMail({
        to: `${data.email}`,
        from: 'soniayushi517@gmail.com',
        subject: data.subject,
        html: data.body
    }).then(() => console.log(`email sended`)).catch((err) => console.log(`error in mail sending`));

}



module.exports = sendEmail;