import { ApiError } from "../utils/apiError.util.js";

const validateData = (schema) => {
  return (req, _res, next) => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      return next(
        new ApiError(
          422,
          "Invalid data",
          validationResult.error.flatten().fieldErrors,
        ),
      );
    }

    req.body = validationResult.data;
    next();
  };
};

export { validateData };
