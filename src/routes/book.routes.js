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
import { userRoleEnum } from "../utils/constant.util.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";

const router = Router();

router.use(isLoggedIn);

router
  .route("/")
  .get(asyncHandler(getAllBooks))
  .post(authorizeRoles([userRoleEnum.ADMIN]), asyncHandler(createBook));

router
  .route("/:id")
  .get(asyncHandler(getBookById))
  .put(authorizeRoles([userRoleEnum.ADMIN]), asyncHandler(updateBook))
  .delete(authorizeRoles([userRoleEnum.ADMIN]), asyncHandler(deleteBook));

export default router;
