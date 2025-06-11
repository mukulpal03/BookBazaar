import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT ?? 3000,
  BASE_URL: process.env.BASE_URL ?? "http://localhost:3000/api/v1",
  MONGO_URI: process.env.MONGO_URI ?? "mongodb://localhost:27017/bookbazaar",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY ?? "15m",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY ?? "7d",
  MAILTRAP_HOST: process.env.MAILTRAP_HOST,
  MAILTRAP_USER: process.env.MAILTRAP_USER,
  MAILTRAP_PASSWORD: process.env.MAILTRAP_PASSWORD,
  MAILTRAP_SENDEREMAIL: process.env.MAILTRAP_SENDEREMAIL,
  MAILTRAP_PORT: process.env.MAILTRAP_PORT,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};

export { config };
