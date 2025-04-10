"use strict";
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async(content, to) =>{
    try {
        const transporter = nodemailer.createTransport(
            {
                host: process.env.EMAIL_SERVER,
                port: Number(process.env.EMAIL_PORT),
                secure: true,
                auth: {
                    user: process.env.EMAIL_HOST,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
                
            }
        ) ;

        const mail = {
            from: '"Support Team"  <${process.env.EMAIL_HOST}>',
            to: to,
            subject: "OTP",
            text: content,
        }
        await transporter.sendMail(mail) ;
    }catch(err){
        console.log(err) ;
    }
}

module.exports = {
    sendEmail
}