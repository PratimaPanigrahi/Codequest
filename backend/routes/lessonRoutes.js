import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  addLesson,
  addLevel,
  deleteLesson,
  deleteLevel,
  getLessons,
} from "../controllers/lessonController.js";

const router = express.Router();

// Admin-only routes
router.use(protect, admin);

router.get("/", getLessons);              // Get all lessons
router.post("/add-lesson", addLesson);    // Add a new lesson
router.post("/add-level", addLevel);      // Add a level to a lesson
// Delete a lesson
router.delete("/:id", protect, admin, deleteLesson);

// Delete a level inside a lesson
router.delete("/:id/levels/:levelNumber", protect, admin, deleteLevel);


export default router;
