import dotenv from "dotenv";
dotenv.config();

export const {
  PORT,
  MONGO_URL,
  JWT_SECRET,
  CLOUDNARY_CLOUD_NAME,
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
} = process.env;
