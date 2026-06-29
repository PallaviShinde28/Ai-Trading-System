export const getSentiment = async (coin) => {
  try {
    const response = await fetch("http://localhost:5000/sentiment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ coin })
    });

    const data = await response.json();
    return data.sentiment;
  } catch (error) {
    console.error(error);
    return "NEUTRAL";
  }
};