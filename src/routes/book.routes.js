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
import { validateApiKey } from "../middlewares/api-key.middleware.js";
import { validateData } from "../middlewares/validate.middleware.js";
import { bookValidationSchema } from "../validators/book.validators.js";

const router = Router();

router
  .route("/")
  .get(validateApiKey, asyncHandler(getAllBooks))
  .post(
    isLoggedIn,
    authorizeRoles([userRoleEnum.ADMIN]),
    validateData(bookValidationSchema),
    asyncHandler(createBook),
  );

router
  .route("/:id")
  .get(validateApiKey, asyncHandler(getBookById))
  .put(
    isLoggedIn,
    authorizeRoles([userRoleEnum.ADMIN]),
    validateData(bookValidationSchema),
    asyncHandler(updateBook),
  )
  .delete(
    isLoggedIn,
    authorizeRoles([userRoleEnum.ADMIN]),
    asyncHandler(deleteBook),
  );

export default router;
