import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  CreatePayment,
  verifyPayment,
} from "../controllers/payment.controllers.js";
import { validateApiKey } from "../middlewares/api-key.middleware.js";

const router = Router();

router.use(isLoggedIn);

router.use(validateApiKey);

router.route("/create").post(asyncHandler(CreatePayment));

router.route("/verify").post(asyncHandler(verifyPayment));

export default router;
