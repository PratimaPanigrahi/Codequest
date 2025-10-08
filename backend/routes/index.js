import express from "express";
import authRoutes from "./authRoutes.js";
import lessonRoutes from "./lessonRoutes.js";
import quizRoutes from "./quizRoutes.js";
import progressRoutes from "./progressRoutes.js";
import adminRoutes from "./adminRoutes.js";
import userRoutes from "./userRoutes.js"; // NEW


const mountRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/lessons", lessonRoutes);
  app.use("/api/quizzes", quizRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/user", userRoutes);
  
};

export default mountRoutes;