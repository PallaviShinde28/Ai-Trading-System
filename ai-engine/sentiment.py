from textblob import TextBlob
import sys
import json

def analyze_sentiment(text):
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity

    if polarity > 0:
        return "POSITIVE"
    elif polarity < 0:
        return "NEGATIVE"
    else:
        return "NEUTRAL"

if __name__ == "__main__":
    
    # ✅ SAFE INPUT HANDLING
    if len(sys.argv) > 1:
        news = sys.argv[1]
    else:
        news = "Crypto market is stable today"  # default fallback

    result = analyze_sentiment(news)

    print(json.dumps({
        "sentiment": result
    }))