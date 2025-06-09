import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controllers.js";

const router = Router();

router.use(isLoggedIn);

router.route("/").get(asyncHandler(getCart)).delete(asyncHandler(clearCart));

router
  .route("/:bookId")
  .post(asyncHandler(addToCart))
  .delete(asyncHandler(removeFromCart));

export default router;
