import express from "express";
import Lesson from "../../models/Lesson.js";
import { verifyAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();
router.use(verifyAdmin);

// GET all lessons (for admin panel)
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ step: 1 });
    res.json({ lessons });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST create a lesson
router.post("/", async (req, res) => {
  try {
    const { title, difficulty, description, content, slides } = req.body;
    const lesson = await Lesson.create({
      title,
      difficulty,
      description,
      content,
      slides,
      author: req.user._id,
    });
    res.status(201).json({ lesson });
  } catch (err) {
    res.status(400).json({ message: "Failed to create lesson", error: err.message });
  }
});

// PUT update a lesson
router.put("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json({ lesson });
  } catch (err) {
    res.status(400).json({ message: "Failed to update lesson", error: err.message });
  }
});

// DELETE lesson
router.delete("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete lesson", error: err.message });
  }
});

export default router;
