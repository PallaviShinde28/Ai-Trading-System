import React from "react";
import { useParams } from "react-router-dom";

export default function MarketDetail() {
  const { symbol } = useParams();

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h2>Market Detail Page</h2>
      <p>Selected Stock: <strong>{symbol}</strong></p>
    </div>
  );
}