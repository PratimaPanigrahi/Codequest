import mongoose from "mongoose";

const lessonProgressSchema = new mongoose.Schema(
  {
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    completed: { type: Boolean, default: false },
    completion: { type: Number, default: 0 }, // 0-100%
    score: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 }, // seconds
    notes: String, // personal notes
    feedback: String, // feedback on the lesson
  },
  { _id: false }
);

const quizProgressSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 }, // seconds
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    dateEarned: { type: Date, default: Date.now },
  },
  { _id: false }
);

const historySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    action: String, // e.g., "completed lesson", "attempted quiz"
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    progressPercentage: Number,
  },
  { _id: false }
);

const strugglingTopicSchema = new mongoose.Schema(
  {
    topic: String,
    attempts: { type: Number, default: 0 },
    lastAttempt: Date,
  },
  { _id: false }
);

const friendsProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    overallCompletion: { type: Number, default: 0 },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema(
  {
    message: String,
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lessons: [lessonProgressSchema],
    quizzes: [quizProgressSchema],
    achievements: [achievementSchema],
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    history: [historySchema],
    strugglingTopics: [strugglingTopicSchema],
    friendsProgress: [friendsProgressSchema],
    notifications: [notificationSchema], // new
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Progress = mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default Progress;
