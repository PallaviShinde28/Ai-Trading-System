import express from "express";
import axios from "axios";

const router = express.Router();

// Example: place trade using latest market price
router.post("/", async (req, res) => {
  try {
    const { symbol, quantity, type } = req.body;

    const response = await axios.get(
      "https://query1.finance.yahoo.com/v7/finance/quote",
      {
        params: { symbols: symbol }
      }
    );

    const stock = response.data.quoteResponse.result[0];

    if (!stock) {
      return res.status(404).json({ error: "Invalid symbol" });
    }

    const price = stock.regularMarketPrice;
    const total = price * quantity;

    res.json({
      status: "success",
      tradeType: type,
      symbol,
      quantity,
      price,
      total,
      time: new Date()
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Trade failed" });
  }
});

export default router;