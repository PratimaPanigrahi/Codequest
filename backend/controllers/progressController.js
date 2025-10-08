import asyncHandler from "express-async-handler";
import Progress from "../models/Progress.js";
import Lesson from "../models/lesson.js";
import Quiz from "../models/Quiz.js";
import User from "../models/user.js";

// ---------------------- GET USER PROGRESS ----------------------
export const getMyProgress = asyncHandler(async (req, res) => {
  let progress = await Progress.findOne({ user: req.user._id })
    .populate("lessons.lesson quizzes.quiz achievements.lesson achievements.quiz");

  if (!progress) {
    // Create default progress for new users  
    progress = await Progress.create({
      user: req.user._id,
      lessons: [],
      quizzes: [],
      achievements: [],
      points: 0,
      level: 1,
      streak: 0,
      history: [],
    });
  }

  res.json({ success: true, progress });
});


// ---------------------- COMPLETE LESSON ----------------------
export const completeLesson = asyncHandler(async (req, res) => {
  const { score = 0, timeSpent = 0, notes = "", feedback = "" } = req.body;
  const lessonId = req.params.lessonId;

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  const progress =
    (await Progress.findOne({ user: req.user._id })) ||
    (await Progress.create({ user: req.user._id }));

  // 🔒 Step-based progression check
  const completedLessons = await Lesson.find({
    _id: { $in: progress.lessons.filter(l => l.completed).map(l => l.lesson) },
  }).sort({ step: -1 });

  const lastCompletedStep = completedLessons.length > 0 ? completedLessons[0].step : 0;

  if (lesson.step > lastCompletedStep + 1) {
    res.status(403);
    throw new Error(`You must complete lesson step ${lastCompletedStep + 1} first`);
  }

  // Count lessons completed today
const today = new Date().toDateString();
const lessonsToday = progress.lessons.filter(
  l => new Date(l.createdAt).toDateString() === today
).length;

// Points earned = 5 per lesson per day
const pointsEarned = lessonsToday * 5;
progress.points += pointsEarned;

// Normal level calculation based on points
progress.level = Math.floor(progress.points / 100) + 1;

// Bonus level unlock if points reach 100 / 200 / 300 etc
if (progress.points % 100 === 0) {
  progress.level += 1; // unlocks 1 extra level ignoring prerequisite
}
const lastLesson = progress.lessons
  .filter(l => l.completed)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

progress.streak = lastLesson && new Date(lastLesson.createdAt).toDateString() === yesterday.toDateString()
  ? progress.streak + 1
  : 1;
progress.history.push({
  date: new Date(),
  action: "completed lesson",
  lesson: lessonId,
  progressPercentage: 100,
});

await progress.save();
  // ✅ Mark lesson complete
  let lessonProgress = progress.lessons.find(lp => lp.lesson.toString() === lessonId);
  if (!lessonProgress) {
    progress.lessons.push({
      lesson: lessonId,
      completed: true,
      score,
      timeSpent,
      notes,
      feedback,
      completion: 100,
    });
    progress.points += score;
  } else if (!lessonProgress.completed) {
    lessonProgress.completed = true;
    lessonProgress.score = score;
    lessonProgress.timeSpent = timeSpent;
    lessonProgress.notes = notes;
    lessonProgress.feedback = feedback;
    lessonProgress.completion = 100;
    progress.points += score;
  } else {
    // already completed → update metadata but no extra points
    lessonProgress.score = score;
    lessonProgress.timeSpent = timeSpent;
    lessonProgress.notes = notes;
    lessonProgress.feedback = feedback;
  }

  progress.level = Math.floor(progress.points / 100) + 1;

  await progress.save();

  res.json({
    success: true,
    message: `Lesson ${lesson.step} completed successfully`,
    progress,
  });
});

// ---------------------- COMPLETE QUIZ ----------------------
export const completeQuiz = asyncHandler(async (req, res) => {
  const { quizId, score = 0, attempts = 1, correctAnswers = 0, totalQuestions = 0, timeSpent = 0 } = req.body;
  const userId = req.user._id;

  const progress = await Progress.findOne({ user: userId }) || await Progress.create({ user: userId });

  let quizProgress = progress.quizzes.find(qp => qp.quiz.toString() === quizId);
  if (!quizProgress) {
    quizProgress = { quiz: quizId, completed: true, score, attempts, correctAnswers, totalQuestions, timeSpent };
    progress.quizzes.push(quizProgress);
  } else {
    quizProgress.completed = true;
    quizProgress.score = score;
    quizProgress.attempts += attempts;
    quizProgress.correctAnswers = correctAnswers;
    quizProgress.totalQuestions = totalQuestions;
    quizProgress.timeSpent += timeSpent;
  }

  progress.points += score;
  progress.level = Math.floor(progress.points / 100) + 1;

  await progress.save();
  res.json({ success: true, progress });
});

// ---------------------- RESET USER PROGRESS (ADMIN) ----------------------
export const resetUserProgress = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const progress = await Progress.findOne({ user: userId });
  if (!progress) {
    res.status(404);
    throw new Error("User progress not found");
  }

  progress.lessons = [];
  progress.quizzes = [];
  progress.points = 0;
  progress.level = 1;
  progress.achievements = [];
  progress.history = [];
  await progress.save();

  res.json({ success: true, message: "Progress reset successfully", progress });
});

// ---------------------- GET ALL USERS PROGRESS (ADMIN) ----------------------
export const getAllProgress = asyncHandler(async (req, res) => {
  const progressList = await Progress.find()
    .populate("user lessons.lesson quizzes.quiz achievements.lesson achievements.quiz");
  res.json({ success: true, progressList });
});

// ---------------------- GET QUIZ LEADERBOARD ----------------------
export const getLeaderboard = asyncHandler(async (req, res) => {
  const quizId = req.params.quizId;
  const quiz = await Quiz.findById(quizId).populate("leaderboard.user", "name email");
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  const leaderboard = quiz.leaderboard
    .map(l => ({
      user: l.user.name,
      email: l.user.email,
      score: l.score,
      attempts: l.attempts,
      lastAttempt: l.lastAttempt,
    }))
    .sort((a, b) => b.score - a.score);

  res.json({ success: true, leaderboard });
});

