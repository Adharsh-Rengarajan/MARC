import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.js";
import { AppError } from "../utils/errors.js";

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError(422, "MISSING_FIELDS", "Email and password are required");
  }
  const user = await UserModel.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !user.isActive) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }
  const valid = await user.comparePassword(password);
  if (!valid) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }
  const token = jwt.sign(
    { userId: user._id.toString(), role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );
  return { token, user: user.toSafeJSON() };
};

export const getCurrentUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError(404, "NOT_FOUND", "User not found");
  return user.toSafeJSON();
};
