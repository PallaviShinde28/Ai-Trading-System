// console.log("newsSignal.js loaded");

// import express from "express";
// import getStockNews from "../services/newsService.js";
// import analyzeSentiment from "../services/sentimentService.js";
// import getSignal from "../services/signalService.js";
// console.log("NewsSignal route hit");
// const router = express.Router();

// router.get("/:stock", async (req, res) => {
//   const stock = req.params.stock;

//   try {
//     const newsList = await getStockNews(stock);

//     const results = [];

//     for (let article of newsList) {
//       const sentimentData = await analyzeSentiment(article.title);

//       const signal = getSignal(sentimentData.sentiment);

//       results.push({
//         title: article.title,
//         sentiment: sentimentData.sentiment,
//         signal: signal,
//       });
//     }
//     console.log("FINAL RESULTS:", results);
//     res.json(results);
//   } catch (error) {
//   console.error("FULL ERROR:", error);  // 👈 ADD THIS LINE
//   res.status(500).json({ error: "Failed to process news" });
// }
// });

// export default router;

console.log("🔥 NEW ROUTE LOADED");
console.log("✅ newsSignal.js loaded");

import express from "express";
import getStockNews from "../services/newsService.js";
import analyzeSentiment from "../services/sentimentService.js";
import getSignal from "../services/signalService.js";

const router = express.Router();

router.get("/:stock", async (req, res) => {
  const stock = req.params.stock;

  try {
    console.log(`📡 Fetching news for: ${stock}`);

    const newsList = await getStockNews(stock);

    if (!newsList || newsList.length === 0) {
      console.warn("⚠️ No news found");

      return res.json({
        news: [],
        summary: {
          bullish: 0,
          bearish: 0,
          neutral: 0,
          total: 0,
          marketSignal: "HOLD",
          confidence: 0
        }
      });
    }

    // 🚀 FAST PROCESSING
    const results = await Promise.all(
      newsList.slice(0, 10).map(async (article) => {
        try {
          const sentimentData = await analyzeSentiment(article.title);

          const sentiment = sentimentData?.sentiment || "NEUTRAL";

          const signal = getSignal(sentiment);

          return {
            title: article.title,
            sentiment,
            signal
          };

        } catch (err) {
          console.error("❌ Sentiment error:", err.message);

          return {
            title: article.title,
            sentiment: "NEUTRAL",
            signal: "HOLD"
          };
        }
      })
    );

    // 🔥 CALCULATE SUMMARY
    let bullish = 0, bearish = 0, neutral = 0;

    results.forEach(r => {
      if (r.sentiment === "POSITIVE") bullish++;
      else if (r.sentiment === "NEGATIVE") bearish++;
      else neutral++;
    });

    const total = results.length;

    // 🔥 UPDATED MARKET SIGNAL LOGIC (FIXED)
    const totalScore = bullish - bearish;

    let marketSignal = "HOLD";

    if (totalScore >= 1) marketSignal = "BUY";
    else if (totalScore <= -1) marketSignal = "SELL";

    const confidence = Math.min(100, Math.abs(totalScore) * 25);

    console.log("📊 Summary:", {
      bullish,
      bearish,
      neutral,
      totalScore,
      marketSignal,
      confidence
    });

    // 🔥 FINAL RESPONSE
    res.json({
      news: results,
      summary: {
        bullish,
        bearish,
        neutral,
        total,
        totalScore,
        marketSignal,
        confidence
      }
    });

  } catch (error) {
    console.error("🔥 FULL ERROR:", error);

    res.status(500).json({
      error: "Failed to process news"
    });
  }
});

export default router;