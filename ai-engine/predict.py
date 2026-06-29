import random
import time

from data.fetch_data import get_crypto_data
from utils.indicators import add_indicators
from utils.market_type import detect_market
from utils.strategies import trend_strategy, mean_reversion, volatility_strategy


def run_prediction(symbol="BTC-USD"):
    try:
        # STEP 1: Fetch data
        df = get_crypto_data(symbol)

        if df is None or df.empty:
            return {"error": "No data fetched"}

        time.sleep(0.3)

        # STEP 2: Indicators
        df = add_indicators(df)

        # STEP 3: Market type
        market = detect_market(df)

        # STEP 4: Strategy
        if market == "trending":
            signal = trend_strategy(df)
        elif market == "sideways":
            signal = mean_reversion(df)
        else:
            signal = volatility_strategy(df)

        # STEP 5: Confidence
        base_confidence = 0.5

        rsi = df['rsi'].iloc[-1]
        macd = df['macd'].iloc[-1]
        signal_line = df['macd_signal'].iloc[-1]

        if signal == "BUY":
            if rsi < 35:
                base_confidence += 0.2
            if macd > signal_line:
                base_confidence += 0.2

        elif signal == "SELL":
            if rsi > 65:
                base_confidence += 0.2
            if macd < signal_line:
                base_confidence += 0.2

        noise = random.uniform(-0.05, 0.1)
        confidence = min(max(base_confidence + noise, 0.4), 0.95)

        # STEP 6: REAL PRICE (FIXED)
        price = round(float(df['Close'].iloc[-1]), 2)

        # STEP 7: STOP LOSS + TARGET
        risk_percent = 0.02
        reward_percent = 0.04

        if signal == "BUY":
            stop_loss = round(price * (1 - risk_percent), 2)
            target = round(price * (1 + reward_percent), 2)

        elif signal == "SELL":
            stop_loss = round(price * (1 + risk_percent), 2)
            target = round(price * (1 - reward_percent), 2)

        else:
            stop_loss = price
            target = price

        # FINAL OUTPUT
        return {
            "stock": symbol,
            "market_type": market,
            "signal": signal,
            "confidence": round(confidence, 2),
            "price": price,
            "stop_loss": stop_loss,
            "target": target
        }

    except Exception as e:
        return {"error": str(e)}


import sys
import json

if __name__ == "__main__":
    symbol = "BTC-USD"

    if len(sys.argv) > 1:
        symbol = sys.argv[1]

    result = run_prediction(symbol)

    print(json.dumps(result))

# i changed this whole code 

# import time
# import numpy as np

# from tensorflow.keras.models import load_model
# import joblib

# from data.fetch_data import get_crypto_data
# from utils.indicators import add_indicators
# from utils.market_type import detect_market
# from utils.strategies import trend_strategy, mean_reversion, volatility_strategy


# # ✅ Load AI model (LSTM)
# model = load_model("model/lstm_model.h5")
# scaler = joblib.load("model/scaler.save")


# def run_prediction(symbol="BTC-USD"):
#     try:
#         # STEP 1: Fetch data
#         df = get_crypto_data(symbol)

#         if df is None or df.empty:
#             return {"error": "No data fetched"}

#         time.sleep(0.3)

#         # STEP 2: Indicators
#         df = add_indicators(df)

#         # ✅ NEW: EMA (for trend detection)
#         df['ema_20'] = df['Close'].ewm(span=20).mean()
#         df['ema_50'] = df['Close'].ewm(span=50).mean()

#         # STEP 3: Market type
#         market = detect_market(df)

#         # STEP 4: Strategy
#         if market == "trending":
#             signal = trend_strategy(df)
#         elif market == "sideways":
#             signal = mean_reversion(df)
#         else:
#             signal = volatility_strategy(df)

#         # STEP 5: Indicators for logic
#         rsi = df['rsi'].iloc[-1]
#         macd = df['macd'].iloc[-1]
#         signal_line = df['macd_signal'].iloc[-1]

#         # ✅ NEW: TREND DETECTION
#         if df['ema_20'].iloc[-1] > df['ema_50'].iloc[-1]:
#             trend = "UPTREND"
#         else:
#             trend = "DOWNTREND"

#         # ✅ NEW: LOGIC-BASED CONFIDENCE (NO RANDOM ❌)
#         confidence = 0.5

#         if abs(macd - signal_line) > 10:
#             confidence += 0.2

#         if (signal == "BUY" and rsi < 40) or (signal == "SELL" and rsi > 60):
#             confidence += 0.2

#         confidence = min(confidence, 0.95)

#         # STEP 6: REAL PRICE
#         price = round(float(df['Close'].iloc[-1]), 2)

#         # STEP 7: STOP LOSS + TARGET
#         risk_percent = 0.02
#         reward_percent = 0.04

#         if signal == "BUY":
#             stop_loss = round(price * (1 - risk_percent), 2)
#             target = round(price * (1 + reward_percent), 2)

#         elif signal == "SELL":
#             stop_loss = round(price * (1 + risk_percent), 2)
#             target = round(price * (1 - reward_percent), 2)

#         else:
#             stop_loss = price
#             target = price

#         # ✅ NEW: LSTM PRICE PREDICTION
#         try:
#             last_data = df[['Close']].tail(60)

#             scaled = scaler.transform(last_data)
#             X = np.array([scaled])

#             predicted_price = model.predict(X)[0][0]
#             predicted_price = scaler.inverse_transform([[predicted_price]])[0][0]

#         except:
#             predicted_price = price  # fallback

#         # ✅ NEW: PRICE CHANGE %
#         price_change = ((predicted_price - price) / price) * 100

#         # ✅ NEW: REASON (Explain AI)
#         reason = []

#         if rsi < 30:
#             reason.append("Oversold (RSI)")
#         if rsi > 70:
#             reason.append("Overbought (RSI)")
#         if macd > signal_line:
#             reason.append("Bullish MACD crossover")
#         if macd < signal_line:
#             reason.append("Bearish MACD crossover")

#         reason_text = ", ".join(reason)

#         # FINAL OUTPUT (UPGRADED 🚀)
#         return {
#             "stock": symbol,
#             "market_type": market,
#             "signal": signal,
#             "confidence": round(confidence, 2),

#             "price": price,
#             "predicted_price": round(predicted_price, 2),
#             "price_change": round(price_change, 2),

#             "stop_loss": stop_loss,
#             "target": target,

#             "trend": trend,
#             "trend_strength": round(abs(macd - signal_line), 2),
#             "rsi": round(rsi, 2),

#             "timeframe": "short-term",
#             "risk_level": "LOW" if confidence > 0.75 else "MEDIUM" if confidence > 0.6 else "HIGH",

#             "reason": reason_text
#         }

#     except Exception as e:
#         return {"error": str(e)}


# # CLI SUPPORT
# import sys
# import json

# if __name__ == "__main__":
#     symbol = "BTC-USD"

#     if len(sys.argv) > 1:
#         symbol = sys.argv[1]

#     result = run_prediction(symbol)

#     print(json.dumps(result))