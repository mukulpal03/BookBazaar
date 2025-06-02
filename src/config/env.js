import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT ?? 3000,
  MONGO_URI: process.env.MONGO_URI ?? "mongodb://localhost:27017/bookbazaar",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY ?? "15m",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY ?? "7d",
};

export { config };
