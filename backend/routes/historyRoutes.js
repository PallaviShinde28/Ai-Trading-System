import express from "express";
import YahooFinance from "yahoo-finance2";

const router = express.Router();
const yahooFinance = new YahooFinance();

router.get("/:symbol", async (req, res) => {
  const { symbol } = req.params;

  try {
    // ⏱️ last 1 day
    const period2 = Math.floor(Date.now() / 1000);
    const period1 = period2 - 60 * 60 * 24;

    const result = await yahooFinance.chart(symbol, {
      period1,
      period2,
      interval: "1m"
    });

    const candles = result.quotes.map(q => ({
      time: Math.floor(new Date(q.date).getTime() / 1000),
      open: q.open,
      high: q.high,
      low: q.low,
      close: q.close
    }));

    res.json(candles);

  } catch (err) {
    console.error("Yahoo history error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;