//export async function runAIPrediction(symbol, timeframe) {

  // Dummy ML logic (replace later with LSTM)

  //const randomDirection = Math.random() > 0.5 ? "UP" : "DOWN";
  //const confidence = (70 + Math.random() * 25).toFixed(2);
  //const movePercent = (Math.random() * 3).toFixed(2);
  //const currentPrice = 50000; // Replace with real price fetch

  //const targetPrice =
    // randomDirection === "UP"
     // ? currentPrice * (1 + movePercent / 100)
     // : currentPrice * (1 - movePercent / 100);

  //return {
   // symbol,
   // timeframe,
    //direction: randomDirection,
    //confidence,
    //movePercent,
   // targetPrice: targetPrice.toFixed(2)
 // };
//}

import axios from "axios";

export async function runAIPrediction(symbol, timeframe) {
  try {
    const response = await axios.post("http://127.0.0.1:8000/predict", {
      symbol: symbol
    });

    return {
      symbol: response.data.stock,
      timeframe,
      direction: response.data.signal,
      confidence: response.data.confidence,
      price: response.data.price,
      stop_loss: response.data.stop_loss,
      target: response.data.target
    };

  } catch (error) {
    console.error("AI API Error:", error.message);

    return {
      error: "AI service failed"
    };
  }
}