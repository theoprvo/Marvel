const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300 });

const fetchMarvelAPI = async (cacheKey, url) => {
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const response = await axios.get(url);

  cache.set(cacheKey, response.data.data);

  return response.data.data;
};

module.exports = fetchMarvelAPI;
