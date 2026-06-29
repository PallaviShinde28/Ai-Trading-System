import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOTP } from "../utils/sendEmail.js";
import passport from "../config/passport.js";

const router = express.Router();

/* =========================
   AUTH MIDDLEWARE (STEP 4)
========================= */
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, "secret");

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/* =========================
   REQUEST OTP
========================= */
router.post("/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (!user) {
      user = new User({ email: normalizedEmail });
    }

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendOTP(normalizedEmail, otp);

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (err) {
    console.log("REQUEST OTP ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   VERIFY OTP
========================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) return res.json({ success: false });

    if (!user.otp || user.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpiry) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      success: true,
      isPinSet: !!user.pin,
      kycCompleted: user.kycCompleted || false
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================
   SET PIN
========================= */
router.post("/set-pin", async (req, res) => {
  try {
    const { email, pin } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) return res.json({ success: false });

    user.pin = String(pin);
    await user.save();

    res.json({
      success: true,
      message: "PIN set successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================
   VERIFY PIN (LOGIN)  ✅ STEP 3
========================= */
router.post("/verify-pin", async (req, res) => {
  try {
    const { email, pin } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user || user.pin !== String(pin)) {
      return res.json({ success: false, message: "Invalid PIN" });
    }

    const token = jwt.sign(
      { id: user._id },
      "secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      userId: user._id   // 🔥 useful for frontend
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================
   COMPLETE KYC
========================= */
router.post("/complete-kyc", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) return res.json({ success: false });

    user.kycCompleted = true;
    await user.save();

    res.json({
      success: true
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================
   GET USER (OLD)
========================= */
router.post("/get-user", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) return res.json({ success: false });

    res.json({
  success: true,
  isVerified: user.isVerified || false,   // 🔥 ADD THIS
  isPinSet: !!user.pin,
  kycCompleted: user.kycCompleted || false,
  name: user.name,
  wallet: user.wallet
});

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================
   🔥 GET CURRENT USER (STEP 4)
========================= */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// ================= GOOGLE AUTH =================

// Step 1: Start Google login
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {

    const user = req.user;

    // ✅ redirect to frontend with data
    const redirectURL = `http://localhost:5173/auth-success?email=${encodeURIComponent(user.email)}`;

    res.redirect(redirectURL);
  }
);


export default router;