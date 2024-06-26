import PostModel from "../models/post.models.js";
import UserModel from "../models/user.models.js";
import { v2 as cloudinary } from "cloudinary";

export const getUserPostsController = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await PostModel.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPostController = async (req, res, next) => {
  const { postedBy, text } = req.body;
  let { img } = req.body;
  try {
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "PostBy and Text field is required" });
    }

    const user = await UserModel.findById(postedBy);

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "unAuthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new PostModel({ postedBy, text, img });
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostController = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ error: "not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await PostModel.findByIdAndDelete(req.params.postId);

    res.status(200).json({ msg: "Post deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likeAndUnlikePostController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await PostModel.findById(postId);
    //console.log(post.likes.includes(userId));

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      // if user already liked post then unlike the post
      await PostModel.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ msg: "Post unliked successfully" });
    } else {
      // await PostModel.updateOne({ _id: postId }, { $push: { likes: userId } });
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ msg: "Post liked successfully" });
      // if user not liked post then like the post
    }

    //res.status(200).json({ msg: "Post deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const replyToPostController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;
    const userProfilePic = req.user.profilePic;
    console.log("from reply controller ", req.user);
    console.log("from reply controller ", userProfilePic);
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text Field is required!" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);
    await post.save();
    res.status(200).json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFeedPostController = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(500).json({ error: "User not found!" });
    }
    const following = user.following;
    const feedPosts = await PostModel.find({
      postedBy: { $in: following },
    }).sort({ createdAt: -1 });
    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
