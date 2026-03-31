import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB ansluten');
  } catch (error) {
    logger.error('MongoDB anslutningsfel:', error.message);
  }
};

export default connectDB;