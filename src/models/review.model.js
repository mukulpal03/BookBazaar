import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
