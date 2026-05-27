// config/config.js
import dotenv from "dotenv";

dotenv.config();

export const Config = {
  port: process.env.PORT || 3000,

  mistral: {
    apiKey: process.env.MISTRAL_API_KEY
  },

  Agent: {
    baseUrl: process.env.AGENT_URL
  }
};