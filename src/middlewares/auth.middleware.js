import { config } from "../config/env.js";
import { ApiError } from "../utils/apiError.util.js";
import jwt from "jsonwebtoken";

const isLoggedIn = async (req, _res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ??
      req.headers["Authorization"]?.replace("Bearer ", "");

    if (!accessToken) {
      return next(new ApiError(401, "Unauthorized request"));
    }

    const decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error.message);
    return next(new ApiError(500, error.message));
  }
};

export { isLoggedIn };
