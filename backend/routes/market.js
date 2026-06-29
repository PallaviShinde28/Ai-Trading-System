import express from "express";
import YahooFinance from "yahoo-finance2";

const router = express.Router();
const yahooFinance = new YahooFinance();

/* ===========================
   1️⃣ QUOTE ROUTE (For stock list)
=========================== */
router.get("/quote/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;

    const quote = await yahooFinance.quote(symbol);

    res.json({
      symbol,
      price: quote.regularMarketPrice,
      changePercent: quote.regularMarketChangePercent
    });

  } catch (error) {
    console.error("Quote Error:", error.message);
    res.status(500).json({ error: "Quote fetch failed" });
  }
});


/* ===========================
   2️⃣ CANDLE ROUTE (For chart)
=========================== */
router.get("/chart/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;

    const result = await yahooFinance.chart(symbol, {
      interval: "1m",
      range: "1d"
    });

    const candles = result.quotes
      .filter(q => q.open && q.high && q.low && q.close)
      .map(q => ({
        time: Math.floor(new Date(q.date).getTime() / 1000),
        open: q.open,
        high: q.high,
        low: q.low,
        close: q.close
      }));

    res.json(candles);

  } catch (error) {
    console.error("Candle Error:", error.message);
    res.status(500).json({ error: "Candle fetch failed" });
  }
});

export default router;