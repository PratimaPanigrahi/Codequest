// routes/authRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
  refreshToken,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

// ---------- AUTH ROUTES ----------
router.post("/register", registerUser);     // Register new user
router.post("/login", loginUser);           // Login user
router.get("/profile", protect, getProfile);// Get user profile (protected)

// ---------- PASSWORD RESET ----------
router.post("/forgot-password", forgotPassword); // Request reset link
router.post("/reset-password/:token", resetPassword); // Reset with token

// ---------- TOKEN MANAGEMENT ----------
router.post("/refresh-token", refreshToken); // Get new access token
router.post("/logout", protect, logoutUser); // Logout & clear token/session

export default router;
