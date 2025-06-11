import Book from "../models/book.model.js";
import { ApiError } from "../utils/apiError.util.js";
import mongoose from "mongoose";
import { paginationOptions } from "../utils/constant.util.js";

const createBookService = async (BookData) => {
  try {
    const { isbn } = BookData;

    const existingBook = await Book.findOne({ isbn });

    if (existingBook) {
      throw new ApiError(400, "Book already exists");
    }

    const book = await Book.create(BookData);
    return { book };
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const getAllBooksService = async (page, limit) => {
  try {
    const bookAggregate = Book.aggregate([{ $match: {} }]);

    const books = await Book.aggregatePaginate(
      bookAggregate,
      paginationOptions({
        page,
        limit,
        customLabels: {
          docs: "books",
          totalDocs: "totalBooks",
        },
      }),
    );

    return { books };
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const getBookByIdService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid book id");
  }

  try {
    const book = await Book.findById(id);

    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    return { book };
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const updateBookService = async (id, BookData) => {
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid book id");
    }

    const book = await Book.findByIdAndUpdate(id, BookData, { new: true });

    return { book };
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const deleteBookService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid book id");
  }

  try {
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      throw new ApiError(404, "Book not found");
    }
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

export {
  createBookService,
  getAllBooksService,
  getBookByIdService,
  updateBookService,
  deleteBookService,
};
