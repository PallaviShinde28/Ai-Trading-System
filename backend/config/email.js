// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({

//   service: "gmail",

//   auth: {

//     user: process.env.EMAIL,

//     pass: process.env.EMAIL_PASSWORD

//   }

// });

// module.exports = transporter;

const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP Ready");
  }
});

module.exports = transporter;