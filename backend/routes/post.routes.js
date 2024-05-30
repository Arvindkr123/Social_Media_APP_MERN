import { Router } from "express";
import {
  createPostController,
  getPostController,
  deletePostController,
  likeAndUnlikePostController,
  replyToPostController,
  getFeedPostController,
  getUserPostsController,
} from "../controllers/posts.controllers.js";
import protectRoutes from "../middlewares/protectRoutes.js";

const router = Router();

router.get("/user/:username", getUserPostsController);
// get the feed posts
router.get("/feed", protectRoutes, getFeedPostController);

router
  .route("/:postId")
  .get(getPostController)
  .delete(protectRoutes, deletePostController);

router.put("/like/:id", protectRoutes, likeAndUnlikePostController);
router.put("/reply/:id", protectRoutes, replyToPostController);
router.post("/create", protectRoutes, createPostController);
export default router;
