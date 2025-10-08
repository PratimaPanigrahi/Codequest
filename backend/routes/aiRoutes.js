import express from "express";
import { generateQuiz } from "../ai/aiQuestionGenerator.js";

const router = express.Router();

// POST /api/ai/generate
router.post("/generate", async (req, res) => {
  const { content, level } = req.body;

  if (!content || !level) {
    return res.status(400).json({ message: "Content and level are required" });
  }

  try {
    const quiz = await generateQuiz(content, level);
    res.json({ quiz });
  } catch (err) {
    console.error("Error generating quiz:", err);
    res.status(500).json({ message: "Failed to generate quiz" });
  }
});

export default router;
