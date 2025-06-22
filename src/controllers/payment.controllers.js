import { config } from "../config/env.js";
import { razorpayInstance } from "../lib/razorpay.js";
import {
  createPayment,
  validateOrder,
  verifyPaymentAndUpdateOrderStatus,
} from "../services/payment.service.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiRes.util.js";
import { orderConfirmationMailContent, sendMail } from "../utils/mail.util.js";

const CreatePayment = async (req, res) => {
  const { orderId } = req.body;
  const userId = req.user._id;

  const order = await validateOrder(orderId, userId);

  const razorpayOrder = await razorpayInstance.orders.create({
    amount: order.totalAmount * 100,
    currency: "INR",
    receipt: `receipt_order_${order._id}`,
    notes: {
      userId: req.user._id.toString(),
      orderId: order._id.toString(),
    },
  });

  await createPayment(userId, orderId, razorpayOrder.id, order.totalAmount);

  return res.status(201).json(
    new ApiResponse(201, "Razorpay order created", {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    }),
  );
};

const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(400, "Missing Razorpay details");
  }

  const payment = await verifyPaymentAndUpdateOrderStatus(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  );

  await sendMail({
    mailGenContent: orderConfirmationMailContent(
      req.user.username,
      `${config.BASE_URL}/orders/${payment.order}`,
    ),
    email: req.user.email,
    subject: "Order Confirmation",
  });

  return res.status(200).json(
    new ApiResponse(200, "Payment verified successfully", {
      paymentId: payment._id,
    }),
  );
};

export { CreatePayment, verifyPayment };
