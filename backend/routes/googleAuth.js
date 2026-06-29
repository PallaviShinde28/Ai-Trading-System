import express from "express";
import passport from "passport";
import User from "../models/User.js";
// import sendEmail from "../utils/sendEmail.js";
import { sendOTP } from "../utils/sendEmail.js";
const router = express.Router();

router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),

  async (req, res) => {

  const otp = Math.floor(100000 + Math.random() * 900000).toString();


    const user = await User.findById(req.user.id);

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendOTP(user.email, otp);

    res.redirect(`http://localhost:5173/verify-otp?email=${user.email}`);



  }
);

export default router;
