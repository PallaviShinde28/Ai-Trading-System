

// import React, { useEffect, useState } from "react";

// const AIPredictions = () => {
//   const [data, setData] = useState(null);
//   const [symbol, setSymbol] = useState("BTC-USD");
//   const [loading, setLoading] = useState(false);

//   const fetchPrediction = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         `http://localhost:5001/api/ai/predict/${symbol}?t=${Date.now()}`
//       );

//       const json = await res.json();

//       console.log("AI DATA:", json);

//       if (json.success) {
//         setData(json.data);
//          window.aiData = json.data;
//       }

//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPrediction();
//   }, []);

//   return (
//     <div>

//       <h1>🤖 AI Crypto Predictions</h1>

//       {/* Controls */}
//       <div style={{ marginBottom: "20px" }}>
//         <select
//   value={symbol}
//   onChange={(e) => setSymbol(e.target.value)}
//   style={{
//     padding: "8px",
//     marginRight: "10px",
//     borderRadius: "6px"
//   }}
// >
//   <option value="BTC-USD">Bitcoin</option>
//   <option value="ETH-USD">Ethereum</option>
//   <option value="SOL-USD">Solana</option>
//   <option value="BNB-USD">BNB</option>
//   <option value="XRP-USD">Ripple</option>
//   <option value="ADA-USD">Cardano</option>
//   <option value="DOGE-USD">Dogecoin</option>
//   <option value="AVAX-USD">Avalanche</option> // ✅ instead of MATIC
//   <option value="DOT-USD">Polkadot</option>
//   <option value="LTC-USD">Litecoin</option>
// </select>

//         <button onClick={fetchPrediction}>
//           {loading ? "Running..." : "Run Prediction"}
//         </button>
//       </div>

//       {loading && <p>Loading...</p>}

//       {data && (
//         <div style={{ border: "1px solid #1e293b", padding: "15px", borderRadius: "10px" }}>
//           <h2>{data.stock}</h2>
//           <p>💰 Price: {data.price}</p>

//           <p>
//             📊 Signal:
//             <span style={{
//               color:
//                 data.signal === "BUY"
//                   ? "green"
//                   : data.signal === "SELL"
//                   ? "red"
//                   : "orange",
//               marginLeft: "10px"
//             }}>
//               {data.signal}
//             </span>
//           </p>

//           <p>⚡ Confidence: {data.confidence}</p>
//           <p>📈 Market Type: {data.market_type}</p>
//           <p>🧠 Strategy: Adaptive AI Model</p>
//           <p>⏱ Timeframe: Real-time</p>
//           <p>🛑 Stop Loss: {data.stop_loss}</p>
          
//         </div>
//       )}
//     </div>
//   );
// };

// export default AIPredictions;
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const AIPredictions = () => {
  const [data, setData] = useState(null);
  const [symbol, setSymbol] = useState("BTC-USD");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchPrediction = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/ai/predict/${symbol}?t=${Date.now()}`
      );

      const json = await res.json();

      if (json.success) {
        setData(json.data);

        // 📈 store price history
        setHistory(prev => [
          ...prev,
          parseFloat(json.data.price)
        ].slice(-15));
      }

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  // 🎨 SIGNAL COLOR
  const getSignalColor = (signal) => {
    if (signal === "BUY") return "#22c55e";
    if (signal === "SELL") return "#ef4444";
    return "#eab308";
  };

  // 🧠 CONFIDENCE LABEL
  const getConfidenceLabel = (conf) => {
    if (conf >= 80) return "Strong 💪";
    if (conf >= 60) return "Moderate ⚖️";
    return "Weak ⚠️";
  };

  // 🔥 CALCULATIONS
  let target = 0, potential = 0, entry = 0, takeProfit = 0, riskMsg = "";

  if (data) {
    const price = parseFloat(data.price);
    const confidence = parseFloat(data.confidence);

    if (data.signal === "BUY") {
      target = price * (1 + confidence / 200);
      potential = ((target - price) / price) * 100;
    } else if (data.signal === "SELL") {
      target = price * (1 - confidence / 200);
      potential = ((price - target) / price) * 100;
    }

    entry = price;
    takeProfit = target;

    riskMsg =
      confidence < 50
        ? "⚠️ High Risk Trade"
        : confidence < 70
        ? "⚠️ Moderate Risk"
        : "✅ Low Risk";
  }

  // 📈 CHART DATA
  const chartData = {
    labels: history.map((_, i) => i + 1),
    datasets: [
      {
        label: "Prediction Trend",
        data: history,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div style={styles.wrapper}>

      <h1 style={styles.title}>🤖 AI Crypto Predictions</h1>

      {/* CONTROLS */}
      <div style={styles.controls}>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={styles.select}
        >
          <option value="BTC-USD">Bitcoin</option>
          <option value="ETH-USD">Ethereum</option>
          <option value="SOL-USD">Solana</option>
        </select>

        <button style={styles.button} onClick={fetchPrediction}>
          {loading ? "Running..." : "Run Prediction"}
        </button>
      </div>

      {loading && <p style={{ color: "#94a3b8" }}>Analyzing market...</p>}

      {/* 🔥 MAIN LAYOUT */}
      <div style={styles.layout}>

        {/* LEFT CARD (UNCHANGED UI) */}
        {data && (
          <div style={styles.card}>
            <div style={styles.top}>
              <h2>{data.stock}</h2>
              <span style={{
                ...styles.signal,
                background: getSignalColor(data.signal)
              }}>
                {data.signal}
              </span>
            </div>

            <h3 style={styles.price}>₹{data.price}</h3>

            <p style={styles.label}>
              Confidence: {data.confidence}% ({getConfidenceLabel(data.confidence)})
            </p>

            <div style={styles.progressBar}>
              <div style={{
                ...styles.progressFill,
                width: `${data.confidence}%`
              }} />
            </div>

            <p style={styles.label}>Target Price</p>
            <h3>₹{target.toFixed(2)}</h3>

            <p style={styles.label}>Potential Move</p>
            <p style={{
              color: data.signal === "BUY" ? "#22c55e" : "#ef4444"
            }}>
              {potential.toFixed(2)}%
            </p>

            <div style={styles.grid}>
              <div>
                <p style={styles.label}>Entry</p>
                <p>₹{entry.toFixed(2)}</p>
              </div>
              <div>
                <p style={styles.label}>Take Profit</p>
                <p>₹{takeProfit.toFixed(2)}</p>
              </div>
              <div>
                <p style={styles.label}>Stop Loss</p>
                <p>{data.stop_loss}</p>
              </div>
              <div>
                <p style={styles.label}>Market Type</p>
                <p>{data.market_type}</p>
              </div>
            </div>

            <div style={styles.riskBox}>{riskMsg}</div>

            <div style={styles.reason}>
              <p style={styles.label}>AI Reason</p>
              <ul>
                <li>Price trend analysis</li>
                <li>Momentum indicators</li>
                <li>Market volatility check</li>
              </ul>
            </div>
          </div>
        )}

        {/* RIGHT SIDE CHART */}
        <div style={styles.chartCard}>
          <h3>Prediction Trend</h3>
          <Line data={chartData} />
        </div>

      </div>

    </div>
  );
};

export default AIPredictions;

const styles = {
  wrapper: {
    padding: 20,
    background: "#020617",
    minHeight: "100vh",
    color: "white"
  },

  title: {
    marginBottom: 20
  },

  controls: {
    display: "flex",
    gap: 10,
    marginBottom: 20
  },

  select: {
    padding: 10,
    borderRadius: 8,
    background: "#020617",
    border: "1px solid #1e293b",
    color: "white"
  },

  button: {
    padding: "10px 15px",
    background: "#22c55e",
    border: "none",
    borderRadius: 8
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20
  },

  card: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 12,
    padding: 20
  },

  chartCard: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 12,
    padding: 20
  },

  top: {
    display: "flex",
    justifyContent: "space-between"
  },

  signal: {
    padding: "5px 10px",
    borderRadius: 8
  },

  price: {
    marginTop: 10
  },

  label: {
    color: "#94a3b8",
    fontSize: 12
  },

  progressBar: {
    height: 8,
    background: "#1e293b",
    borderRadius: 10,
    marginBottom: 10
  },

  progressFill: {
    height: "100%",
    background: "#22c55e",
    borderRadius: 10
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
    marginTop: 20
  },

  riskBox: {
    marginTop: 20,
    padding: 10,
    background: "#111827",
    borderRadius: 8
  },

  reason: {
    marginTop: 20
  }
};