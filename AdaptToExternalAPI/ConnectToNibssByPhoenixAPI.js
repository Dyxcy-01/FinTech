const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// create an axios instance for NibssByPhoenix API
module.exports.nibssClient = axios.create({
  baseURL: `${process.env.NIBSS_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// get authentication token from NibssByPhoenix API
module.exports.getAuthToken = async function () {
  try {
    const response = await nibssClient.post("/api/auth/login", {
      apiKey: process.env.NIBSS_API_KEY,
      apiSecret: process.env.NIBSS_API_SECRET,
    });

      return response.data.token;
      
  } catch (error) {
    console.error(
      "Error getting auth token:",
      error.response ? error.response.data : error.message,
    );
    throw new Error("Failed to get auth token from NibssByPhoenix API");
  }
};
