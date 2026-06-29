from fastapi import FastAPI
from pydantic import BaseModel
from predict import run_prediction   # ✅ use your function

app = FastAPI()

class RequestData(BaseModel):
    symbol: str

@app.post("/predict")
def predict(data: RequestData):
    result = run_prediction(data.symbol)
    return result