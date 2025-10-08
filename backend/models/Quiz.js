import mongoose from "mongoose";

// ---------------------- QUESTION SCHEMA ----------------------
const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, "Question text is required"],
    },
    type: {
      type: String,
      enum: ["mcq", "true_false", "short_answer", "fill_in_blank"],
      default: "mcq",
    },
    options: [String], // Only for MCQ / True-False
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    timeLimit: {
      type: Number, // seconds per question
      default: 60,   // 0 means no limit
    },
  },
  { _id: false }
);

// ---------------------- QUIZ SCHEMA ----------------------
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: "General",
    },
    tags: {
      type: [String],
      default: [],
    },
    questions: {
      type: [questionSchema],
      validate: [q => q.length > 0, "Quiz must have at least one question"],
    },
    randomizeQuestions: {
      type: Boolean,
      default: false,
    },
    randomizeOptions: {
      type: Boolean,
      default: false,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    linkedLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },
    version: {
      type: Number,
      default: 1, // allows future versioning
    },
    leaderboard: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        score: { type: Number, default: 0 },
        attempts: { type: Number, default: 0 },
        lastAttempt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default Quiz;
