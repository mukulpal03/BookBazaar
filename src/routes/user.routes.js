import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  getUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(asyncHandler(registerUser));

router.route("/login").post(asyncHandler(loginUser));

router.route("/logout").post(isLoggedIn, asyncHandler(logoutUser));

router.route("/refresh-token").post(asyncHandler(refreshAccessToken));

router.route("/me").get(isLoggedIn, asyncHandler(getUser));

export default router;
