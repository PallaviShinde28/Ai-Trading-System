import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TradeHistory() {

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchHistory();

  }, []);

  
  
  const fetchHistory = () => {
  try {
    const data =
      JSON.parse(localStorage.getItem("tradeHistory")) || [];

    setTrades(data);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  if (loading)
    return <div style={{ color: "white" }}>Loading...</div>;


  return (

    <div style={{ color: "white", padding: 20 }}>

      <h2>Trade History</h2>

      {trades.length === 0 ? (

        <div>No trades yet</div>

      ) : (

        trades.map((trade, index) => (

          <div key={index} style={styles.card}>

            <div>
              <strong>{trade.symbol}</strong>
            </div>

            <div>
              Type:
              <span style={{
                color:
                  trade.type === "BUY"
                    ? "#22c55e"
                    : "#ef4444"
              }}>
                {" "}{trade.type}
              </span>
            </div>

            <div>
              Qty: {trade.quantity}
            </div>

            <div>
              Price: ₹{trade.price}
            </div>

            <div>
              Date: {trade.date}
            </div>

          </div>

        ))

      )}

    </div>

  );

}


const styles = {

  card: {

    border: "1px solid #1e293b",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10

  }

};


// Date: {trade.date} i write this instead of Date: {new Date(
                // trade.createdAt
              // ).toLocaleString()} 