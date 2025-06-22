import ApiKey from "../models/api-key.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.util.js";
import crypto from "crypto";

async function generateAccessAndRefreshToken(userID) {
  try {
    const user = await User.findById(userID);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
}

const createUser = async (userData) => {
  try {
    const { email, username } = userData;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const user = await User.create(userData);

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );

    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const validateUserCredentials = async (userData) => {
  try {
    const { email, password } = userData;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const matchResult = await user.isPasswordCorrect(password);

    if (!matchResult) {
      throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );

    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const inValidateTokenInDB = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $set: {
        refreshToken: null,
      },
    });
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (user) {
      return user;
    }

    return false;
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

const generateApiKeyService = async (userId) => {
  try {
    const key = crypto.randomBytes(32).toString("hex");
    const apiKey = await ApiKey.create({ owner: userId, key });

    return apiKey;
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error",
    );
  }
};

export {
  createUser,
  validateUserCredentials,
  inValidateTokenInDB,
  findUserById,
  generateAccessAndRefreshToken,
  generateApiKeyService,
};
