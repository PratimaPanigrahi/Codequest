import express from "express";
import { getUsers } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getUsersCount,
  getLessons,
  addLesson,
  deleteLesson,
  addLevel,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users-count", protect, admin, getUsersCount);
router.get("/lessons", protect, admin, getLessons);
router.post("/lessons", protect, admin, addLesson);
router.delete("/lessons/:id", protect, admin, deleteLesson);
router.post("/lessons/:lessonId/levels", protect, admin, addLevel);
router.get("/users", protect, admin, getUsers);

export default router;
