import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const MarketChart = ({ title, data }) => {
  const [series, setSeries] = useState([{ data: [] }]);

  const options = {
    chart: {
      type: "candlestick",
      toolbar: { show: true },
      animations: { enabled: true },
      background: "transparent",
    },
    title: {
      text: title,
      style: { color: "#fff" },
    },
    xaxis: {
      type: "datetime",
      labels: { style: { colors: "#ccc" } },
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: { style: { colors: "#ccc" } },
    },
    theme: { mode: "dark" },
    grid: {
      borderColor: "#333",
    },
  };

  useEffect(() => {
    if (!data || !data.length) return;

    console.log("Last candle:", data[data.length - 1]);

    const formatted = data.map((c) => ({
      x: new Date(c.time * 1000), // ✅ seconds → milliseconds
      y: [c.open, c.high, c.low, c.close],
    }));

    setSeries([{ data: formatted }]);
  }, [data]);

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg w-full">
      <div style={{ width: "100%", height: "400px" }}>
        <Chart
          options={options}
          series={series}
          type="candlestick"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
};

export default MarketChart;