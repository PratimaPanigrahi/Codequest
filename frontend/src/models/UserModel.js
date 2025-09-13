// src/models/UserModel.js

/**
 * UserModel
 * ------------
 * A simple class to normalize and work with user data.
 * Helps keep consistent shape across the app.
 * 
 * Roles: 
 *  - "admin" → full control (manage users, lessons, quizzes, roadmaps).
 *  - "user"  → learner/student (view lessons, attempt quizzes, track progress).
 */

export class UserModel {
  constructor(data = {}) {
    this.id = data.id || data._id || null;      // Supports MongoDB (_id) or generic id
    this.name = data.name || "";
    this.email = data.email || "";
    this.role = data.role || "user";            // Default role is "user"
    this.createdAt = data.createdAt || null;
  }

  /**
   * ✅ Role helpers
   * Easier checks throughout the app.
   */
  isAdmin() {
    return this.role === "admin";
  }

  isUser() {
    return this.role === "user";
  }

  /**
   * ✅ Utility: Convert to plain object
   * Useful for Redux, API calls, or debugging.
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
