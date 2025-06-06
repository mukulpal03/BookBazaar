import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  createReview,
  deleteReview,
  getAllReviews,
} from "../controllers/review.controllers.js";

const router = Router({ mergeParams: true });

router.use(isLoggedIn);

router
  .route("/")
  .get(asyncHandler(getAllReviews))
  .post(asyncHandler(createReview));

router.route("/:reviewId").delete(asyncHandler(deleteReview));

export default router;
