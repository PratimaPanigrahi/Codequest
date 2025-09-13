// src/models/LessonModel.js

/**
 * LessonModel
 * -----------------
 * Represents a learning lesson in the system.
 * Keeps lesson data consistent across Redux, API, and UI.
 * 
 * Example usage:
 *   const lesson = new LessonModel(apiData);
 *   if (lesson.isPublished()) { ... }
 */

export class LessonModel {
  constructor(data = {}) {
    this.id = data.id || data._id || null;         // Supports MongoDB (_id) or generic id
    this.title = data.title || "";
    this.description = data.description || "";
    this.content = data.content || "";             // Full lesson content (could be text, markdown, etc.)
    this.videoUrl = data.videoUrl || null;         // Optional: lesson video link
    this.quizId = data.quizId || null;             // Optional: related quiz
    this.isPublished = data.isPublished || false;  // Published or draft
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  /**
   * ✅ Status helpers
   */
  isDraft() {
    return !this.isPublished;
  }

  isPublishedLesson() {
    return this.isPublished;
  }

  /**
   * ✅ Utility: Convert to plain object
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      content: this.content,
      videoUrl: this.videoUrl,
      quizId: this.quizId,
      isPublished: this.isPublished,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
