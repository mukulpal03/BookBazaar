import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import { ApiError } from "../utils/apiError.util.js";
import Book from "../models/book.model.js";

const getCartService = async (userId) => {
  const cart = await Cart.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$items",
    },
  ]);

  return cart;
};

const addToCartService = async (bookId, userId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new ApiError(400, "Invalid book id");
  }

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      throw new ApiError(404, "The book you are trying to add doesn't exist");
    }

    const cart = await Cart.findOneAndUpdate(
      { owner: userId },
      {
        $setOnInsert: {
          items: [],
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    const bookInCart = cart.items.find(
      (item) => item.book.toString() === bookId.toString(),
    );

    if (!bookInCart) {
      if (quantity > book.stock) {
        throw new ApiError(400, "Quantity is larger than the stock");
      }
      cart.items.push({ book: bookId, quantity });
    } else {
      const totalQuantity = bookInCart.quantity + quantity;
      if (totalQuantity > book.stock) {
        throw new ApiError(400, "Quantity is larger than the stock");
      }
      bookInCart.quantity += quantity;
    }

    await cart.save();

    return cart;
  } catch (error) {
    console.error(error.message);
    throw new ApiError(error.statusCode, error.message);
  }
};

const removeFromCartService = async (bookId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new ApiError(400, "Invalid book id");
  }

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      throw new ApiError(404, "Book does not exist");
    }

    const cart = await Cart.findOne({ owner: userId });

    if (!cart) {
      throw new ApiError(400, "There are no items in the cart yet");
    }

    const bookInCart = cart.items.find(
      (item) => item.book.toString() === bookId.toString(),
    );

    if (!bookInCart) {
      throw new ApiError(404, "Book does not exist in the cart");
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        $pull: {
          items: { book: bookId },
        },
      },
      { new: true },
    );

    return updatedCart;
  } catch (error) {
    console.error(error.message);
    throw new ApiError(error.statusCode, error.message);
  }
};

const clearCartService = async (userId) => {
  try {
    const cart = await Cart.findOne({ owner: userId });

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "cart is already empty");
    }

    cart.items = [];

    await cart.save();

    return cart;
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

export {
  getUserCartService,
  addToCartService,
  removeFromCartService,
  clearCartService,
};
