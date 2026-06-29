import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/predict", async (req, res) => {

  try {

    const { symbol, timeframe } = req.body;

    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      {
        symbol: symbol,
        timeframe: timeframe || "15m"
      }
    );

    res.json(response.data);

  } catch (error) {

    console.error("AI SERVER ERROR:", error.message);

    res.status(500).json({
      error: "AI engine failed"
    });

  }

});

export default router;