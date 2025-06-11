import {
  checkoutService,
  getAllOrdersService,
  getOrderByIdService,
} from "../services/order.service.js";
import { ApiResponse } from "../utils/apiRes.util.js";

const placeOrder = async (req, res) => {
  const userId = req.user._id;

  const order = await checkoutService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Order placed successfully", order));
};

const getOrders = async (req, res) => {
  const userId = req.user._id;

  const orders = await getAllOrdersService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Orders fetched successfully", orders));
};

const getOrderById = async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user._id;

  const order = await getOrderByIdService(orderId, userId);

  return res.status(200).json(new ApiResponse(200, "Order details", order));
};

export { placeOrder, getOrders, getOrderById };
