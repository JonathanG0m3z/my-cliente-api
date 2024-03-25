const nodemailer = require("nodemailer");
const { MAILER_HOST, MAILER_PORT, MAILER_USER, MAILER_PASS } = process.env;

const transporter = nodemailer.createTransport({
    host: MAILER_HOST,
    port: MAILER_PORT,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: MAILER_USER,
        pass: MAILER_PASS,
    },
});

transporter.verify()
.then(() => console.log('Listo para enviar correos'))
.catch((err) => console.log(err))

module.exports = transporter