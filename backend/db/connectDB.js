import mongoose from "mongoose";
import { MONGO_URL } from "../config/config.js";
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URL, {
      // to avoid warnings in the console
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected : ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
