import subprocess
import json
import sys

# Coin → News Mapping
crypto_news = {
    "Bitcoin": "Bitcoin sees strong institutional inflows and ETF growth",
    "Ethereum": "Ethereum upgrades improve scalability and adoption",
    "Solana": "Solana ecosystem growing with NFTs and DeFi",
    "BNB": "Binance faces regulatory scrutiny",
    "Ripple": "Ripple gains positive traction in SEC case",
    "Cardano": "Cardano development steady but slow",
    "Dogecoin": "Dogecoin driven by social media hype",
    "Avalanche": "Avalanche adoption rises in enterprise use",
    "Polkadot": "Polkadot innovation continues but low attention",
    "Litecoin": "Litecoin stable but limited innovation"
}

if __name__ == "__main__":
    # Get coin from command line
    if len(sys.argv) > 1:
        coin = sys.argv[1]
    else:
        coin = "Bitcoin"

    news = crypto_news.get(coin, "Crypto market is stable")

    # Call sentiment.py
    result = subprocess.run(
        ["python", "sentiment.py", news],
        capture_output=True,
        text=True
    )

    output = json.loads(result.stdout)

    print(json.dumps({
        "coin": coin,
        "sentiment": output["sentiment"]
    }))