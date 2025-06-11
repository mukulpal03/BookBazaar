import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { CreatePayment } from "../controllers/payment.controllers.js";

const router = Router();

router.use(isLoggedIn);

router.route("/create").post(asyncHandler(CreatePayment));

export default router;
