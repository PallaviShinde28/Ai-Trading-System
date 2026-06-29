import yfinance as yf
import pandas as pd
import numpy as np
import ta
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import joblib

# Download data
df = yf.download("BTC-USD", period="180d", interval="1h")

# 🔥 FIX MULTI-INDEX (IMPORTANT)
if isinstance(df.columns, pd.MultiIndex):
    df.columns = df.columns.get_level_values(0)

# Ensure Close is 1D
df["Close"] = df["Close"].astype(float)


# INDICATORS


df["RSI"] = ta.momentum.RSIIndicator(close=df["Close"]).rsi()
df["EMA9"] = ta.trend.EMAIndicator(close=df["Close"], window=9).ema_indicator()
df["EMA21"] = ta.trend.EMAIndicator(close=df["Close"], window=21).ema_indicator()
df["MACD"] = ta.trend.MACD(close=df["Close"]).macd()

df = df.dropna()


# FEATURE SELECTION


features = df[["Close", "RSI", "EMA9", "EMA21", "MACD"]]

scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(features)

X = []
y = []

window = 24

for i in range(window, len(scaled_data)):
    X.append(scaled_data[i-window:i])
    y.append(scaled_data[i][0])  # predict close

X, y = np.array(X), np.array(y)


# LSTM MODEL


model = Sequential()
model.add(LSTM(64, return_sequences=True, input_shape=(X.shape[1], X.shape[2])))
model.add(LSTM(32))
model.add(Dense(1))

model.compile(optimizer="adam", loss="mse")

model.fit(X, y, epochs=5, batch_size=32)


# SAVE MODEL


import os
os.makedirs("model", exist_ok=True)

model.save("model/lstm_model.h5")
joblib.dump(scaler, "model/scaler.save")

print("Model Trained & Saved Successfully")