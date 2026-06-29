<h1 style={{ color: "red" }}>NEW CODE RUNNING</h1>
import { useEffect, useState } from "react";
import TradingChart from "../components/TradingChart";

const NewsDashboard = () => {

  const [news, setNews] = useState([]);
  const [stock, setStock] = useState("Bitcoin");
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds

  useEffect(() => {
  fetch("http://127.0.0.1:5000/sentiment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ coin: stock })
  })
    .then(res => res.json())
    .then(data => {
      setNews([{
        title: `${stock} Market Update`,
        sentiment: data.sentiment,
        signal:
          data.sentiment === "POSITIVE"
            ? "BUY"
            : data.sentiment === "NEGATIVE"
            ? "SELL"
            : "HOLD"
      }]);
    });
}, [stock]);

  // 🔥 LIVE COUNTDOWN TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ⏱ FORMAT TIME
  const formatTime = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // ✅ SIGNAL COLOR
  const getColor = (signal) => {
    if (signal === "BUY") return "#22c55e";
    if (signal === "SELL") return "#ef4444";
    return "#f59e0b";
  };

  // ✅ SYMBOL MAP
  const getSymbol = (stock) => {
  if (stock === "Bitcoin") return "BINANCE:BTCUSDT";
  if (stock === "Ethereum") return "BINANCE:ETHUSDT";
  if (stock === "Solana") return "BINANCE:SOLUSDT";
  if (stock === "BNB") return "BINANCE:BNBUSDT";
  if (stock === "Ripple") return "BINANCE:XRPUSDT";
  return "BINANCE:BTCUSDT";
};

  // ✅ IMPACT LEVEL
  const getImpactLevel = (sentiment) => {
    if (sentiment === "POSITIVE" || sentiment === "NEGATIVE") return "HIGH";
    return "MEDIUM";
  };

  // ✅ IMPACT COLOR
  const getImpactColor = (level) => {
    if (level === "HIGH") return "#ef4444";
    if (level === "MEDIUM") return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>

      <h2>📰 News Sentiment</h2>

      {/* DROPDOWN */}
      <select
        onChange={(e) => setStock(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "8px",
          borderRadius: "6px",
          background: "#020617",
          color: "white"
        }}
      >
        <option value="Bitcoin">Bitcoin</option>
        <option value="Ethereum">Ethereum</option>
        <option value="Solana">Solana</option>
        <option value="BNB">BNB</option>
        <option value="Ripple">Ripple</option>
        <option value="Cardano">Cardano</option>
        <option value="Dogecoin">Dogecoin</option>
        <option value="Avalanche">Avalanche</option>
        <option value="Polkadot">Polkadot</option>
        <option value="Litecoin">Litecoin</option>
      </select>

      {/* CHART */}
      <h3>📈 Stock Trend</h3>
      <TradingChart symbol={getSymbol(stock)} />

      {/* BUTTONS */}
      <div style={{ marginTop: "20px" }}>
        <button style={{
          background: "#22c55e",
          color: "white",
          padding: "10px 20px",
          marginRight: "10px",
          border: "none",
          borderRadius: "6px"
        }}>
          BUY
        </button>

        <button style={{
          background: "#ef4444",
          color: "white",
          padding: "10px 20px",
          marginRight: "10px",
          border: "none",
          borderRadius: "6px"
        }}>
          SELL
        </button>

        <button style={{
          background: "#f59e0b",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px"
        }}>
          HOLD
        </button>
      </div>

      {/* NEWS CARDS */}
      <div style={{ marginTop: "20px" }}>
        {news.map((item, index) => {
          const impact = getImpactLevel(item.sentiment);

          return (
            <div key={index} style={{
              border: "1px solid #1e293b",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "12px",
              background: "#020617"
            }}>
              <h4>{item.title}</h4>

              <p style={{ color: "#94a3b8" }}>
                Sentiment: <b>{item.sentiment}</b>
              </p>

              {/* SIGNAL */}
              <span style={{
                background: getColor(item.signal),
                padding: "6px 12px",
                borderRadius: "6px",
                color: "white",
                fontWeight: "bold"
              }}>
                {item.signal}
              </span>

              {/* 🔥 FINAL IMPACT TIMER (LIVE) */}
              <div style={{
                marginTop: "12px",
                padding: "10px",
                background: "#0f172a",
                borderRadius: "8px",
                border: "1px solid #334155"
              }}>
                <p style={{
                  margin: 0,
                  color: "#e2e8f0",
                  fontWeight: "bold"
                }}>
                  ⏱ Impact:{" "}
                  <span style={{ color: getImpactColor(impact) }}>
                    {impact}
                  </span>
                </p>

                <p style={{
                  margin: 0,
                  color: "#e2e8f0"
                }}>
                  🕒 Time Left: <b>{formatTime()}</b>
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default NewsDashboard;