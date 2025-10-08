// backend/services/progressService.js

import Progress from "../models/Progress.js";
import Lesson from "../models/Lesson.js";
import Roadmap from "../models/Roadmap.js";
import User from "../models/User.js";
import { AppError } from "../middleware/errorMiddleware.js";

/**
 * Record lesson completion for a user
 * Applies completion criteria (e.g., quiz score threshold)
 */
export const completeLesson = async (userId, lessonId, score = null) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new AppError("Lesson not found", 404);

  let progress = await Progress.findOne({ user: userId, lesson: lessonId });
  if (!progress) {
    progress = new Progress({ user: userId, lesson: lessonId });
  }

  // Mark lesson completed if score meets requirement
  if (score !== null) {
    progress.score = score;
    progress.completed = score >= 70; // 70% passing threshold
  } else {
    progress.completed = true;
  }

  await progress.save();

  // Reward system: give badges or points
  const user = await User.findById(userId);
  if (progress.completed && !user.badges) user.badges = [];
  if (progress.completed) user.badges.push({ type: "lesson", value: lesson.title });
  await user.save();

  // Check roadmap progress
  const roadmaps = await Roadmap.find({ "lessons.lesson": lessonId, enrolledUsers: userId });
  for (const roadmap of roadmaps) {
    const completedLessons = await Progress.find({
      user: userId,
      lesson: { $in: roadmap.lessons.map(l => l.lesson) },
      completed: true,
    });
    roadmap.completionPercentage = (completedLessons.length / roadmap.lessons.length) * 100;
    await roadmap.save();
  }

  return progress;
};

/**
 * Record quiz attempt
 */
export const attemptQuiz = async (userId, quizId, score, timeSpent) => {
  const progress =
    (await Progress.findOne({ user: userId, quiz: quizId })) ||
    new Progress({ user: userId, quiz: quizId });

  progress.score = score;
  progress.completed = score >= 70;
  progress.timeSpent = timeSpent;

  // Save each attempt in history
  if (!progress.attempts) progress.attempts = [];
  progress.attempts.push({ score, timeSpent, date: new Date() });

  await progress.save();

  return progress;
};

/**
 * Fetch user's progress with filters
 */
export const getProgressByUser = async (userId, filters = {}) => {
  const query = { user: userId, ...filters };
  return await Progress.find(query).populate("lesson quiz");
};

/**
 * Analytics for a lesson or quiz
 */
export const getAnalytics = async (lessonId = null, quizId = null) => {
  const query = {};
  if (lessonId) query.lesson = lessonId;
  if (quizId) query.quiz = quizId;

  const progresses = await Progress.find(query);

  const totalAttempts = progresses.length;
  const completed = progresses.filter(p => p.completed).length;
  const averageScore =
    progresses.reduce((sum, p) => sum + (p.score || 0), 0) / (progresses.length || 1);

  return { totalAttempts, completed, averageScore };
};

/**
 * Generate user report
 */
export const generateUserReport = async (userId) => {
  const progresses = await Progress.find({ user: userId }).populate("lesson quiz");
  const report = progresses.map(p => ({
    lesson: p.lesson ? p.lesson.title : null,
    quiz: p.quiz ? p.quiz.title : null,
    score: p.score,
    completed: p.completed,
    attempts: p.attempts || [],
  }));
  return report;
};
