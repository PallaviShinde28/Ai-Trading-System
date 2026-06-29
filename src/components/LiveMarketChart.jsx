import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import MarketChart from "./MarketChart";

const LiveMarketChart = ({ symbol, title }) => {
  const [candles, setCandles] = useState([]);

  useEffect(() => {
    if (!symbol) return;

    let socket;

    // Convert Finnhub symbol -> Yahoo symbol
    const convertToYahoo = (sym) => {
      if (sym.startsWith("NSE:")) {
        return sym.replace("NSE:", "") + ".NS";
      }
      return sym;
    };

    // 1️⃣ Load historical data
    const loadHistory = async () => {
      try {
        const yahooSymbol = convertToYahoo(symbol);

        const res = await axios.get(
          `http://localhost:5000/api/history/${yahooSymbol}`
        );

        const formatted = res.data.map((c) => ({
          time: c.time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));

        setCandles(formatted);
      } catch (err) {
        console.error("History error:", err.message);
      }
    };

    loadHistory();

    // 2️⃣ Connect socket for live updates
    socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("🟢 Socket connected");
      socket.emit("subscribe", symbol);
    });

    socket.on("liveCandle", (candle) => {
      if (candle.symbol !== symbol) return;

      setCandles((prev) => {
        const last = prev[prev.length - 1];

        if (last && last.time === candle.time) {
          return [...prev.slice(0, -1), candle];
        }

        return [...prev, candle];
      });
    });

    return () => {
      if (socket) socket.disconnect();
    };

  }, [symbol]);

  return <MarketChart title={title} data={candles} />;
};

export default LiveMarketChart;