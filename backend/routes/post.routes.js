import { Router } from "express";
import {
  createPostController,
  getPostController,
  deletePostController,
  likeAndUnlikePostController,
} from "../controllers/posts.controllers.js";
import protectRoutes from "../middlewares/protectRoutes.js";

const router = Router();
router
  .route("/:postId")
  .get(getPostController)
  .delete(protectRoutes, deletePostController);

router.post("/like/:id", protectRoutes, likeAndUnlikePostController);
router.post("/create", protectRoutes, createPostController);
export default router;
