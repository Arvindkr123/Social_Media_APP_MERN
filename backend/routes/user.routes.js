import { Router } from "express";
import {
  signupUserController,
  loginUserController,
} from "../controllers/user.controllers.js";
const router = Router();

router.post("/signup", signupUserController);
router.post("/login", loginUserController);

export default router;
