let currentCandle = null;

export default function buildCandle(price, timestamp) {

  const minute = Math.floor(timestamp / 60000) * 60000;

  if (!currentCandle || currentCandle.time !== minute) {
    currentCandle = {
      time: minute / 1000,
      open: price,
      high: price,
      low: price,
      close: price
    };
  } else {
    currentCandle.high = Math.max(currentCandle.high, price);
    currentCandle.low = Math.min(currentCandle.low, price);
    currentCandle.close = price;
  }

  return currentCandle;
}