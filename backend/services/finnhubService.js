import WebSocket from "ws";
import buildCandle from "./candleBuilder.js";

export default function startFinnhub(io) {
  const FINNHUB_TOKEN = process.env.FINNHUB_API_KEY;

  if (!FINNHUB_TOKEN) {
    console.error("❌ FINNHUB_API_KEY missing in .env");
    return;
  }

  const ws = new WebSocket(
    `wss://ws.finnhub.io?token=${FINNHUB_TOKEN}`
  );

  // Store all subscribed symbols
  const subscribedSymbols = new Set();

  // ✅ Finnhub connected
  ws.on("open", () => {
    console.log("✅ Connected to Finnhub WebSocket");
  });

  // ✅ Handle frontend connections
  io.on("connection", (socket) => {
    console.log("🟢 Frontend connected");

    socket.on("subscribe", (symbol) => {
      console.log("📡 Subscribe request:", symbol);

      if (!subscribedSymbols.has(symbol)) {
        ws.send(JSON.stringify({
          type: "subscribe",
          symbol
        }));

        subscribedSymbols.add(symbol);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Frontend disconnected");
    });
  });

  // ✅ Handle Finnhub trade stream
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type !== "trade" || !data.data) return;

    data.data.forEach((trade) => {
      const symbol = trade.s; // e.g. NSE:RELIANCE
      const candle = buildCandle(symbol, trade.p, trade.t);

      if (candle) {
        io.to(symbol).emit("liveCandle", {
          symbol,
          ...candle
        });
      }
    });
  });

  ws.on("error", (err) => {
    console.error("❌ Finnhub Error:", err.message);
  });

  ws.on("close", () => {
    console.log("⚠️ Finnhub connection closed");
  });
}