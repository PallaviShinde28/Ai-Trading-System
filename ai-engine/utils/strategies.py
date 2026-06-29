def trend_strategy(df):
    if df['Close'].iloc[-1] > df['ema'].iloc[-1]:
        return "BUY"
    else:
        return "SELL"


def mean_reversion(df):
    if df['rsi'].iloc[-1] < 30:
        return "BUY"
    elif df['rsi'].iloc[-1] > 70:
        return "SELL"
    return "HOLD"


def volatility_strategy(df):
    if df['macd'].iloc[-1] > df['macd_signal'].iloc[-1]:
        return "BUY"
    else:
        return "SELL"