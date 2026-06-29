import axios from "axios";

const API_URL = "http://127.0.0.1:5001/api/ai/predict";

export async function fetchPrediction(symbol) {
  const response = await axios.get(`${API_URL}/${symbol}`);
  return response.data;
}