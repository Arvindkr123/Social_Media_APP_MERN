import PostModel from "../models/post.models.js";
import UserModel from "../models/user.models.js";

export const createPostController = async (req, res, next) => {
  const { postedBy, text, img } = req.body;
  try {
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "PostBy and Text field is required" });
    }

    const user = await UserModel.findById(postedBy);

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: "unAuthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ message: `Text must be less than ${maxLength} characters` });
    }

    const newPost = new PostModel({ postedBy, text, img });
    await newPost.save();
    res
      .status(200)
      .json({ message: `Post created successfully`, newPost: newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostController = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ message: "not authorized to delete this post" });
    }

    await PostModel.findByIdAndDelete(req.params.postId);

    res.status(200).json({ msg: "Post deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const likeAndUnlikePostController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await PostModel.findById(postId);
    //console.log(post.likes.includes(userId));

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
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
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
