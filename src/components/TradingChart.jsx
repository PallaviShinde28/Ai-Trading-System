import React, { useEffect, useRef } from "react";

const TradingChart = ({ symbol }) => {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
    });

    container.current.innerHTML = "";
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      ref={container}
      style={{ height: "400px", marginTop: "10px" }}
    />
  );
};

export default TradingChart;