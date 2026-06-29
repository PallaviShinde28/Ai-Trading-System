
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartDataLabels
);

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("portfolio");

  const userHoldings = [
    { symbol: "BTCUSDT", qty: 0.5, buy: 65000 },
    { symbol: "ETHUSDT", qty: 2, buy: 1900 },
    { symbol: "SOLUSDT", qty: 10, buy: 75 }
  ];

  // 🔥 EXPORT CSV FUNCTION
  const exportReport = () => {
    const headers = ["Asset", "Qty", "Buy", "Current", "Profit", "Signal"];

    const rows = portfolio.map(p => [
      p.symbol,
      p.qty,
      p.buy,
      p.current.toFixed(2),
      p.profit.toFixed(2),
      p.signal
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "portfolio_report.csv";
    link.click();
  };

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchMarket = async () => {
      const res = await fetch("https://api.binance.com/api/v3/ticker/price");
      const data = await res.json();

      const getPrice = (symbol) =>
        parseFloat(data.find(d => d.symbol === symbol)?.price);

      const updated = userHoldings.map(h => {
        const current = getPrice(h.symbol) || 0;
        const profit = (current - h.buy) * h.qty;

        let signal = "HOLD";
        if (current > h.buy * 1.05) signal = "SELL";
        else if (current < h.buy * 0.97) signal = "BUY";

        return { ...h, current, profit, signal };
      });

      setPortfolio(updated);

      const total = updated.reduce((sum, p) => sum + p.current * p.qty, 0);
      setHistory(prev => [...prev, total].slice(-12));
    };

    fetchMarket();
    const interval = setInterval(fetchMarket, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🥧 PIE DATA
  const pieData = {
    labels: portfolio.map(p => p.symbol.replace("USDT", "")),
    datasets: [
      {
        data: portfolio.map(p => p.current * p.qty),
        backgroundColor: ["#f7931a", "#627eea", "#00ffa3"]
      }
    ]
  };

  // 📈 LINE DATA
  const lineData = {
    labels: history.map((_, i) => `T${i + 1}`),
    datasets: [
      {
        label: "Portfolio Value",
        data: history,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.1)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    plugins: { legend: { labels: { color: "white" } } },
    scales: {
      x: { ticks: { color: "gray" } },
      y: { ticks: { color: "gray" } }
    }
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "white" } },
      datalabels: {
        color: "white",
        formatter: (value, context) => {
          const total = context.chart._metasets[0].total;
          return ((value / total) * 100).toFixed(1) + "%";
        }
      }
    }
  };

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2>Portfolio Analytics</h2>
          <p style={{ color: "#94a3b8" }}>
            Track performance, risk, and AI-based signals
          </p>
        </div>

        <button style={styles.exportBtn} onClick={exportReport}>
          Export Report
        </button>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        {["portfolio", "btc", "market"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...styles.tabBtn,
              background: tab === t ? "#22c55e" : "transparent"
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* PORTFOLIO TAB */}
      {tab === "portfolio" && (
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Asset Allocation</h3>
            <div style={styles.pieWrapper}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          <div style={styles.card}>
            <h3>Portfolio Performance</h3>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* BTC TAB */}
      {tab === "btc" && (
        <div style={styles.card}>
          <h3>BTC Analysis</h3>
          <p style={{ color: "#94a3b8" }}>
            BTC dominates your portfolio. Bullish trend detected.
          </p>
          <Line data={lineData} options={chartOptions} />
        </div>
      )}

      {/* MARKET TAB */}
      {tab === "market" && (
        <div style={styles.card}>
          <h3>Market Overview</h3>
          <p style={{ color: "#94a3b8" }}>
            Market is volatile. AI suggests cautious trading.
          </p>

          <div style={styles.pieWrapper}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      )}

      {/* TABLE */}
      <div style={styles.card}>
        <h3>Assets</h3>

        <div style={styles.rowHeader}>
          <div>Asset</div>
          <div>Qty</div>
          <div>Buy</div>
          <div>Current</div>
          <div>Profit</div>
          <div>Signal</div>
        </div>

        {portfolio.map((p, i) => (
          <div key={i} style={styles.row}>
            <div>{p.symbol}</div>
            <div>{p.qty}</div>
            <div>₹{p.buy}</div>
            <div>₹{p.current.toFixed(2)}</div>

            <div style={{
              color: p.profit >= 0 ? "#22c55e" : "#ef4444"
            }}>
              ₹{p.profit.toFixed(2)}
            </div>

            <div style={{
              color:
                p.signal === "BUY"
                  ? "#22c55e"
                  : p.signal === "SELL"
                  ? "#ef4444"
                  : "#eab308"
            }}>
              {p.signal}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// 🎨 STYLES
const styles = {
  wrapper: {
    background: "#020617",
    color: "white",
    minHeight: "100vh",
    padding: 20
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20
  },

  exportBtn: {
    background: "#22c55e",
    border: "none",
    padding: "10px 15px",
    borderRadius: 8,
    cursor: "pointer"
  },

  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 20
  },

  tabBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #1e293b",
    color: "white",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 20,
    marginBottom: 20
  },

  card: {
    background: "#020617",
    border: "1px solid #1e293b",
    padding: 20,
    borderRadius: 12
  },

  pieWrapper: {
    width: "250px",
    height: "250px",
    margin: "auto"
  },

  rowHeader: {
    display: "grid",
    gridTemplateColumns: "repeat(6,1fr)",
    marginBottom: 10,
    color: "#94a3b8"
  },

  row: {
    display: "grid",
    gridTemplateColumns: "repeat(6,1fr)",
    padding: 10,
    borderBottom: "1px solid #1e293b"
  }
};