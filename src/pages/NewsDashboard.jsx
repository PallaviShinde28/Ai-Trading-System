

import { useEffect, useState } from "react";
import TradingChart from "../components/TradingChart";

const NewsDashboard = () => {

  const [news, setNews] = useState([]);
  const [summary, setSummary] = useState({});
  const [stock, setStock] = useState("tesla");

  const [sentimentStats, setSentimentStats] = useState({
    bullish: 0,
    neutral: 0,
    bearish: 0
  });

  const [balance, setBalance] = useState(100000);
  const [profit, setProfit] = useState(0);
  const [loss, setLoss] = useState(0);
  const [history, setHistory] = useState([]);

  // ================= FETCH REAL DATA =================
  useEffect(() => {

    const fetchData = () => {
      fetch(`http://localhost:5000/api/news-signal/${stock}?t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {

          console.log("API DATA:", data);

          if (!data) return;

          // 🔥 SET NEWS + SUMMARY
          setNews(data.news || []);
          setSummary(data.summary || {});

          // 🔥 CALCULATE PERCENTAGES
          const total =
            (data.summary?.bullish || 0) +
            (data.summary?.bearish || 0) +
            (data.summary?.neutral || 0);

          if (total > 0) {
            setSentimentStats({
              bullish: (data.summary.bullish / total) * 100,
              bearish: (data.summary.bearish / total) * 100,
              neutral: (data.summary.neutral / total) * 100
            });
          }

        })
        .catch(err => console.error(err));
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);

  }, [stock]);

  // ================= TRADE =================
  const handleTrade = (type) => {
    let newBalance = balance;

    if (type === "BUY") {
      newBalance -= 1000;
      setLoss(prev => prev + 1000);
    }

    if (type === "SELL") {
      newBalance += 1200;
      setProfit(prev => prev + 200);
    }

    setBalance(newBalance);

    setHistory(prev => [
      ...prev,
      {
        type,
        stock,
        amount: 1000,
        time: new Date().toLocaleTimeString()
      }
    ]);
  };

  const getSymbol = () => {
    if (stock === "tesla") return "NASDAQ:TSLA";
    if (stock === "apple") return "NASDAQ:AAPL";
    return "BINANCE:BTCUSDT";
  };

  const getSignalColor = () => {
    if (summary.marketSignal === "BUY") return "#22c55e";
    if (summary.marketSignal === "SELL") return "#ef4444";
    return "#f59e0b";
  };

  return (
    <div style={{ padding: 20, color: "white" }}>

      <h2>📰 AI News Sentiment Dashboard</h2>

      {/* 🧠 AI SUMMARY */}
      <div style={summaryBox}>
        <h3>🧠 AI Market Signal</h3>

        <p>
          Signal:
          <span style={{ color: getSignalColor(), marginLeft: 10 }}>
            {summary.marketSignal || "HOLD"}
          </span>
        </p>

        <p>Confidence: {summary.confidence || 0}%</p>
      </div>

      {/* 📊 BIAS BAR */}
      <div style={biasBox}>
        <h3>📊 Overall Daily Bias</h3>

        <div style={barWrapper}>
          <div style={{ ...bar, width: `${sentimentStats.bullish}%`, background: "#22c55e" }} />
          <div style={{ ...bar, width: `${sentimentStats.neutral}%`, background: "#64748b" }} />
          <div style={{ ...bar, width: `${sentimentStats.bearish}%`, background: "#ef4444" }} />
        </div>

        <div style={statsRow}>
          <span style={{ color: "#22c55e" }}>Bullish: {sentimentStats.bullish.toFixed(0)}%</span>
          <span style={{ color: "#64748b" }}>Neutral: {sentimentStats.neutral.toFixed(0)}%</span>
          <span style={{ color: "#ef4444" }}>Bearish: {sentimentStats.bearish.toFixed(0)}%</span>
        </div>
      </div>

      {/* 💰 WALLET */}
      <div style={box}>💰 Wallet: ₹{balance}</div>

      {/* PROFIT LOSS */}
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ ...box, color: "#22c55e" }}>Profit: ₹{profit}</div>
        <div style={{ ...box, color: "#ef4444" }}>Loss: ₹{loss}</div>
      </div>

      {/* STOCK SELECT */}
      <select value={stock} onChange={(e) => setStock(e.target.value)} style={select}>
        <option value="tesla">Tesla</option>
        <option value="apple">Apple</option>
        <option value="bitcoin">Bitcoin</option>
      </select>

      {/* 📈 CHART */}
      <TradingChart symbol={getSymbol()} />

      {/* 🔥 AUTO TRADE BUTTON */}
      <div style={{ marginTop: 20 }}>
        <button
          style={btn("#22c55e")}
          onClick={() => handleTrade(summary.marketSignal || "HOLD")}
        >
          Execute {summary.marketSignal}
        </button>
      </div>

      {/* 📰 NEWS */}
      <div style={newsBox}>
        <h3>📰 Latest News</h3>

        {news.map((n, i) => (
          <div key={i} style={newsCard}>
            <p>{n.title}</p>
            <span style={{ color: getSignalColor() }}>
              {n.sentiment}
            </span>
          </div>
        ))}
      </div>

      {/* 📊 HISTORY */}
      <h3>📊 Trade History</h3>

      <table style={table}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Stock</th>
            <th>Amount</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {history.map((t, i) => (
            <tr key={i}>
              <td>{t.type}</td>
              <td>{t.stock}</td>
              <td>₹{t.amount}</td>
              <td>{t.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

/* ================= STYLES ================= */

const summaryBox = {
  background: "#020617",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
  border: "1px solid #1e293b"
};

const biasBox = {
  background: "#0f172a",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20
};

const barWrapper = {
  display: "flex",
  height: 20,
  borderRadius: 10,
  overflow: "hidden"
};

const bar = { height: "100%" };

const statsRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 10
};

const box = {
  background: "#0f172a",
  padding: 10,
  borderRadius: 8,
  marginTop: 10
};

const select = { padding: 8, marginTop: 10 };

const btn = (bg) => ({
  background: bg,
  color: "white",
  padding: 10,
  border: "none",
  borderRadius: 6
});

const newsBox = {
  marginTop: 20
};

const newsCard = {
  background: "#0f172a",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8
};

const table = {
  width: "100%",
  marginTop: 20
};

export default NewsDashboard;