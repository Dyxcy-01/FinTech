const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// create an axios instance for NibssByPhoenix API
const nibssClient = axios.create({
  baseURL: `${process.env.NIBSS_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// get authentication token from NibssByPhoenix API
module.exports.getAuthToken = async function () {
  try {
    // const url = `${process.env.NIBSS_BASE_URL}/api/account/create`;
    // console.log("Requesting:", url);

    const response = await nibssClient.post("/api/auth/token", {
      apiKey: process.env.NIBSS_API_KEY,
      apiSecret: process.env.NIBSS_API_SECRET,
    });

      return response.data.token;
      
  } catch (error) {
    console.log("Error getting auth token from NibssByPhoenix API:", error);
    throw new Error("Failed to get auth token from NibssByPhoenix API");
  }
};

module.exports.nibssClient = nibssClient;