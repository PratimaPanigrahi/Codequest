// services/roadmapService.js

import Roadmap from "../models/Roadmap.js";
import Lesson from "../models/Lesson.js";
import Progress from "../models/Progress.js";
import { AppError } from "../middleware/errorMiddleware.js";

class RoadmapService {
  // Create a new roadmap
  static async createRoadmap(data) {
    const roadmap = await Roadmap.create(data);
    return roadmap;
  }

  // Get roadmap by ID with lessons and enrolled users
  static async getRoadmapById(id) {
    const roadmap = await Roadmap.findById(id)
      .populate("lessons.lesson", "title description difficulty")
      .populate("enrolledUsers", "name email");
    if (!roadmap) throw new AppError("Roadmap not found", 404);
    return roadmap;
  }

  // Enroll a user
  static async enrollUser(roadmapId, userId) {
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) throw new AppError("Roadmap not found", 404);

    if (roadmap.enrolledUsers.includes(userId)) {
      throw new AppError("User already enrolled", 400);
    }

    if (
      roadmap.maxEnrollments &&
      roadmap.enrolledUsers.length >= roadmap.maxEnrollments
    ) {
      throw new AppError("Enrollment limit reached", 400);
    }

    roadmap.enrolledUsers.push(userId);
    await roadmap.save();

    return roadmap;
  }

  // Get roadmap progress for a user
  static async getUserProgress(roadmapId, userId) {
    const roadmap = await Roadmap.findById(roadmapId).populate("lessons.lesson");
    if (!roadmap) throw new AppError("Roadmap not found", 404);

    const progressRecords = await Progress.find({
      user: userId,
      lesson: { $in: roadmap.lessons.map((l) => l.lesson._id) },
    });

    const completedLessons = progressRecords
      .filter((p) => p.completed)
      .map((p) => p.lesson.toString());

    // Conditional unlocks based on prerequisites
    const lessonsStatus = roadmap.lessons.map((l) => {
      const prerequisitesCompleted = l.prerequisites.every((prereqId) =>
        completedLessons.includes(prereqId.toString())
      );
      const unlocked = prerequisitesCompleted || l.prerequisites.length === 0;
      const completed = completedLessons.includes(l.lesson._id.toString());

      return {
        lesson: l.lesson._id,
        title: l.lesson.title,
        unlocked,
        completed,
        difficulty: l.lesson.difficulty,
      };
    });

    // Calculate badges/rewards
    const completedCount = lessonsStatus.filter((l) => l.completed).length;
    const totalLessons = lessonsStatus.length;

    const badges = [];
    if (completedCount === totalLessons && roadmap.rewards.length > 0) {
      badges.push(...roadmap.rewards.filter((r) => r.type === "badge"));
    }

    return { lessonsStatus, completedCount, totalLessons, badges };
  }

  // Add a comment to a roadmap
  static async addComment(roadmapId, userId, comment) {
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) throw new AppError("Roadmap not found", 404);

    roadmap.comments.push({ user: userId, comment });
    await roadmap.save();
    return roadmap;
  }

  // Update roadmap content (admin)
  static async updateRoadmap(roadmapId, updateData) {
    const roadmap = await Roadmap.findByIdAndUpdate(roadmapId, updateData, {
      new: true,
    });
    if (!roadmap) throw new AppError("Roadmap not found", 404);
    return roadmap;
  }

  // Delete roadmap (admin)
  static async deleteRoadmap(roadmapId) {
    const roadmap = await Roadmap.findByIdAndDelete(roadmapId);
    if (!roadmap) throw new AppError("Roadmap not found", 404);
    return roadmap;
  }

  // Get roadmap analytics
  static async getAnalytics(roadmapId) {
    const roadmap = await Roadmap.findById(roadmapId).populate("lessons.lesson");
    if (!roadmap) throw new AppError("Roadmap not found", 404);

    const progressRecords = await Progress.find({
      lesson: { $in: roadmap.lessons.map((l) => l.lesson._id) },
    });

    const lessonStats = roadmap.lessons.map((l) => {
      const completedCount = progressRecords.filter(
        (p) => p.lesson.toString() === l.lesson._id.toString() && p.completed
      ).length;
      return {
        lessonId: l.lesson._id,
        title: l.lesson.title,
        completions: completedCount,
      };
    });

    return { totalLessons: roadmap.lessons.length, lessonStats };
  }
}

export default RoadmapService;
