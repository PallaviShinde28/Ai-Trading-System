import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true
  },

  symbol: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ["BUY", "SELL"],
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Trade", TradeSchema);