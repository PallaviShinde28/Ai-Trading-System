

import React, { useEffect, useState } from "react";
import axios from "axios";
import TradingViewChart from "../components/TradingViewChart";

export default function Market() {

 const stocks = [
  { finnhub: "BINANCE:BTCUSDT", yahoo: "BTC-USD", title: "Bitcoin" },
  { finnhub: "BINANCE:ETHUSDT", yahoo: "ETH-USD", title: "Ethereum" },
  { finnhub: "BINANCE:SOLUSDT", yahoo: "SOL-USD", title: "Solana" },
  { finnhub: "BINANCE:BNBUSDT", yahoo: "BNB-USD", title: "BNB" },
  { finnhub: "BINANCE:XRPUSDT", yahoo: "XRP-USD", title: "Ripple" },
  { finnhub: "BINANCE:ADAUSDT", yahoo: "ADA-USD", title: "Cardano" },
  { finnhub: "BINANCE:DOGEUSDT", yahoo: "DOGE-USD", title: "Dogecoin" },
  { finnhub: "BINANCE:AVAXUSDT", yahoo: "AVAX-USD", title: "Avalanche" }, // ✅ REPLACED
  { finnhub: "BINANCE:DOTUSDT", yahoo: "DOT-USD", title: "Polkadot" },
  { finnhub: "BINANCE:LTCUSDT", yahoo: "LTC-USD", title: "Litecoin" }
];
  
  const [data, setData] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(stocks[0].finnhub);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    try {
      const results = await Promise.all(
        stocks.map(async (stock) => {
          const res = await axios.get(
            `http://localhost:5000/api/market/yahoo/${stock.yahoo}`
          );

          const quote = res.data.data;

          return {
            symbol: stock.finnhub,
            yahoo: stock.yahoo,
            title: stock.title,
            price: quote?.regularMarketPrice || 0,
            changePercent: quote?.regularMarketChangePercent || 0
          };
        })
      );

      setData(results);

    } catch (error) {
      console.error("Quote Error:", error.message);
    }
  };

  return (
    <div style={{ color: "white", padding: 20 }}>

      <h2>Live Market</h2>

      {/* ✅ Dropdown instead of long list */}
      <select
  value={selectedSymbol}
  onChange={(e) => setSelectedSymbol(e.target.value)}
  style={{
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "6px",
    backgroundColor: "white",  // ✅ FIX
    color: "black"             // ✅ FIX
  }}
>
        {stocks.map((s, i) => (
          <option key={i} value={s.finnhub}>
            {s.title}
          </option>
        ))}
      </select>

      {/* Selected Data */}
      {data
        .filter(s => s.symbol === selectedSymbol)
        .map((stock, index) => (
          <div key={index} style={styles.card}>
            <h3>{stock.title}</h3>
            <p>₹{stock.price}</p>
            <p style={{
              color: stock.changePercent >= 0 ? "#22c55e" : "#ef4444"
            }}>
              {stock.changePercent?.toFixed(2)}%
            </p>
          </div>
        ))}
      
      
      {/* Chart */}
      <TradingViewChart symbol={selectedSymbol} />

    </div>
  );
}

const styles = {
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#020617",
    border: "1px solid #1e293b"
  }
};
{window.aiData && (
  <div style={{
    marginTop: 15,
    padding: 10,
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 8
  }}>
    <p>🤖 Signal: {window.aiData.signal}</p>
    <p>💰 Price: {window.aiData.price}</p>
    <p style={{ color: "#ef4444" }}>
      🛑 SL: {window.aiData.stop_loss}
    </p>
    <p style={{ color: "#22c55e" }}>
      🎯 Target: {window.aiData.target}
    </p>
  </div>
)}