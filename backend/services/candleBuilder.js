const currentCandles = {};

export default function buildCandle(symbol, price, timestampMs) {
  const minute = Math.floor(timestampMs / 60000) * 60000;

  if (!currentCandles[symbol]) {
    currentCandles[symbol] = null;
  }

  const existing = currentCandles[symbol];

  if (!existing || existing.time !== minute / 1000) {
    currentCandles[symbol] = {
      time: minute / 1000, // seconds for chart
      open: price,
      high: price,
      low: price,
      close: price,
    };
  } else {
    existing.high = Math.max(existing.high, price);
    existing.low = Math.min(existing.low, price);
    existing.close = price;
  }

  return currentCandles[symbol];
}