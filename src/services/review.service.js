import mongoose from "mongoose";
import Review from "../models/review.model.js";
import { ApiError } from "../utils/apiError.util.js";
import { getBookByIdService } from "./book.service.js";

const createReviewService = async (reviewData, userId, bookId) => {
  try {
    await getBookByIdService(bookId);

    const review = new Review({
      owner: userId,
      book: bookId,
      ...reviewData,
    });

    await review.save();

    await review.populate(
      ["owner", "book"],
      ["username", "email", "title", "author", "description"],
    );

    if (!review) {
      throw new ApiError(500, "Error while creating a review");
    }

    return { review };
  } catch (error) {
    console.error(error.message);
    throw new ApiError(error.statusCode, error.message);
  }
};

const getReviewsService = async (bookId) => {
  try {
    const { book } = await getBookByIdService(bookId);

    const reviews = await Review.find({ book: book._id }).populate(
      ["owner", "book"],
      ["username", "email", "title", "author"],
    );

    return { reviews };
  } catch (error) {
    console.error(error.message);
    throw new ApiError(500, error.message);
  }
};

const deleteReviewService = async (reviewId, userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new ApiError(400, "Invalid review id");
    }

    const review = await Review.findById(reviewId);

    if (!review) throw new ApiError(404, "Review not found");

    if (review.owner.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not allowed to delete this review");
    }

    await Review.findByIdAndDelete(review._id);
  } catch (error) {
    console.error(error.message);
    throw new ApiError(error.statusCode, error.message);
  }
};

export { createReviewService, getReviewsService, deleteReviewService };
