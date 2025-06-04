import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/book.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(isLoggedIn);

router.route("/").get(asyncHandler(getAllBooks)).post(asyncHandler(createBook));

router
  .route("/:id")
  .get(asyncHandler(getBookById))
  .put(asyncHandler(updateBook))
  .delete(asyncHandler(deleteBook));

export default router;
