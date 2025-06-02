import { config } from "../config/env.js";
import {
  createUser,
  findUserById,
  generateAccessAndRefreshToken,
  inValidateTokenInDB,
  validateUserCredentials,
} from "../services/user.services.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiRes.util.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const userData = req.body;

  const { user, accessToken, refreshToken } = await createUser(userData);

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  };

  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(201, "User registered successfully", {
        _id: user._id,
        username: user.username,
        email: user.email,
      }),
    );
};

const loginUser = async (req, res) => {
  const userData = req.body;

  const { user, accessToken, refreshToken } =
    await validateUserCredentials(userData);

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(201, "User Logged In successfully", {
        _id: user._id,
        username: user.username,
        email: user.email,
      }),
    );
};

const logoutUser = async (req, res) => {
  const userId = req.user._id;

  await inValidateTokenInDB(userId);

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  };

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, "User logged out successfully"));
};

const refreshAccessToken = async (req, _res) => {
  const refreshToken =
    req.cookies?.refreshToken ??
    req.headers["Authorization"]?.replace("Bearer ", "");

  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);

  const user = await findUserById(decoded._id);

  if (!user) {
    throw new ApiError(401, "Invalid token or expired token");
  }

  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid token or expired token");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  };

  _res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(new ApiResponse(200, "Access token refreshed successfully"));
};

const getUser = async (req, res) => {
  const userId = req.user._id;

  const user = await findUserById(userId);

  res.status(200).json(
    new ApiResponse(200, `Welcome, ${user.username}`, {
      _id: user._id,
      username: user.username,
      email: user.email,
    }),
  );
};

export { registerUser, loginUser, logoutUser, refreshAccessToken, getUser };
