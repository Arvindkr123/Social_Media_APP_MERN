import express from "express";
import { PORT } from "./config/config.js";
import connectDB from "./db/connectDB.js";

const app = express();
connectDB();

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
