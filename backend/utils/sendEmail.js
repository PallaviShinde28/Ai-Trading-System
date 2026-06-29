// import nodemailer from "nodemailer";

// // ✅ SINGLE TRANSPORTER (better performance)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // ✅ GENERIC EMAIL FUNCTION
// export const sendEmail = async (to, subject, text) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text
//     });

//     console.log("✅ Email sent to:", to);

//   } catch (error) {
//     console.error("❌ Email error:", error);
//     throw error;
//   }
// };

// // ✅ OTP FUNCTION (USES sendEmail)
// export const sendOTP = async (email, otp) => {
//   return sendEmail(
//     email,
//     "Your OTP - AI Trading",
//     `Your OTP is: ${otp}`
//   );
// };
import nodemailer from "nodemailer";

// ✅ CREATE TRANSPORTER
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ✅ VERIFY CONNECTION (runs once on startup)
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});

// ✅ GENERIC EMAIL FUNCTION
export const sendEmail = async (to, subject, text) => {
  try {
    console.log("📧 Sending email to:", to);
    console.log("📌 Subject:", subject);
    console.log("📌 Text:", text);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log("✅ Email sent successfully");

  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
};

// ✅ OTP FUNCTION (FIXED)
export const sendOTP = async (email, otp) => {
  return sendEmail(
    email,
    "Your Login OTP - AI Trading",
    `Your OTP is: ${otp}`
  );
};