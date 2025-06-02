import mongoose from "mongoose";
import { config } from "../config/env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log(`DB connected`);
  } catch (error) {
    console.error("DB connection failed");
    process.exit(1);
  }
};

export default connectDB;
