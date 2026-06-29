import yfinance as yf

def get_crypto_data(symbol="BTC-USD", period="7d", interval="15m"):
    df = yf.download(symbol, period=period, interval=interval)

    # Fix column issues
    if hasattr(df.columns, "levels"):
        df.columns = df.columns.get_level_values(0)

    df = df[['Open', 'High', 'Low', 'Close', 'Volume']]
    df['Close'] = df['Close'].astype(float)

    df.dropna(inplace=True)
    return df