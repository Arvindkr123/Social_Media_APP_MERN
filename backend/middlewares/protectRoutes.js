import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
import UserModel from "../models/user.models.js";
const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decodedToken.userId).select(
      "-password"
    );
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default protectRoutes;
