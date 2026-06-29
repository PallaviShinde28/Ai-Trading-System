import axios from "axios";

const getStockNews = async (query) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`
    );
    console.log("API KEY:", process.env.NEWS_API_KEY);
    console.log("Query:", query);
    console.log("Articles:", response.data.articles);
    return response.data.articles.slice(0, 5);
  } catch (error) {
    console.error("Error fetching news:", error.message);
    return [];
  }
};

export default getStockNews;