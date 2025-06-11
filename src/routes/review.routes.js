import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  createReview,
  deleteReview,
  getAllReviews,
} from "../controllers/review.controllers.js";
import { validateApiKey } from "../middlewares/api-key.middleware.js";
import { validateData } from "../middlewares/validate.middleware.js";
import { reviewValidationSchema } from "../validators/review.validators.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(validateApiKey, asyncHandler(getAllReviews))
  .post(
    isLoggedIn,
    validateData(reviewValidationSchema),
    asyncHandler(createReview),
  );

router.route("/:reviewId").delete(isLoggedIn, asyncHandler(deleteReview));

export default router;
