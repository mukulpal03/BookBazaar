import { ApiError } from "../utils/apiError.util.js";

const authorizeRoles = (roles) => {
  return (req, _res, next) => {
    const { role } = req.user;

    if (roles.includes(role)) {
      return next();
    }

    return next(new ApiError(401, "You don't have the permission"));
  };
};

export { authorizeRoles };
