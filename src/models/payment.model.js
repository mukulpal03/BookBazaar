import mongoose from "mongoose";
import {
  AvailablePaymentStatus,
  paymentStatusEnum,
} from "../utils/constant.util.js";

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  status: {
    type: String,
    enum: AvailablePaymentStatus,
    default: paymentStatusEnum.PENDING,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
