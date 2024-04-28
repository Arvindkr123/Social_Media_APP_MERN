import UserModel from "../models/user.models.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
export const signupUserController = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      name,
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      });
    } else {
      res.status(400).json({ message: "inavalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username: username });
    const isCorrectPassword = await bcrypt.compare(password, user?.password);
    if (!isCorrectPassword) {
      return res.status(401).json({ message: "Invalid password and username" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
