import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";

// ---------------------- REGISTER ----------------------
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    // Send proper error response
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "user", // default role
  });

  const refreshToken = crypto.randomBytes(40).toString("hex");
  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
    refreshToken,
  });
});

// ---------------------- LOGIN ----------------------
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const refreshToken = crypto.randomBytes(40).toString("hex");
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
    refreshToken,
  });
});

// ---------------------- LOGOUT ----------------------
export const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.refreshToken = null;
    await user.save();
    res.json({ message: "Logged out successfully" });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

// ---------------------- FORGOT PASSWORD ----------------------
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save();

  const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
  console.log("Password reset link:", resetUrl);

  res.json({ message: "Password reset link sent to email", resetUrl });
});

// ---------------------- RESET PASSWORD ----------------------
export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
});

// ---------------------- REFRESH TOKEN ----------------------
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Refresh token required" });
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }

  res.json({
    token: generateToken(user._id),
  });
});

// ---------------------- GET PROFILE ----------------------
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json(user);
});
