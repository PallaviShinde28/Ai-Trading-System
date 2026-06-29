import React, { useState, useEffect } from "react";

export default function Trade() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
const userKey = currentUser.email || "guest";

  const stocks = [
  { label: "Bitcoin", value: "BTCUSDT" },
  { label: "Ethereum", value: "ETHUSDT" },
  { label: "Solana", value: "SOLUSDT" },
  { label: "BNB", value: "BNBUSDT" },
  { label: "Ripple", value: "XRPUSDT" },
  { label: "Cardano", value: "ADAUSDT" },
  { label: "Dogecoin", value: "DOGEUSDT" },
  { label: "Avalanche", value: "AVAXUSDT" },
  { label: "Polkadot", value: "DOTUSDT" },
  { label: "Litecoin", value: "LTCUSDT" }
];

  const [symbol, setSymbol] = useState("BTCUSDT");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(null);

  // ✅ DYNAMIC WALLET + PORTFOLIO
  const [wallet, setWallet] = useState(
  parseFloat(localStorage.getItem(`wallet_${userKey}`)) || 100000
);

  const [portfolio, setPortfolio] = useState(
  JSON.parse(localStorage.getItem(`portfolio_${userKey}`) || "[]")
);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔥 FETCH PRICE
  const fetchPrice = async () => {
    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
      );
      const data = await res.json();
      setPrice(parseFloat(data.price));
    } catch {
      setPrice(null);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 3000);
    return () => clearInterval(interval);
  }, [symbol]);

  // CLEAR ERROR WHEN PRICE LOADS
  useEffect(() => {
    if (price) setError("");
  }, [price]);

  // ================= BUY =================
  const handleBuy = () => {

    setError("");
    setSuccess("");

    if (!price) {
      setError("⚠️ Please wait, fetching latest price...");
      return;
    }

    const totalCost = price * quantity;

    if (wallet < totalCost) {
      setError("❌ Insufficient balance");
      return;
    }

    let updatedPortfolio;

    const existing = portfolio.find(p => p.symbol === symbol);

    if (existing) {
  updatedPortfolio = portfolio.map(p => {
    if (p.symbol === symbol) {
      const newQty = p.qty + quantity;

      const newAvg =
        ((p.avgBuyPrice * p.qty) + (price * quantity)) / newQty;

      return {
        ...p,
        qty: newQty,
        avgBuyPrice: newAvg
      };
    }
    return p;
  });
} else {
  updatedPortfolio = [
    ...portfolio,
    {
      symbol,
      qty: quantity,
      avgBuyPrice: price
    }
  ];
}
    const newWallet = wallet - totalCost;

    setWallet(newWallet);
    setPortfolio(updatedPortfolio);

    // ✅ SAVE
   localStorage.setItem(`wallet_${userKey}`, newWallet);
localStorage.setItem(
  `portfolio_${userKey}`,
  JSON.stringify(updatedPortfolio)
);
    
    // i write this code start from const newTrade = { to end with  JSON.stringify([newTrade, ...oldHistory]) );
    // 🔥 SAVE TRADE HISTORY (BUY)
const newTrade = {
  id: Date.now(),
  type: "BUY",
  symbol,
  quantity,
  price,
  total: totalCost,
  date: new Date().toLocaleString()
};

const oldHistory = JSON.parse(
  localStorage.getItem(`tradeHistory_${userKey}`) || "[]"
);
localStorage.setItem(
  `tradeHistory_${userKey}`,
  JSON.stringify([newTrade, ...oldHistory])
);
    setSuccess("✅ Bought successfully");
  };

  // ================= SELL =================
  const handleSell = () => {

    setError("");
    setSuccess("");

    if (!price) {
      setError("⚠️ Price not available");
      return;
    }

    const holding = portfolio.find(p => p.symbol === symbol);

    if (!holding) {
      setError("❌ You don't own this crypto. Buy first.");
      return;
    }

    if (holding.qty < quantity) {
      setError("❌ Not enough quantity to sell.");
      return;
    }

    const totalValue = price * quantity;

    const updatedPortfolio = portfolio
      .map(p =>
        p.symbol === symbol
          ? { ...p, qty: p.qty - quantity }
          : p
      )
      .filter(p => p.qty > 0);

    const newWallet = wallet + totalValue;

    setWallet(newWallet);
    setPortfolio(updatedPortfolio);

    // ✅ SAVE
    localStorage.setItem(`wallet_${userKey}`, newWallet);
localStorage.setItem(
  `portfolio_${userKey}`,
  JSON.stringify(updatedPortfolio)
);
    // i write this code start from const newTrade = { to end with  JSON.stringify([newTrade, ...oldHistory]) ); 

    // 🔥 SAVE TRADE HISTORY (SELL)
const newTrade = {
  id: Date.now(),
  type: "SELL",
  symbol,
  quantity,
  price,
  total: totalValue,
  date: new Date().toLocaleString()
};

const oldHistory = JSON.parse(
  localStorage.getItem(`tradeHistory_${userKey}`) || "[]"
);
localStorage.setItem(
  `tradeHistory_${userKey}`,
  JSON.stringify([newTrade, ...oldHistory])
);
    setSuccess("✅ Sold successfully");
  };

  const maxQty = price ? (wallet / price).toFixed(4) : 0;
  const hasHolding = portfolio.find(p => p.symbol === symbol);

  return (
    <div style={styles.container}>

      <h2>Trade Crypto</h2>

      {/* 💰 WALLET */}
      <div style={styles.wallet}>
        Wallet Balance: ₹{wallet.toFixed(2)}
      </div>
 
      <div style={styles.box}>

        <label>Select Crypto</label>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={styles.select}
        >
          {stocks.map((s, i) => (
            <option key={i} value={s.value}>{s.label}</option>
          ))}
        </select> 


        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={styles.input}
        />

        <div style={styles.price}>
          Price: {price ? `₹${price.toFixed(2)}` : "Loading..."}
        </div>

        {!price && (
          <div style={styles.loading}>
            ⏳ Fetching live price...
          </div>
        )}

        {price && (
          <div style={styles.max}>
            Max you can buy: {maxQty}
          </div>
        )}

        <div style={styles.buttons}>
          <button onClick={handleBuy} style={styles.buy}>Buy</button>

          <button
            onClick={handleSell}
            disabled={!hasHolding}
            style={{
              ...styles.sell,
              opacity: hasHolding ? 1 : 0.5
            }}
          >
            Sell
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

      </div>

      <div style={styles.box}>
  <h3>Your Portfolio</h3>

  {portfolio.length === 0 && <p>No assets</p>}

  {portfolio.map((p, i) => (
    <div key={i} style={styles.row}>
      <div>{p.symbol}</div>
      <div>{p.qty.toFixed(4)}</div>

      <div>
        ₹{price ? (p.qty * price).toFixed(2) : "Loading..."}
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

const styles = {
  container: { padding: 20, color: "white" },

  wallet: { marginBottom: 20, fontSize: 18, color: "#22c55e" },

  box: {
    background: "#020617",
    padding: 20,
    borderRadius: 10,
    border: "1px solid #1e293b",
    maxWidth: 400,
    marginBottom: 20
  },

  select: {
  width: "100%",
  padding: 10,
  marginBottom: 15,
  background: "#020617",   // 🔥 dark background
  color: "white",          // 🔥 text color
  border: "1px solid #0ea5e9", // 🔥 blue border (matches theme)
  borderRadius: "8px",
  outline: "none",
  cursor: "pointer"
},

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    background: "#020617",
    border: "1px solid #334155",
    color: "white"
  },

  price: { marginBottom: 10, color: "#38bdf8" },

  loading: { marginBottom: 10, color: "#f59e0b" },

  max: { marginBottom: 10, color: "#94a3b8" },

  buttons: { display: "flex", gap: 10 },

  buy: { flex: 1, background: "#22c55e", color: "white" },

  sell: { flex: 1, background: "#ef4444", color: "white" },

  error: { marginTop: 10, color: "#ef4444" },

  success: { marginTop: 10, color: "#22c55e" },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10
  }
};