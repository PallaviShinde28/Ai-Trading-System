

# app = Flask(__name__)
# CORS(app)   # ✅ IMPORTANT



from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import random

app = Flask(__name__)
CORS(app)   # ✅ Allow frontend requests

# ================= SENTIMENT API =================
@app.route('/sentiment', methods=['POST'])
def sentiment():
    try:
        coin = request.json.get("coin")

        result = subprocess.run(
            ["python", "crypto_sentiment_runner.py", coin],
            capture_output=True,
            text=True
        )

        output = json.loads(result.stdout)

        return jsonify(output)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })


# ================= AI PREDICTION API =================
@app.route("/api/ai/predict/<symbol>", methods=["GET"])
def predict(symbol):
    try:
        signals = ["BUY", "SELL", "HOLD"]

        data = {
            "stock": symbol,
            "signal": random.choice(signals),
            "confidence": random.randint(70, 95),
            "price": random.randint(60000, 70000),
            "market_type": "Bullish"
        }

        return jsonify({
            "success": True,
            "data": data
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })


# ================= HEALTH CHECK =================
@app.route("/")
def home():
    return "AI Server Running 🚀"


# ================= RUN SERVER =================
if __name__ == "__main__":
    app.run(port=5001, debug=False, use_reloader=False)