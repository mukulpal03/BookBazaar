import Book from "../models/book.model.js";
import { ApiError } from "../utils/apiError.util.js";
import { getCartService } from "./cart.service.js";
import Order from "../models/order.model.js";
import mongoose from "mongoose";

const createOrderService = async (userId) => {
  try {
    const cart = await getCartService(userId);

    if (cart.length === 0) {
      throw new ApiError(400, "The cart is empty");
    }

    const bookIds = cart.map((item) => item.bookId);

    const books = await Book.find({ _id: { $in: bookIds } });

    for (let item of cart) {
      const book = books.find(
        (book) => book._id.toString() === item.bookId.toString(),
      );

      if (!book) {
        throw new ApiError(404, `Book with ID ${item.bookId} not found`);
      }

      if (item.quantity > book.stock) {
        throw new ApiError(
          400,
          `Only ${book.stock} left in stock for ${book.title}`,
        );
      }
    }

    const totalAmount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const orderItems = cart.map((item) => {
      return {
        book: item.bookId,
        quantity: item.quantity,
        title: item.title,
        author: item.author,
        price: item.price,
      };
    });

    const order = await Order.create({
      user: userId,
      orderItems,
      totalAmount,
    });

    return order;
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const getAllOrdersService = async (userId) => {
  try {
    const orders = await Order.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$user" },

      { $unwind: "$orderItems" },

      {
        $lookup: {
          from: "books",
          localField: "orderItems.book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },

      { $unwind: "$bookDetails" },

      {
        $group: {
          _id: "$_id",
          status: { $first: "$status" },
          totalAmount: { $first: "$totalAmount" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          user: { $first: "$user" },
          items: {
            $push: {
              quantity: "$orderItems.quantity",
              book: {
                title: "$bookDetails.title",
                author: "$bookDetails.author",
                price: "$bookDetails.price",
              },
            },
          },
        },
      },

      {
        $project: {
          _id: 1,
          status: 1,
          totalAmount: 1,
          createdAt: 1,
          updatedAt: 1,
          "user.email": 1,
          "user.username": 1,
          items: 1,
        },
      },
    ]);

    return orders;
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const getOrderByIdService = async (orderId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order id");
  }

  try {
    const order = await Order.findOne({ _id: orderId }).populate(
      "user",
      "username email",
    );

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.user._id.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not allowed to view this resource");
    }

    return order;
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

export { createOrderService, getAllOrdersService, getOrderByIdService };
