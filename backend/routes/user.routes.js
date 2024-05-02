import { Router } from "express";
import {
  signupUserController,
  loginUserController,
  logoutUserController,
  followUserController,
  updateUserController,
  getUserProfileController,
} from "../controllers/user.controllers.js";
import protectRoutes from "../middlewares/protectRoutes.js";
const router = Router();

router.post("/signup", signupUserController);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);

// get user profile
router.get("/profile/:username", getUserProfileController);

// follow user
router.post("/follow/:id", protectRoutes, followUserController);

// update user profile
router.put("/update/:id", protectRoutes, updateUserController);

export default router;
