import express from "express";
import { getRandomQuestions } from "../ai/offlineQuiz.js";

const router = express.Router();

// POST /api/quiz/generate
router.post("/generate", (req, res) => {
  const { level = 1, numQuestions = 10 } = req.body; // default 10, max 15
  const quiz = getRandomQuestions(level, numQuestions);
  res.json(quiz);
});

export default router;
