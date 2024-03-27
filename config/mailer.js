require('dotenv').config();
const nodemailer = require("nodemailer");
const { MAILER_HOST, MAILER_PORT, MAILER_USER, MAILER_PASS } = process.env;
console.log('MAILER_PASS:', MAILER_PASS)
console.log('MAILER_USER:', MAILER_USER)
console.log('MAILER_PORT:', MAILER_PORT)
console.log('MAILER_HOST:', MAILER_HOST)

const transporter = nodemailer.createTransport({
    host: MAILER_HOST,
    port: MAILER_PORT,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: MAILER_USER,
        pass: MAILER_PASS,
    },
});

module.exports = transporter