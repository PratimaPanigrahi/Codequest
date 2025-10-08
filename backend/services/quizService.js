// backend/services/quizService.js

import Quiz from "../models/Quiz.js";
import Progress from "../models/Progress.js";
import { AppError } from "../middleware/errorMiddleware.js";

/**
 * Create a new quiz
 */
export const createQuiz = async (quizData) => {
  const quiz = await Quiz.create(quizData);
  return quiz;
};

/**
 * Get a quiz by ID with optional user progress
 */
export const getQuizById = async (quizId, userId = null) => {
  const quiz = await Quiz.findById(quizId).populate("creator", "name email");
  if (!quiz) throw new AppError("Quiz not found", 404);

  let progress = null;
  if (userId) {
    progress = await Progress.findOne({ quiz: quizId, user: userId });
  }

  // Shuffle questions and options
  const shuffledQuiz = shuffleQuiz(quiz.toObject());

  return { quiz: shuffledQuiz, progress };
};

/**
 * Update a quiz
 */
export const updateQuiz = async (quizId, updateData) => {
  const quiz = await Quiz.findByIdAndUpdate(quizId, updateData, { new: true });
  if (!quiz) throw new AppError("Quiz not found", 404);
  return quiz;
};

/**
 * Delete a quiz
 */
export const deleteQuiz = async (quizId) => {
  const quiz = await Quiz.findByIdAndDelete(quizId);
  if (!quiz) throw new AppError("Quiz not found", 404);
  return quiz;
};

/**
 * Submit a quiz attempt and calculate score
 * Feature 3: handle timer and scoring
 */
export const submitQuiz = async (quizId, userId, userAnswers, timeTaken) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new AppError("Quiz not found", 404);

  let score = 0;

  // Calculate score based on correct answers
  quiz.questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswer) score++;
  });

  // Optional: reduce score based on time limit
  if (quiz.timeLimit && timeTaken > quiz.timeLimit) {
    score = Math.max(0, score - 1); // simple penalty for exceeding time
  }

  const progress = await Progress.create({
    user: userId,
    quiz: quizId,
    completed: true,
    score,
  });

  return { score, total: quiz.questions.length, progress };
};

/**
 * Helper: Shuffle questions and options
 * Feature 2: randomize quiz for each user
 */
const shuffleQuiz = (quiz) => {
  const shuffled = { ...quiz };
  shuffled.questions = quiz.questions
    .map((q) => ({
      ...q,
      options: q.options.sort(() => Math.random() - 0.5),
    }))
    .sort(() => Math.random() - 0.5);
  return shuffled;
};
