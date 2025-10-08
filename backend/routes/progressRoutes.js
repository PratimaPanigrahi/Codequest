// backend/routes/progressRoutes.js
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getMyProgress,
  completeLesson,
  completeQuiz,
  resetUserProgress,
  getAllProgress,
  getLeaderboard
} from "../controllers/progressController.js";

const router = express.Router();

// Users: get their progress
router.get("/me", protect, getMyProgress);

// Users: mark lesson complete
router.post("/lesson/:lessonId/complete", protect, completeLesson);

// Users: mark quiz complete
router.post("/quiz/:quizId/complete", protect, completeQuiz);

// Admin: reset any user's progress
router.post("/reset/:userId", protect, authorize("admin"), resetUserProgress);

// Admin: get all users progress
router.get("/", protect, authorize("admin"), getAllProgress);

// Leaderboard for a quiz
router.get("/leaderboard/:quizId", protect, getLeaderboard);

export default router;
