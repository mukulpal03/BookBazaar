import mongoose from "mongoose";
import { AvailableBooksGenre } from "../utils/constant.util.js";
import Review from "./review.model.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
      enum: {
        values: AvailableBooksGenre,
        message: "Invalid genre",
      },
    },
    isbn: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

bookSchema.plugin(mongooseAggregatePaginate);

bookSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ book: doc._id });
  }
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
