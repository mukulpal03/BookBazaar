import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.util.js";
import Order from "../models/order.model.js";
import { orderStatusEnum, paymentStatusEnum } from "../utils/constant.util.js";
import Payment from "../models/payment.model.js";
import { config } from "../config/env.js";

const validateOrder = async (orderId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order id");
  }

  try {
    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.status !== orderStatusEnum.PENDING) {
      throw new ApiError(400, "Order is already paid");
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

const createPayment = async (userId, orderId, razorpayOrderId, amount) => {
  try {
    await Payment.create({
      order: orderId,
      user: userId,
      amount,
      razorpayOrderId,
      status: paymentStatusEnum.PENDING,
    });
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const verifyPaymentAndUpdateOrderStatus = async (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
) => {
  const generatedSignature = crypto
    .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const isValid = generatedSignature === razorpaySignature;

  if (!isValid) {
    throw new ApiError(400, "Invalid payment signature");
  }

  try {
    const payment = await Payment.findOne({ razorpayOrderId });

    if (!payment) {
      throw new ApiError(404, "Payment record not found");
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = paymentStatusEnum.SUCCESS;
    await payment.save();

    await Order.findByIdAndUpdate(payment.order, {
      status: orderStatusEnum.PAID,
    });

    return payment;
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

export { validateOrder, createPayment, verifyPaymentAndUpdateOrderStatus };
