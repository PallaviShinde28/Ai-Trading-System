const getSignal = (sentiment) => {
  if (sentiment === "POSITIVE") {
    return "BUY";
  } else if (sentiment === "NEGATIVE") {
    return "SELL";
  } else {
    return "HOLD";
  }
};

export default getSignal;