import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export default function ChartPage() {
  const { symbol } = useParams();

  const [prices, setPrices] = useState([]);
  const [labels, setLabels] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
    );

    ws.current.onmessage = (e) => {
      const price = parseFloat(JSON.parse(e.data).p);

      setPrices(p => [...p.slice(-50), price]);
      setLabels(l => [...l.slice(-50), new Date().toLocaleTimeString()]);
    };

    return () => ws.current.close();
  }, [symbol]);

  const data = {
    labels,
    datasets: [
      {
        label: symbol,
        data: prices,
        borderColor: "#22c55e",
        tension: 0.4
      }
    ]
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{symbol} Live Chart</h2>
      <Line data={data} />
    </div>
  );
}