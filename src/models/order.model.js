import mongoose from "mongoose";
import { AvailableOrderStatus, orderStatusEnum } from "../utils/constant.util.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        title: {
          type: String,
          trim: true,
          required: true,
        },
        author: {
          type: String,
          trim: true,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: AvailableOrderStatus,
      default: orderStatusEnum.PENDING,
    },
    totalAmount: {
      type: Number,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
