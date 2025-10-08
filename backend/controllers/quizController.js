// controllers/quizController.js
import asyncHandler from "express-async-handler";
import Quiz from "../models/Quiz.js";
import Progress from "../models/Progress.js";

// ---------------------- CREATE QUIZ ----------------------
// @desc    Create a new quiz (Admin only)
// @route   POST /api/quizzes
// @access  Private/Admin
export const createQuiz = asyncHandler(async (req, res) => {
  const { title, questions, category, tags, difficulty, linkedLesson } = req.body;

  const quizExists = await Quiz.findOne({ title });
  if (quizExists) {
    res.status(400);
    throw new Error("Quiz with this title already exists");
  }

  const quiz = await Quiz.create({
    title,
    questions,
    category: category || "General",
    tags: tags || [],
    difficulty: difficulty || "medium",
    linkedLesson: linkedLesson || null,
    creator: req.user._id,
  });

  res.status(201).json({ success: true, message: "Quiz created successfully", quiz });
});

// ---------------------- GET ALL QUIZZES ----------------------
export const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find().sort({ createdAt: -1 });
  res.json({ success: true, quizzes });
});

// ---------------------- GET SINGLE QUIZ ----------------------
export const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  // Randomize questions/options for users
  if (!req.user?.isAdmin) {
    const shuffledQuestions = quiz.questions.map(q => {
      const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
      return { ...q.toObject(), options: shuffledOptions };
    }).sort(() => Math.random() - 0.5);

    return res.json({ success: true, quiz: { ...quiz.toObject(), questions: shuffledQuestions } });
  }

  res.json({ success: true, quiz });
});

// ---------------------- UPDATE QUIZ ----------------------
export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  const { title, questions, category, tags, difficulty, linkedLesson } = req.body;
  quiz.title = title || quiz.title;
  quiz.questions = questions || quiz.questions;
  quiz.category = category || quiz.category;
  quiz.tags = tags || quiz.tags;
  quiz.difficulty = difficulty || quiz.difficulty;
  quiz.linkedLesson = linkedLesson || quiz.linkedLesson;

  const updatedQuiz = await quiz.save();
  res.json({ success: true, message: "Quiz updated", quiz: updatedQuiz });
});

// ---------------------- DELETE QUIZ ----------------------
export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  await quiz.remove();
  res.json({ success: true, message: "Quiz deleted successfully" });
});

// ---------------------- SUBMIT QUIZ ----------------------
export const submitQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  const { answers, timeSpent = 0 } = req.body;
  let score = 0;

  quiz.questions.forEach(q => {
    if (answers[q._id] && answers[q._id] === q.correctAnswer) {
      score += 1;
    }
  });

  // Update user progress
  let progress = await Progress.findOne({ user: req.user._id });
  if (!progress) progress = await Progress.create({ user: req.user._id });

  const existingQuiz = progress.quizzes.find(q => q.quiz.toString() === quiz._id.toString());
  if (existingQuiz) {
    existingQuiz.completed = true;
    existingQuiz.score = score;
    existingQuiz.attempts += 1;
    existingQuiz.timeSpent += timeSpent;
  } else {
    progress.quizzes.push({ quiz: quiz._id, completed: true, score, attempts: 1, timeSpent });
  }

  // Update points and level (gamification)
  progress.points += score;
  progress.level = Math.floor(progress.points / 100) + 1;

  await progress.save();

  // Update Quiz leaderboard
  const lbIndex = quiz.leaderboard.findIndex(l => l.user.toString() === req.user._id.toString());
  if (lbIndex !== -1) {
    if (score > quiz.leaderboard[lbIndex].score) {
      quiz.leaderboard[lbIndex].score = score;
      quiz.leaderboard[lbIndex].attempts += 1;
      quiz.leaderboard[lbIndex].lastAttempt = new Date();
    }
  } else {
    quiz.leaderboard.push({ user: req.user._id, score, attempts: 1, lastAttempt: new Date() });
  }

  // Update average score & attempt count
  const totalScore = quiz.leaderboard.reduce((sum, l) => sum + l.score, 0);
  quiz.averageScore = totalScore / quiz.leaderboard.length;
  quiz.attemptCount = quiz.leaderboard.length;

  await quiz.save();

  res.json({
    success: true,
    message: "Quiz submitted successfully, progress & leaderboard updated",
    score,
    totalQuestions: quiz.questions.length,
    progress,
    quiz,
  });
});

// ---------------------- GET QUIZ LEADERBOARD ----------------------
export const getQuizLeaderboard = asyncHandler(async (req, res) => {
  const quizId = req.params.id;
  const leaderboard = await Progress.find({ "quizzes.quiz": quizId })
    .populate("user", "name email")
    .sort({ "quizzes.score": -1 })
    .limit(10);

  res.json({ success: true, leaderboard });
});
