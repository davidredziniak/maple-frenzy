const nodemailer = require("nodemailer");
const config = require("../config/email.config.js");

// Send email using the GMAIL SMTP server
async function sendMail({ to, subject, text }) {
  try {
    let mailOptions = {
      from: config.EMAIL_USER,
      to,
      subject,
      text,
    };
    const Transporter = nodemailer.createTransport({
      service: "Gmail",
      port: 465,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    });

    return await Transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  sendMail: sendMail,
};
