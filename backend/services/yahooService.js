// const axios = require("axios");

// async function getYahooHistory(symbol, interval = "1d", range = "1mo") {
//   const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

//   const response = await axios.get(url);
//   const data = response.data.chart.result?.[0];

//   if (!data) {
//     throw new Error("No data from Yahoo Finance");
//   }

//   const timestamps = data.timestamp;
//   const indicators = data.indicators.quote[0];

//   const formatted = timestamps.map((t, i) => ({
//     time: t,
//     open: indicators.open[i],
//     high: indicators.high[i],
//     low: indicators.low[i],
//     close: indicators.close[i],
//     volume: indicators.volume[i],
//   }));

//   return formatted;
// }

// module.exports = { getYahooHistory };


const axios = require("axios");

async function getYahooHistory(symbol, interval = "1d", range = "1mo") {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=BTC-USD`;

  const response = await axios.get(url);
  const data = response.data.chart.result?.[0];

  if (!data) {
    throw new Error("No data from Yahoo Finance");
  }

  const timestamps = data.timestamp;
  const indicators = data.indicators.quote[0];

  const formatted = timestamps.map((t, i) => ({
    time: t,
    open: indicators.open[i],
    high: indicators.high[i],
    low: indicators.low[i],
    close: indicators.close[i],
    volume: indicators.volume[i],
  }));

  return formatted;
}

module.exports = { getYahooHistory };