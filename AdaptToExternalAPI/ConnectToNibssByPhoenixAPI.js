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


