// src/models/ProgressModel.js

export default class ProgressModel {
  constructor({
    userId,
    courses = [], // supports multiple courses/roadmaps
    achievements = [],
    badges = [],
    lastUpdated = new Date(),
  }) {
    this.userId = userId;
    this.courses = courses; // [{ courseId, lessons, quizzes, roadmapStage }]
    this.achievements = achievements; // list of strings
    this.badges = badges; // list of strings
    this.lastUpdated = lastUpdated;
  }

  // ---------- LESSON METHODS ----------
  markLessonCompleted(courseId, lessonId, timeSpent = 0, videoProgress = 0) {
    const course = this._getCourse(courseId);
    if (!course) return;

    let lesson = course.lessons.find((l) => l.lessonId === lessonId);

    if (!lesson) {
      lesson = { lessonId, completed: true, timeSpent, videoProgress };
      course.lessons.push(lesson);
    } else {
      lesson.completed = true;
      lesson.timeSpent += timeSpent;
      lesson.videoProgress = Math.max(lesson.videoProgress, videoProgress);
    }

    this._updateTimestamp();
  }

  getLessonCompletion(courseId) {
    const course = this._getCourse(courseId);
    if (!course || course.lessons.length === 0) return 0;
    const completed = course.lessons.filter((l) => l.completed).length;
    return Math.round((completed / course.lessons.length) * 100);
  }

  // ---------- QUIZ METHODS ----------
  recordQuizAttempt(courseId, quizId, score) {
    const course = this._getCourse(courseId);
    if (!course) return;

    let quiz = course.quizzes.find((q) => q.quizId === quizId);

    if (!quiz) {
      quiz = { quizId, attempts: [], bestScore: score };
      course.quizzes.push(quiz);
    }

    quiz.attempts.push({ score, date: new Date() });
    quiz.bestScore = Math.max(quiz.bestScore, score);

    this._updateTimestamp();
  }

  getQuizAverage(courseId, quizId) {
    const course = this._getCourse(courseId);
    if (!course) return 0;

    const quiz = course.quizzes.find((q) => q.quizId === quizId);
    if (!quiz || quiz.attempts.length === 0) return 0;

    const total = quiz.attempts.reduce((sum, a) => sum + a.score, 0);
    return Math.round(total / quiz.attempts.length);
  }

  getOverallQuizAverage(courseId) {
    const course = this._getCourse(courseId);
    if (!course || course.quizzes.length === 0) return 0;

    const allAttempts = course.quizzes.flatMap((q) => q.attempts);
    if (allAttempts.length === 0) return 0;

    const total = allAttempts.reduce((sum, a) => sum + a.score, 0);
    return Math.round(total / allAttempts.length);
  }

  // ---------- ROADMAP METHODS ----------
  updateRoadmapStage(courseId, stage) {
    const course = this._getCourse(courseId);
    if (course) {
      course.roadmapStage = stage;
      this._updateTimestamp();
    }
  }

  // ---------- ACHIEVEMENTS & BADGES ----------
  addAchievement(achievement) {
    if (!this.achievements.includes(achievement)) {
      this.achievements.push(achievement);
      this._updateTimestamp();
    }
  }

  addBadge(badge) {
    if (!this.badges.includes(badge)) {
      this.badges.push(badge);
      this._updateTimestamp();
    }
  }

  // Example auto-badge system
  checkAndAwardBadges(courseId) {
    const lessonCompletion = this.getLessonCompletion(courseId);
    const avgScore = this.getOverallQuizAverage(courseId);

    if (lessonCompletion === 100 && !this.badges.includes("Course Finisher")) {
      this.addBadge("Course Finisher");
    }
    if (avgScore >= 90 && !this.badges.includes("Quiz Master")) {
      this.addBadge("Quiz Master");
    }
    if (this.badges.length >= 5 && !this.badges.includes("Champion")) {
      this.addBadge("Champion");
    }
  }

  // ---------- PRIVATE HELPERS ----------
  _getCourse(courseId) {
    let course = this.courses.find((c) => c.courseId === courseId);
    if (!course) {
      course = { courseId, lessons: [], quizzes: [], roadmapStage: null };
      this.courses.push(course);
    }
    return course;
  }

  _updateTimestamp() {
    this.lastUpdated = new Date();
  }
}
