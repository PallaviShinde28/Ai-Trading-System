from predict import run_prediction

# Crypto list
cryptos = [
    "BTC-USD",
    "ETH-USD",
    "SOL-USD"
]

def scan_market():
    results = []

    for crypto in cryptos:
        try:
            result = run_prediction(crypto)
            results.append(result)
        except Exception as e:
            print(f"Error with {crypto}: {e}")

    return results


if __name__ == "__main__":
    data = scan_market()

    # Filter BUY signals
    buy_signals = [r for r in data if r['signal'] == "BUY"]

    # Sort by confidence
    buy_signals.sort(key=lambda x: x['confidence'], reverse=True)

    print("\n🔥 BEST CRYPTO TRADES:")
    for trade in buy_signals:
        print(trade)