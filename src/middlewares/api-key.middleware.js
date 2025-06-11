import ApiKey from "../models/api-key.model.js";
import { ApiError } from "../utils/apiError.util.js";

const validateApiKey = async (req, res, next) => {
  try {
    const key = req.headers["x-api-key"];

    if (!key) {
      return next(new ApiError(404, "Api key is missing"));
    }

    const apiKey = await ApiKey({ key });

    if (!apiKey) {
      return next(new ApiError(403, "Invalid api key"));
    }

    next();
  } catch (error) {
    console.error(error.message);
    return next(new ApiError(500, error.message || "Internal server error"));
  }
};

export { validateApiKey };
