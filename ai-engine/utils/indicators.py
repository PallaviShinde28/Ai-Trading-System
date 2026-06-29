import ta

def add_indicators(df):
    close = df['Close'].squeeze()  # 🔥 FIX → converts to 1D

    df['rsi'] = ta.momentum.RSIIndicator(close).rsi()

    macd = ta.trend.MACD(close)
    df['macd'] = macd.macd()
    df['macd_signal'] = macd.macd_signal()

    df['ema'] = ta.trend.EMAIndicator(close, window=20).ema_indicator()

    df.dropna(inplace=True)
    return df