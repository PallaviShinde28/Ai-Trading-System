import express from "express";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

// ================= GET PORTFOLIO =================
router.get("/:email", async (req, res) => {

  try {

    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    const portfolio = await Portfolio.find({
      userId: user._id
    });

    res.json({
      success: true,
      portfolio
    });

  }
  catch {

    res.status(500).json({
      success: false,
      message: "Portfolio fetch failed"
    });

  }

});

export default router;