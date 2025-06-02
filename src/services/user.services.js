import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.util.js";

async function generateAccessAndRefreshToken(userID) {
  try {
    const user = await User.findById(userID);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message);
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
    throw new ApiError(500, error.message);
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
    throw new ApiError(500, error.message);
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
    throw new ApiError(500, error.message);
  }
};

const findUserById = async (userId) => {
  const user = await User.findById(userId);

  if (user) {
    return user;
  }

  return false;
};

export {
  createUser,
  validateUserCredentials,
  inValidateTokenInDB,
  findUserById,
  generateAccessAndRefreshToken,
};
