import React, { useEffect, useRef } from "react";

const TradingViewChart = ({ symbol }) => {
  const containerRef = useRef();

 useEffect(() => {
  if (!containerRef.current) return;

  containerRef.current.innerHTML = "";

  const script = document.createElement("script");
  script.src =
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
  script.type = "text/javascript";
  script.async = true;

  script.innerHTML = JSON.stringify({
    autosize: true,
    symbol: symbol,
    interval: "5",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    range: "1D",
    withdateranges: true,
    hide_side_toolbar: true,
    allow_symbol_change: false,
    hide_top_toolbar: false,
    save_image: false,
    container_id: containerRef.current.id
  });

  containerRef.current.appendChild(script);

}, [symbol]);

  return (
    <div
      id="tradingview_chart"
      ref={containerRef}
      style={{
  height: "600px",
  background: "#020617",     // 🔥 FIX white box
  borderRadius: "10px",      // optional UI improvement
  overflow: "hidden"         // prevents white edges
}}
    />
  );
};

export default TradingViewChart;


