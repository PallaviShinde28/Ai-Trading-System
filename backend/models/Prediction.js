import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  symbol: String,
  signal: String,
  confidence: Number,
  price: Number,
  stop_loss: Number,
  target: Number,
  market_type: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Prediction", predictionSchema);