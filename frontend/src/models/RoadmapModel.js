// src/models/RoadmapModel.js

import { LessonModel } from "./LessonModel";
import { QuizModel } from "./QuizModel";
import { ProgressModel } from "./ProgressModel";

export class RoadmapModel {
  constructor({
    roadmapId,
    title,
    description,
    stages = [],
    achievements = [],
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.roadmapId = roadmapId || `roadmap_${Date.now()}`;
    this.title = title;
    this.description = description;
    this.stages = stages; // array of RoadmapStage objects
    this.achievements = achievements; // global roadmap achievements
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // ---- DB MAPPING ----
  static fromDB(doc) {
    return new RoadmapModel({
      roadmapId: doc.roadmapId,
      title: doc.title,
      description: doc.description,
      stages: doc.stages.map((s) => RoadmapStage.fromDB(s)),
      achievements: doc.achievements || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  toDB() {
    return {
      roadmapId: this.roadmapId,
      title: this.title,
      description: this.description,
      stages: this.stages.map((s) => s.toDB()),
      achievements: this.achievements,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    };
  }

  // ---- USER-SPECIFIC PROGRESS ----
  getUserProgress(userId) {
    return this.stages.map((stage) => ({
      stageId: stage.stageId,
      completed: stage.completedBy.includes(userId),
      xpEarned: stage.xpByUser[userId] || 0,
      timeSpent: stage.timeByUser[userId] || 0,
    }));
  }

  markStageComplete(userId, stageId) {
    const stage = this.stages.find((s) => s.stageId === stageId);
    if (stage) {
      stage.completedBy.push(userId);
      stage.xpByUser[userId] = (stage.xpByUser[userId] || 0) + stage.xpReward;
      return true;
    }
    return false;
  }

  // ---- GAMIFICATION ----
  calculateLeaderboard() {
    const leaderboard = {};
    this.stages.forEach((stage) => {
      Object.keys(stage.xpByUser).forEach((userId) => {
        leaderboard[userId] =
          (leaderboard[userId] || 0) + stage.xpByUser[userId];
      });
    });
    return Object.entries(leaderboard).sort((a, b) => b[1] - a[1]); // sorted by XP
  }

  trackStreak(userId, date = new Date()) {
    // simplistic streak tracker per user
    if (!this.streaks) this.streaks = {};
    if (!this.streaks[userId]) this.streaks[userId] = { count: 0, lastDate: null };

    const lastDate = this.streaks[userId].lastDate;
    if (
      lastDate &&
      new Date(lastDate).toDateString() ===
        new Date(date.getTime() - 86400000).toDateString()
    ) {
      this.streaks[userId].count++;
    } else {
      this.streaks[userId].count = 1;
    }
    this.streaks[userId].lastDate = date;
    return this.streaks[userId];
  }
}

// ---- Roadmap Stage ----
export class RoadmapStage {
  constructor({
    stageId,
    title,
    description,
    lessons = [],
    quizzes = [],
    prerequisites = [],
    optionalNext = [],
    xpReward = 100,
    completedBy = [],
    xpByUser = {},
    timeByUser = {},
    createdAt = new Date(),
  }) {
    this.stageId = stageId || `stage_${Date.now()}`;
    this.title = title;
    this.description = description;
    this.lessons = lessons.map((l) => new LessonModel(l));
    this.quizzes = quizzes.map((q) => new QuizModel(q));
    this.prerequisites = prerequisites; // stageIds required before unlock
    this.optionalNext = optionalNext; // stageIds that can follow this stage
    this.xpReward = xpReward;
    this.completedBy = completedBy;
    this.xpByUser = xpByUser;
    this.timeByUser = timeByUser;
    this.createdAt = createdAt;
  }

  static fromDB(doc) {
    return new RoadmapStage({
      stageId: doc.stageId,
      title: doc.title,
      description: doc.description,
      lessons: doc.lessons || [],
      quizzes: doc.quizzes || [],
      prerequisites: doc.prerequisites || [],
      optionalNext: doc.optionalNext || [],
      xpReward: doc.xpReward || 100,
      completedBy: doc.completedBy || [],
      xpByUser: doc.xpByUser || {},
      timeByUser: doc.timeByUser || {},
      createdAt: doc.createdAt,
    });
  }

  toDB() {
    return {
      stageId: this.stageId,
      title: this.title,
      description: this.description,
      lessons: this.lessons.map((l) => l.toDB()),
      quizzes: this.quizzes.map((q) => q.toDB()),
      prerequisites: this.prerequisites,
      optionalNext: this.optionalNext,
      xpReward: this.xpReward,
      completedBy: this.completedBy,
      xpByUser: this.xpByUser,
      timeByUser: this.timeByUser,
      createdAt: this.createdAt,
    };
  }

  recordTime(userId, minutes) {
    this.timeByUser[userId] = (this.timeByUser[userId] || 0) + minutes;
  }

  getQuizStats() {
    return this.quizzes.map((quiz) => ({
      quizId: quiz.quizId,
      attempts: quiz.attempts,
      successRate: quiz.getSuccessRate(),
    }));
  }
}
