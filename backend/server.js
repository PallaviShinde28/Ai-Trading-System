import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./config/passport.js";
import axios from "axios";
import nodemailer from "nodemailer";

// Routes

import portfolioRoutes from "./routes/portfolio.js";
import historyRoutes from "./routes/historyRoutes.js";
import authRoutes from "./routes/auth.js";
import googleAuthRoutes from "./routes/googleAuth.js";
import digilockerRoutes from "./routes/digilocker.js";
import kycRoutes from "./routes/kyc.js";
import tradeRoutes from "./routes/trade.js";
import marketRoutes from "./routes/market.js";
import newsSignalRoute from "./routes/newsSignal.js";

// ✅ ONLY AI ROUTE (IMPORTANT)


// ❌ REMOVE THIS LINE COMPLETELY
// import aiRoutes from "./routes/ai.js";

import Prediction from "./models/Prediction.js";
import startFinnhub from "./services/finnhubService.js";

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static("uploads"));

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/digilocker", digilockerRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/history", historyRoutes);

// ✅ ONLY THIS AI ROUTE


app.use("/api/news-signal", newsSignalRoute);

/* -------------------- TEST ROUTE -------------------- */

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.get("/api/test", (req, res) => {
  res.send("API WORKING 🚀");
});

/* -------------------- AI PREDICT (OPTIONAL KEEP) -------------------- */

app.get("/api/ai/predict/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    const random = Math.random();

    let signal = "HOLD";
    if (random > 0.6) signal = "BUY";
    else if (random < 0.3) signal = "SELL";

    const prediction = {
      stock: symbol,
      signal,
      confidence: Math.floor(Math.random() * 100),
      price: 0,
      stop_loss: 0,
      target: 0,
      market_type: "SIDEWAYS",
    };

    const saved = await Prediction.create({
      symbol: prediction.stock,
      signal: prediction.signal,
      confidence: prediction.confidence,
      price: prediction.price,
      stop_loss: prediction.stop_loss,
      target: prediction.target,
      market_type: prediction.market_type,
    });

    res.json({
      success: true,
      data: saved,
    });
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({
      success: false,
      error: "AI failed",
    });
  }
});

/* -------------------- SOCKET -------------------- */

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

startFinnhub(io);

/* -------------------- DATABASE -------------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB Connection Error:", err));

/* -------------------- MAIL -------------------- */



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_email@gmail.com",
    pass: "your_app_password",
  },
});