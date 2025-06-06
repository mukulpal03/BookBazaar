import {
  createReviewService,
  deleteReviewService,
  getReviewsService,
} from "../services/review.service.js";
import { ApiResponse } from "../utils/apiRes.util.js";

const createReview = async (req, res) => {
  const userId = req.user._id;
  const bookId = req.params.bookId;
  const reviewData = req.body;

  const { review } = await createReviewService(reviewData, userId, bookId);

  return res
    .status(201)
    .json(new ApiResponse(201, "Review created successfully", review));
};

const getAllReviews = async (req, res) => {
  const bookId = req.params.bookId;

  const { reviews } = await getReviewsService(bookId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Reviews fetched successfully", reviews));
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user._id;

  await deleteReviewService(reviewId, userId);

  return res.status(204).send();
};

export { createReview, getAllReviews, deleteReview };
