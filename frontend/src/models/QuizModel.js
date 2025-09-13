// src/models/QuizModel.js

/**
 * Quiz Model - defines the structure of a quiz object.
 * 
 * Features:
 * ✅ Supports multiple-choice questions
 * ✅ Supports difficulty levels
 * ✅ Can set a time limit
 * ✅ Stores explanations for answers
 * ✅ Tracks analytics (attempts, avgScore)
 * ✅ Handles publish state for admin
 * ✅ Includes helper to evaluate quiz submissions
 */

export class Quiz {
  constructor({
    id = null,
    title = "",
    description = "",
    questions = [],
    difficulty = "medium", // easy | medium | hard
    timeLimit = null, // in seconds (e.g., 600 = 10 minutes)
    createdBy = null, // admin/user ID
    isPublished = false,
    attempts = 0,
    averageScore = 0,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.questions = questions; // array of Question objects
    this.difficulty = difficulty;
    this.timeLimit = timeLimit;
    this.createdBy = createdBy;
    this.isPublished = isPublished;
    this.attempts = attempts;
    this.averageScore = averageScore;
  }
}

/**
 * Question Model - part of a quiz
 */
export class Question {
  constructor({
    id = null,
    text = "",
    options = [],
    correctAnswer = null,
    explanation = "",
  }) {
    this.id = id;
    this.text = text;
    this.options = options; // array of strings
    this.correctAnswer = correctAnswer; // string or index
    this.explanation = explanation;
  }
}

/**
 * Helper: Evaluate quiz answers
 * 
 * @param {Quiz} quiz - The quiz object
 * @param {Object} userAnswers - Map of {questionId: selectedOption}
 * @returns {Object} - { score, total, details }
 */
export function evaluateQuiz(quiz, userAnswers) {
  let score = 0;
  let details = [];

  quiz.questions.forEach((q) => {
    const userAnswer = userAnswers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;

    if (isCorrect) score++;

    details.push({
      questionId: q.id,
      questionText: q.text,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    });
  });

  return {
    score,
    total: quiz.questions.length,
    details,
  };
}
