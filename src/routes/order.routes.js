import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  getOrderById,
  getOrders,
  placeOrder,
} from "../controllers/order.controllers.js";
import { validateApiKey } from "../middlewares/api-key.middleware.js";

const router = Router();

router.use(isLoggedIn);
router.use(validateApiKey);

router.route("/").post(asyncHandler(placeOrder)).get(asyncHandler(getOrders));

router.route("/:orderId").get(asyncHandler(getOrderById));

export default router;
