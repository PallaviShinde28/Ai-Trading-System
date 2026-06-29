

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchPrediction } from "../api/aiapi";
import React, { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

export default function Overview() {

  const [btc, setBtc] = useState([]);
  const [eth, setEth] = useState([]);
  const [sol, setSol] = useState([]);
  const [labels, setLabels] = useState([]);

  const wsBTC = useRef(null);
  const wsETH = useRef(null);
  const wsSOL = useRef(null);

  const navigate = useNavigate();

  const [holdings, setHoldings] = useState([]);
  const [signals, setSignals] = useState([]);
  const [market, setMarket] = useState([]);

  // 🔥 LIVE PRICE STREAM
  useEffect(() => {

    wsBTC.current = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
    wsETH.current = new WebSocket("wss://stream.binance.com:9443/ws/ethusdt@trade");
    wsSOL.current = new WebSocket("wss://stream.binance.com:9443/ws/solusdt@trade");

    wsBTC.current.onmessage = (e) => {
      const price = parseFloat(JSON.parse(e.data).p);
      setBtc(p => [...p.slice(-20), price]);
      setLabels(p => [...p.slice(-20), new Date().toLocaleTimeString()]);
    };

    wsETH.current.onmessage = (e) => {
      const price = parseFloat(JSON.parse(e.data).p);
      setEth(p => [...p.slice(-20), price]);
    };

    wsSOL.current.onmessage = (e) => {
      const price = parseFloat(JSON.parse(e.data).p);
      setSol(p => [...p.slice(-20), price]);
    };

    return () => {
      wsBTC.current.close();
      wsETH.current.close();
      wsSOL.current.close();
    };

  }, []);

  // 🔥 MARKET + HOLDINGS
  useEffect(() => {

    const fetchMarketData = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
        const data = await res.json();

        const getData = (symbol) =>
          data.find(d => d.symbol === symbol);

        setHoldings([
  {
    symbol: "BTCUSDT",
    qty: 0.5,
    buy: 65000,
    current: parseFloat(getData("BTCUSDT")?.lastPrice)
  },
  {
    symbol: "ETHUSDT",
    qty: 2,
    buy: 1900,
    current: parseFloat(getData("ETHUSDT")?.lastPrice)
  },
  {
    symbol: "SOLUSDT",
    qty: 10,
    buy: 75,
    current: parseFloat(getData("SOLUSDT")?.lastPrice)
  },
  {
    symbol: "BNBUSDT",
    qty: 5,
    buy: 600,
    current: parseFloat(getData("BNBUSDT")?.lastPrice)
  },
  {
    symbol: "XRPUSDT",
    qty: 500,
    buy: 2,
    current: parseFloat(getData("XRPUSDT")?.lastPrice)
  },
  {
    symbol: "ADAUSDT",
    qty: 400,
    buy: 1,
    current: parseFloat(getData("ADAUSDT")?.lastPrice)
  },
  {
    symbol: "DOGEUSDT",
    qty: 1000,
    buy: 0.25,
    current: parseFloat(getData("DOGEUSDT")?.lastPrice)
  },
  {
    symbol: "AVAXUSDT",
    qty: 50,
    buy: 30,
    current: parseFloat(getData("AVAXUSDT")?.lastPrice)
  },
  {
    symbol: "DOTUSDT",
    qty: 100,
    buy: 8,
    current: parseFloat(getData("DOTUSDT")?.lastPrice)
  },
  {
    symbol: "LTCUSDT",
    qty: 20,
    buy: 100,
    current: parseFloat(getData("LTCUSDT")?.lastPrice)
  }
]);
        setMarket([
  {
    symbol: "BTCUSDT",
    price: parseFloat(getData("BTCUSDT")?.lastPrice),
    change: parseFloat(getData("BTCUSDT")?.priceChangePercent)
  },
  {
    symbol: "ETHUSDT",
    price: parseFloat(getData("ETHUSDT")?.lastPrice),
    change: parseFloat(getData("ETHUSDT")?.priceChangePercent)
  },
  {
    symbol: "SOLUSDT",
    price: parseFloat(getData("SOLUSDT")?.lastPrice),
    change: parseFloat(getData("SOLUSDT")?.priceChangePercent)
  },
  {
    symbol: "BNBUSDT",
    price: parseFloat(getData("BNBUSDT")?.lastPrice),
    change: parseFloat(getData("BNBUSDT")?.priceChangePercent)
  },
  {
    symbol: "XRPUSDT",
    price: parseFloat(getData("XRPUSDT")?.lastPrice),
    change: parseFloat(getData("XRPUSDT")?.priceChangePercent)
  },
  {
    symbol: "ADAUSDT",
    price: parseFloat(getData("ADAUSDT")?.lastPrice),
    change: parseFloat(getData("ADAUSDT")?.priceChangePercent)
  },
  {
    symbol: "DOGEUSDT",
    price: parseFloat(getData("DOGEUSDT")?.lastPrice),
    change: parseFloat(getData("DOGEUSDT")?.priceChangePercent)
  },
  {
    symbol: "AVAXUSDT",
    price: parseFloat(getData("AVAXUSDT")?.lastPrice),
    change: parseFloat(getData("AVAXUSDT")?.priceChangePercent)
  },
  {
    symbol: "DOTUSDT",
    price: parseFloat(getData("DOTUSDT")?.lastPrice),
    change: parseFloat(getData("DOTUSDT")?.priceChangePercent)
  },
  {
    symbol: "LTCUSDT",
    price: parseFloat(getData("LTCUSDT")?.lastPrice),
    change: parseFloat(getData("LTCUSDT")?.priceChangePercent)
  }
]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);

    return () => clearInterval(interval);

  }, []);

  // 🔥 AI PREDICTIONS
  useEffect(() => {

    const fetchAI = async () => {
      try {
        const coins = [
  "BTC-USD",
  "ETH-USD",
  "SOL-USD",
  "BNB-USD",
  "XRP-USD",
  "ADA-USD",
  "DOGE-USD",
  "AVAX-USD",
  "DOT-USD",
  "LTC-USD"
];

        const results = await Promise.all(
  coins.map(c => fetchPrediction(c))
);
        console.log("RESULTS =", results);
        setSignals(results.map(r => r.data));

      } catch (err) {
        console.log("AI error:", err);
      }
    };

    fetchAI();

  }, []);

  return (
    <div>

      {/* 🔥 DATA GRID */}
      <div style={styles.grid}>

        {/* Holdings */}
        <div style={styles.card}>
          <h3>Holdings</h3>
          {holdings.map((h, i) => {
            const profit = (h.current - h.buy) * h.qty;
            return (
              <div key={i} style={styles.row}>
                <div>{h.symbol}</div>
                <div>{h.qty}</div>
                <div>₹{h.current ? h.current.toFixed(2) : "--"}</div>
                <div style={{ color: profit >= 0 ? "#22c55e" : "#ef4444" }}>
                  ₹{profit.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Market Watchlist with Graph */}
        <div style={styles.card}>
          <h3>Market Watchlist</h3>

          {market.map((m, i) => (
            <div
              key={i}
              style={styles.marketRow}
              onClick={() => navigate(`/chart/${m.symbol}`)}
            >

              <div style={styles.marketLeft}>
                <div style={styles.logo}>📊</div>
                <div>{m.symbol}</div>
              </div>

              <div style={{ width: 120, height: 40 }}>
                <Line
                  data={{
                    labels: labels?.slice(-15) || [],
                    datasets: [
                      {
                        data:
                          m.symbol === "BTCUSDT"
                            ? (btc?.slice(-15) || [])
                            : m.symbol === "ETHUSDT"
                            ? (eth?.slice(-15) || [])
                            : (sol?.slice(-15) || []),
                        borderColor: "#22c55e",
                        tension: 0.4,
                        pointRadius: 0
                      }
                    ]
                  }}
                  options={{
                    plugins: { legend: { display: false } },
                    scales: { x: { display: false }, y: { display: false } }
                  }}
                />
              </div>

              <div>₹{m.price ? m.price.toFixed(2) : "--"}</div>

              <div style={{
                color: m.change >= 0 ? "#22c55e" : "#ef4444"
              }}>
                {m.change ? m.change.toFixed(2) : "--"}%
              </div>

            </div>
          ))}
        </div>

      

      </div>

    </div>
  );
}

const styles = {
  card: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderBottom: "1px solid #1e293b"
  },
  marketRow: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 1fr 1fr",
    alignItems: "center",
    padding: 10,
    borderBottom: "1px solid #1e293b",
    cursor: "pointer"
  },
  marketLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  logo: {
    width: 30,
    height: 30,
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6
  }
};