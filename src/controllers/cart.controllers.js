import {
  addToCartService,
  clearCartService,
  getUserCartService,
  removeFromCartService,
} from "../services/cart.service.js";
import { ApiResponse } from "../utils/apiRes.util.js";

const getCart = async (req, res) => {
  const userId = req.user._id;

  const cart = await getUserCartService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Fetched your cart successfully", cart));
};

const addToCart = async (req, res) => {
  const bookId = req.params.bookId;
  const { quantity } = req.body;
  const userId = req.user._id;

  const cart = await addToCartService(bookId, userId, quantity);

  return res
    .status(200)
    .json(new ApiResponse(200, "item added to cart successfully", cart));
};

const removeFromCart = async (req, res) => {
  const bookId = req.params.bookId;
  const userId = req.user._id;

  const cart = await removeFromCartService(bookId, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "item removed from cart successfully", cart));
};

const clearCart = async (req, res) => {
  const userId = req.user._id;

  const cart = await clearCartService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Cart is cleared successfully", cart));
};

export { getCart, addToCart, removeFromCart, clearCart };
