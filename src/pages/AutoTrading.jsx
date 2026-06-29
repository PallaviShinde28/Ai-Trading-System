
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function AutoTrading() {

  const [botOn, setBotOn] = useState(() => {
    return localStorage.getItem("botOn") === "true";
  });

  const [activeTab, setActiveTab] = useState("market");

  const [balance, setBalance] = useState(0);
  const [portfolio, setPortfolio] = useState({});
  const [logs, setLogs] = useState([]);

  const [signals, setSignals] = useState({});
  const [prices, setPrices] = useState({});

  const [priceHistory, setPriceHistory] = useState([]);
  const [labels, setLabels] = useState([]);
  const [profitToday, setProfitToday] = useState(0);
  const [tradeCount, setTradeCount] = useState(0);
  const [winCount, setWinCount] = useState(0);
  const [riskLevel, setRiskLevel] = useState("Medium");
  const [tradeAmount, setTradeAmount] = useState(1000);

  const [takeProfit, setTakeProfit] = useState(5);
  const [stopLoss, setStopLoss] = useState(3);
  const [backendStatus, setBackendStatus] = useState(false);
  // ================= PORTFOLIO STORAGE =================

  // Load portfolio when component starts
  useEffect(() => {
    const savedPortfolio = JSON.parse(
      localStorage.getItem("portfolio") || "{}"
    );

    setPortfolio(savedPortfolio);
  }, []);

  // Save portfolio whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "portfolio",
      JSON.stringify(portfolio)
    );
  }, [portfolio]);
  const coins = [
    "bitcoin",
    "ethereum",
    "solana"
  ];


  const symbolMap = {
    bitcoin: "BTCUSDT",
    ethereum: "ETHUSDT",
    solana: "SOLUSDT"
  };

  // ================= WALLET =================
  useEffect(() => {
    const loadWallet = () => {
      const savedWallet =
        parseFloat(localStorage.getItem("wallet")) || 100000;

      setBalance(savedWallet);
    };

    loadWallet();
    const interval = setInterval(loadWallet, 2000);

    return () => clearInterval(interval);
  }, []);

  const addLog = (text) => {
    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ${text}`,
      ...prev
    ].slice(0, 20));
  };

  // ================= PRICES =================
  const fetchPrices = async () => {
    try {
      const res = await axios.get(
        "https://api.binance.com/api/v3/ticker/price"
      );

      const map = {};
      res.data.forEach(p => {
        map[p.symbol] = parseFloat(p.price);
      });

      setPrices(map);
      console.log("Prices Updated", map);
      console.log(map["BTCUSDT"]);
      console.log(map["ETHUSDT"]);
      console.log(map["SOLUSDT"]);
      // ================= CHECK OPEN POSITIONS =================
      Object.entries(portfolio).forEach(([symbol, position]) => {
        const currentPrice = map[symbol];

        if (!currentPrice) return;

        const pnlPercent =
          ((currentPrice - position.entry) / position.entry) * 100;

        // Take Profit
        if (pnlPercent >= takeProfit) {
          executeTrade(symbol, {
            signal: "SELL",
            confidence: 100,
            price: currentPrice
          });
        }

        // Stop Loss
        if (pnlPercent <= -stopLoss) {
          executeTrade(symbol, {
            signal: "SELL",
            confidence: 100,
            price: currentPrice
          });
        }
      });

      const btc = map["BTCUSDT"];

      if (btc) {
        setPriceHistory(prev => [...prev.slice(-20), btc]);
        setLabels(prev => [...prev.slice(-20), new Date().toLocaleTimeString()]);
      }

    } catch (err) {
      console.error(err);
    }
  };
  // Every 5 seconds (when fetchPrices() runs):

  // ✅ Gets the latest Binance prices.
  // ✅ Checks all open positions.
  // ✅ If profit reaches the Take Profit %, it automatically sells.
  // ✅ If loss reaches the Stop Loss %, it automatically sells
  // ================= TRADE =================
  const executeTrade = (symbol, data) => {
    console.log("Executing:", symbol, data);

    const { signal, confidence, price } = data;

    if (confidence < 20) return;

    if (!price) {
      console.log("Price not available for", symbol);
      return;
    }
    const time = new Date().toLocaleTimeString();
    const amount = tradeAmount;

    if (signal === "BUY" && balance >= amount && !portfolio[symbol]) {

      setPortfolio(prev => ({
        ...prev,
        [symbol]: { amount, entry: price }
      }));

      setBalance(prev => {
        const newBalance = prev - amount;
        localStorage.setItem("wallet", newBalance);
        return newBalance;
      });

      addLog(`[${time}] BUY ${symbol} @ ${price}`);
      console.log("BUY SUCCESS:", symbol);
    }

    if (signal === "SELL" && portfolio[symbol]) {

      const entry = portfolio[symbol].entry;
      const invested = portfolio[symbol].amount;

      const pnl = ((price - entry) / entry) * invested;
      setTradeCount(prev => prev + 1);

      if (pnl > 0) {
        setWinCount(prev => prev + 1);
      }

      setProfitToday(prev => prev + pnl);

      setBalance(prev => {
        const newBalance = prev + invested + pnl;
        localStorage.setItem("wallet", newBalance);
        return newBalance;
      });

      setPortfolio(prev => {
        const copy = { ...prev };
        delete copy[symbol];
        return copy;
      });

      addLog(`[${time}] SELL ${symbol} | PnL ₹${pnl.toFixed(2)}`);
      console.log("SELL SUCCESS:", symbol);
    }
  };

  // ================= SIGNALS (FIXED) =================

  // ================= SIGNALS =================
  const fetchSignals = async () => {
    try {
      const results = await Promise.all(
        coins.map(async (coin) => {
          const res = await fetch(
            `http://localhost:5000/api/news-signal/${coin}`
          );

          const data = await res.json();

          return { coin, data };
        })
      );

      setBackendStatus(true);

      const formatted = {};

      results.forEach(({ coin, data }) => {
        const symbol = symbolMap[coin];

        let signal = data?.summary?.marketSignal || "BUY";
        let confidence = data?.summary?.confidence ?? 80;

        // Testing
        if (signal === "HOLD" || confidence === 0) {
          signal = "BUY";
          confidence = 100;
        }

        formatted[symbol] = {
          signal,
          confidence,
        };
      });

      setSignals(formatted);

      if (botOn) {
        Object.entries(formatted).forEach(([symbol, signalData]) => {
          const currentPrice = prices[symbol];

          if (!currentPrice) return;

          if (
            signalData.signal === "BUY" &&
            !portfolio[symbol]
          ) {
            executeTrade(symbol, {
              ...signalData,
              price: currentPrice,
            });
          }

          if (
            signalData.signal === "SELL" &&
            portfolio[symbol]
          ) {
            executeTrade(symbol, {
              ...signalData,
              price: currentPrice,
            });
          }
        });
      }
    } catch (error) {
      setBackendStatus(false);
      console.error("SIGNAL FETCH ERROR:", error);

      const fallback = {
        BTCUSDT: { signal: "HOLD", confidence: 50 },
        ETHUSDT: { signal: "HOLD", confidence: 50 },
      };

      setSignals(fallback);
    }
  };
  // ================= LOOP =================
  useEffect(() => {

    const loadData = async () => {
      await fetchPrices();
      await fetchSignals();
    };

    loadData();

    const interval = setInterval(loadData, 5000);

    return () => clearInterval(interval);

  }, [botOn]);
  // ================= CHART =================
  const portfolioValue = Object.entries(portfolio).reduce(
    (total, [symbol, p]) => {
      const currentPrice =
        prices[symbol] || p.entry;

      return (
        total +
        (currentPrice / p.entry) *
        p.amount
      );
    },
    0
  );

  const totalPnL = Object.entries(portfolio).reduce(
    (total, [symbol, p]) => {

      const currentPrice =
        prices[symbol] || p.entry;

      const pnl =
        ((currentPrice - p.entry) /
          p.entry) *
        p.amount;

      return total + pnl;

    },
    0
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "BTC Price",
        data: priceHistory,
        borderColor: "#22c55e"
      }
    ]
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white"
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "white" }
      },
      y: {
        ticks: { color: "white" }
      }
    }
  };

  return (
    <div style={styles.wrapper}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
          flexWrap: "wrap"
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#fff"
            }}
          >
            🤖 AI Trading Dashboard
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: 5
            }}
          >
            Automated Crypto Trading System
          </p>
        </div>

        <div
          style={{
            background: "#22c55e",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 12,
            fontWeight: "bold"
          }}
        >
          🟢 LIVE
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 15,
          marginBottom: 20
        }}
      >
        <div style={styles.statCard}>
          <h4>💰 Wallet</h4>
          <h2>₹{balance.toFixed(0)}</h2>
        </div>

        <div style={styles.statCard}>
          <h4>📊 Trades</h4>
          <h2>{tradeCount}</h2>
        </div>

        <div style={styles.statCard}>
          <h4>📈 Profit</h4>
          <h2
            style={{
              color:
                profitToday >= 0
                  ? "#22c55e"
                  : "#ef4444"
            }}
          >
            ₹{profitToday.toFixed(2)}
          </h2>
        </div>

        <div style={styles.statCard}>
          <h4>🎯 Win Rate</h4>
          <h2>
            {tradeCount > 0
              ? ((winCount / tradeCount) * 100).toFixed(0)
              : 0}
            %
          </h2>
        </div>

        <div style={styles.statCard}>
          <h4>🤖 AI Status</h4>
          <h2
            style={{
              color:
                botOn
                  ? "#22c55e"
                  : "#ef4444"
            }}
          >
            {botOn ? "ACTIVE" : "STOPPED"}
          </h2>
        </div>

        <div style={styles.statCard}>
          <h4>📂 Positions</h4>
          <h2>
            {Object.keys(portfolio).length}
          </h2>
        </div>
        <div style={styles.statCard}>
          <h4>💼 Portfolio</h4>
          <h2>
            ₹{portfolioValue.toFixed(0)}
          </h2>
        </div>

        <div style={styles.statCard}>
          <h4>📈 Live P&L</h4>

          <h2
            style={{
              color:
                totalPnL >= 0
                  ? "#22c55e"
                  : "#ef4444"
            }}
          >
            ₹{totalPnL.toFixed(2)}
          </h2>
        </div>
      </div>

      <div style={styles.statCard}>
        <h4>🧠 AI Confidence</h4>

        <h2 style={{ color: "#22c55e" }}>
          {Math.round(
            Object.values(signals).reduce(
              (sum, item) => sum + item.confidence,
              0
            ) /
            Math.max(Object.keys(signals).length, 1)
          )}
          %
        </h2>
      </div>
      {/* STATS CARDS */}


      {/* 👇 PASTE STEP 1 HERE */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 15,
          marginBottom: 20
        }}
      >

        <div style={styles.statCard}>
          <h4>₿ Bitcoin</h4>
          <h2>
            ${prices.BTCUSDT?.toFixed(2) || 0}
          </h2>
        </div>

        <div style={styles.statCard}>
          <h4>Ξ Ethereum</h4>
          <h2>
            ${prices.ETHUSDT?.toFixed(2) || 0}
          </h2>
        </div>

        <div style={styles.statCard}>
          <h4>◎ Solana</h4>
          <h2>
            ${prices.SOLUSDT?.toFixed(2) || 0}
          </h2>
        </div>

      </div>
      <div style={styles.card}>

        <h3>🤖 AI Control Center</h3>

        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 15,
            flexWrap: "wrap"
          }}
        >

          <div>
            <label>Risk Level</label>
            <br />

            <select
              value={riskLevel}
              onChange={(e) =>
                setRiskLevel(e.target.value)
              }
              style={{
                marginTop: 8,
                padding: 8,
                borderRadius: 8,
                background: "#0f172a",
                color: "white",
                border: "1px solid #1e293b"
              }}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label>Trade Amount</label>
            <br />

            <input
              type="number"
              value={tradeAmount}
              onChange={(e) =>
                setTradeAmount(
                  Number(e.target.value)
                )
              }
              style={{
                marginTop: 8,
                padding: 8,
                borderRadius: 8,
                background: "#0f172a",
                color: "white",
                border: "1px solid #1e293b"
              }}
            />
          </div>

        </div>

      </div>
      <div>
        <label>Take Profit (%)</label>
        <br />

        <input
          type="number"
          value={takeProfit}
          onChange={(e) =>
            setTakeProfit(Number(e.target.value))
          }
          style={{
            marginTop: 8,
            padding: 8,
            borderRadius: 8,
            background: "#0f172a",
            color: "white",
            border: "1px solid #1e293b"
          }}
        />
      </div>

      <div>
        <label>Stop Loss (%)</label>
        <br />

        <input
          type="number"
          value={stopLoss}
          onChange={(e) =>
            setStopLoss(Number(e.target.value))
          }
          style={{
            marginTop: 8,
            padding: 8,
            borderRadius: 8,
            background: "#0f172a",
            color: "white",
            border: "1px solid #1e293b"
          }}
        />
      </div>
      {/* AI BUTTON */}

      <div
        style={{
          display: "flex",
          gap: 15,
          margin: "20px 0",
          flexWrap: "wrap"
        }}
      >
        <button
          onClick={() => {
            const newState = !botOn;
            setBotOn(newState);
            localStorage.setItem("botOn", newState);
          }}
          style={{
            flex: 1,
            minWidth: 180,
            padding: "14px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 16,
            color: "#fff",
            background: botOn ? "#22c55e" : "#ef4444"
          }}
        >
          {botOn ? "🤖 AI Running" : "▶ Start AI"}
        </button>

        <button
          onClick={() => {
            setBotOn(false);
            localStorage.setItem("botOn", false);
            addLog("Emergency Stop Activated");
          }}
          style={{
            flex: 1,
            minWidth: 180,
            padding: "14px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 16,
            color: "#fff",
            background: "#dc2626"
          }}
        >
          🛑 Emergency Stop
        </button>
      </div>
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          gap: 15
        }}
      >

        <div
          style={{
            background: "#081225",
            padding: "12px 20px",
            borderRadius: 12
          }}
        >

          {backendStatus
            ? "🟢 Backend Connected"
            : "🔴 Backend Offline"}

        </div>

        <div
          style={{
            background: "#081225",
            padding: "12px 20px",
            borderRadius: 12
          }}
        >

          🤖 AI {botOn ? "Running" : "Stopped"}

        </div>

      </div>

      <div style={styles.tabs}>
        {[
          "wallet",
          "market",
          "signals",
          "positions",
          "logs"
        ].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              background: activeTab === tab ? "#22c55e" : "#020617"
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* WALLET */}
      {activeTab === "wallet" && (
        <div style={styles.card}>
          <h2>💰 Wallet</h2>

          <h1>₹{balance.toFixed(2)}</h1>

          <p>Total Portfolio : ₹{portfolioValue.toFixed(2)}</p>

          <p>Total Profit : ₹{profitToday.toFixed(2)}</p>
        </div>
      )}
      {activeTab === "market" && (
        <div style={styles.card}>
          <h2>📈 Live Market</h2>

          {priceHistory.length > 0 ? (
            <Line
              data={chartData}
              options={chartOptions}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: 50
              }}
            >
              Loading Market Data...
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20,
              marginTop: 20
            }}
          >
            <div style={styles.statCard}>
              <h3>BTC</h3>
              <h2>${prices.BTCUSDT?.toFixed(2)}</h2>
            </div>

            <div style={styles.statCard}>
              <h3>ETH</h3>
              <h2>${prices.ETHUSDT?.toFixed(2)}</h2>
            </div>

            <div style={styles.statCard}>
              <h3>SOL</h3>
              <h2>${prices.SOLUSDT?.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      )}

      {/* SIGNALS (FIXED) */}

      {activeTab === "signals" && (

        <div style={styles.card}>

          <h2>🧠 AI Trading Signals</h2>

          {Object.keys(signals).length === 0 ? (
            <p>No AI Signals</p>
          ) : (

            Object.entries(signals).map(([symbol, data]) => (

              <div
                key={symbol}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 15,
                  borderBottom: "1px solid #1e293b"
                }}
              >

                <div>

                  <strong>{symbol}</strong>

                  <br />

                  <small>

                    ₹{prices[symbol]?.toFixed(2) || 0}

                  </small>

                </div>

                <div>

                  <strong
                    style={{
                      color:
                        data.signal === "BUY"
                          ? "#22c55e"
                          : data.signal === "SELL"
                            ? "#ef4444"
                            : "#facc15"
                    }}
                  >

                    {data.signal}

                  </strong>

                </div>

                <div>

                  {data.confidence}%

                </div>

              </div>

            ))

          )}

        </div>

      )}

      {activeTab === "positions" && (
        <div style={styles.card}>
          <h3>Open Positions</h3>

          {Object.keys(portfolio).length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 50
              }}
            >
              <h1 style={{ fontSize: 60 }}>📂</h1>

              <h2>No Open Positions</h2>

              <p style={{ color: "#94a3b8" }}>
                AI is waiting for the next trading opportunity.
              </p>
            </div>
          ) : (
            Object.entries(portfolio).map(([symbol, pos]) => (
              <div
                key={symbol}
                style={{
                  background: "#081225",
                  padding: 20,
                  borderRadius: 15,
                  marginBottom: 15,
                  border:
                    ((prices[symbol] || pos.entry) - pos.entry) >= 0
                      ? "2px solid #22c55e"
                      : "2px solid #ef4444"
                }}
              >
                <h2>{symbol}</h2>

                <hr
                  style={{
                    border: "1px solid #1e293b",
                    margin: "10px 0"
                  }}
                />

                <p>💰 Entry Price : ₹{pos.entry.toFixed(2)}</p>

                <p>
                  📈 Current Price :
                  ₹{(prices[symbol] || pos.entry).toFixed(2)}
                </p>

                <h3
                  style={{
                    color:
                      ((prices[symbol] || pos.entry) - pos.entry) >= 0
                        ? "#22c55e"
                        : "#ef4444"
                  }}
                >
                  PnL :
                  ₹
                  {(
                    (((prices[symbol] || pos.entry) - pos.entry) /
                      pos.entry) *
                    pos.amount
                  ).toFixed(2)}
                </h3>
              </div>
            ))
          )}
        </div>
      )}


      {/* LOGS (FIXED) */}
      {activeTab === "logs" && (
        <div style={styles.card}>
          <h3>Logs</h3>

          {logs.length === 0 && <div
            style={{
              textAlign: "center",
              padding: 40
            }}
          >
            <h1>📜</h1>

            <h3>No Trading Activity</h3>

            <p style={{ color: "#94a3b8" }}>
              Waiting for AI trading signals...
            </p>
          </div>}

          {logs.map((l, i) => (
            <div key={i} style={styles.row}>{l}</div>
          ))}
        </div>
      )}
    </div>



  );
}
export default AutoTrading;


// ================= STYLES =================


const styles = {
  wrapper: {
    padding: 20,
    background: "#020617",
    minHeight: "100vh",
    color: "white",
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    flexWrap: "wrap",
    margin: "20px 0"
  },

  tab: {
    padding: "12px 24px",
    borderRadius: 12,
    border: "1px solid #1e293b",
    background: "#0f172a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "0.3s",
    textAlign: "center",
    minWidth: "120px"
  },

  card: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 12,
    padding: 20,
  },

  statCard: {
    background: "#081225",
    borderRadius: 18,
    padding: 22,
    border: "1px solid #1e293b",
    boxShadow: "0 10px 25px rgba(0,0,0,.35)",
    transition: "0.3s",
    cursor: "pointer"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: 8,
    borderBottom: "1px solid #1e293b",
  },

  positionCard: {
    background: "#081225",
    border: "1px solid #1e293b",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
};