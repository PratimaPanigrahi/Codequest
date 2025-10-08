import express from "express";
import Quiz from "../../models/Quiz.js";
import { verifyAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();
router.use(verifyAdmin);

// GET all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("linkedLesson", "title");
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST create quiz
router.post("/", async (req, res) => {
  try {
    const quiz = await Quiz.create({ ...req.body, creator: req.user._id });
    res.status(201).json({ quiz });
  } catch (err) {
    res.status(400).json({ message: "Failed to create quiz", error: err.message });
  }
});

// PUT update quiz
router.put("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ quiz });
  } catch (err) {
    res.status(400).json({ message: "Failed to update quiz", error: err.message });
  }
});

// DELETE quiz
router.delete("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete quiz", error: err.message });
  }
});

export default router;
