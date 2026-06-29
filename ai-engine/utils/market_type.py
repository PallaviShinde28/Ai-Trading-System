def detect_market(df):
    volatility = df['Close'].pct_change().std()

    if volatility > 0.03:   # higher threshold for crypto
        return "volatile"
    elif df['Close'].iloc[-1] > df['ema'].iloc[-1]:
        return "trending"
    else:
        return "sideways"