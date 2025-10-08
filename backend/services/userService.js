// services/userService.js
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../middleware/errorMiddleware.js";

// ---------------------- UTILITY ---------------------- //

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ---------------------- AUTH ---------------------- //
const registerUser = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new AppError("User already exists", 400);

  const user = await User.create({ name, email, password });

  // Automatically mark user as verified (no email verification)
  user.isVerified = true;
  await user.save();

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  // No email verification check needed now

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  };
};

// ---------------------- PASSWORD RESET ---------------------- //
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found", 404);

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Optionally, send email for password reset if you want
  // await sendEmail({ to: user.email, subject: "Password Reset", text: `Click here: ${resetUrl}` });

  return { message: "Password reset link generated" };
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) throw new AppError("Invalid or expired token", 400);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return { message: "Password updated successfully" };
};

// ---------------------- PROFILE ---------------------- //
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return user;
};

const updateUserProfile = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  user.name = updates.name || user.name;
  user.email = updates.email || user.email;
  if (updates.password) user.password = updates.password;

  const updatedUser = await user.save();
  return {
    _id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    token: generateToken(updatedUser.id),
  };
};

// ---------------------- EXPORT ---------------------- //
export {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
};
