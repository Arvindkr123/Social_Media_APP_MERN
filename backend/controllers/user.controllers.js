import UserModel from "../models/user.models.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import e from "express";
import PostModel from "../models/post.models.js";

export const signupUserController = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
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
      res.status(400).json({ error: "inavalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username: username });
    const isCorrectPassword = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isCorrectPassword) {
      return res.status(401).json({ error: "Invalid password and username" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });

    res.status(200).json({ message: "user logout successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const followUserController = async (req, res) => {
  try {
    const { id } = req.params;
    // find that user which you want to follow
    const userToModify = await UserModel.findById(id);
    // now get the current user
    const currentUser = await UserModel.findById(req.user._id);

    // if id and current user same then you can not follow / unfollow yourself

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "you can not follow / unfollow yourself" });
    }

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "user not found!" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // unfollow user
      await UserModel.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      await UserModel.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      res.status(200).json({ message: "unfollowed user successfully" });
    } else {
      // follow the user
      await UserModel.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      await UserModel.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      res.status(200).json({ message: "followed user successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserController = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let user = await UserModel.findById(userId);
    if (req.params.id !== userId.toString()) {
      return res
        .status(400)
        .json({ error: "you can not update other user profile" });
    }
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      user.password = hashPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user = await user.save();
    // password should be null in response

    // find all posts that this user replied and update username and profilePic fields
    await PostModel.updateMany(
      { "replies.userId": user._id },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": user._id }] }
    );

    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfileController = async (req, res) => {
  // get the user with help of user id or username
  // query is either username or userId
  const { query } = req.params;
  // console.log(username);

  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await UserModel.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await UserModel.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
