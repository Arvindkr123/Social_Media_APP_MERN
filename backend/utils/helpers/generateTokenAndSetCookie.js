import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.js";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15d" });
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });
  return token;
};
export default generateTokenAndSetCookie;
