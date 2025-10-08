// services/lessonService.js

import Lesson from "../models/Lesson.js";
import Progress from "../models/Progress.js";
import { AppError } from "../middleware/errorMiddleware.js";

class LessonService {
  // ---------------------- CREATE LESSON ---------------------- //
  static async createLesson(data) {
    const lesson = await Lesson.create(data);
    return lesson;
  }

  // ---------------------- GET LESSON ---------------------- //
  static async getLessonById(id) {
    const lesson = await Lesson.findById(id).populate("author", "name email");
    if (!lesson) throw new AppError("Lesson not found", 404);
    return lesson;
  }

  // ---------------------- UPDATE LESSON ---------------------- //
  static async updateLesson(id, updateData) {
    const lesson = await Lesson.findByIdAndUpdate(id, updateData, { new: true });
    if (!lesson) throw new AppError("Lesson not found", 404);
    return lesson;
  }

  // ---------------------- DELETE LESSON ---------------------- //
  static async deleteLesson(id) {
    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) throw new AppError("Lesson not found", 404);
    return lesson;
  }

  // ---------------------- ANALYTICS ---------------------- //
  static async getLessonAnalytics(lessonId) {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) throw new AppError("Lesson not found", 404);

    const progresses = await Progress.find({ lesson: lessonId });

    const totalAttempts = progresses.length;
    const completed = progresses.filter((p) => p.completed).length;
    const averageScore =
      progresses.reduce((sum, p) => sum + (p.score || 0), 0) /
      (progresses.length || 1);

    return { totalAttempts, completed, averageScore };
  }

  // ---------------------- RATINGS ---------------------- //
  static async addRating(lessonId, userId, rating, comment = "") {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) throw new AppError("Lesson not found", 404);

    // Check if user already rated
    const existingRatingIndex = lesson.ratings.findIndex(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingRatingIndex >= 0) {
      lesson.ratings[existingRatingIndex] = { user: userId, rating, comment };
    } else {
      lesson.ratings.push({ user: userId, rating, comment });
    }

    // Update average rating
    const total = lesson.ratings.reduce((sum, r) => sum + r.rating, 0);
    lesson.averageRating = parseFloat((total / lesson.ratings.length).toFixed(2));
    lesson.totalRatings = lesson.ratings.length;

    await lesson.save();
    return lesson;
  }

  // ---------------------- LESSON LIST WITH FILTERS ---------------------- //
  static async getLessons(filters = {}, options = {}) {
    const query = Lesson.find(filters);

    // Pagination & Sorting
    if (options.sortBy) query.sort(options.sortBy);
    if (options.limit) query.limit(options.limit);
    if (options.skip) query.skip(options.skip);

    return await query.populate("author", "name email");
  }
}

export default LessonService;
