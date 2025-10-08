// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Middleware
import { errorHandler, AppError } from "./middleware/errorMiddleware.js";
import { protect } from "./middleware/authMiddleware.js";

// Routes
import lessonRoutes from "./routes/lessonRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import mountRoutes from "./routes/index.js"; // other routes

// Utils
import createDefaultAdmin from "./seedAdmin.js";

dotenv.config();

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: "http://localhost:5174", // your frontend port
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Seed default admin
createDefaultAdmin();

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Test error route
app.get("/test-error", (req, res, next) => {
  next(new AppError("This is a test error!", 400));
});

// ✅ Protected route test
app.get("/protected", protect, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route!",
    user: req.user,
  });
});

// ✅ Mount API routes
app.use("/api/lessons", lessonRoutes);
mountRoutes(app); // any other routes from index.js
app.use("/api/quiz", quizRoutes);

// ✅ Error handling middleware (last!)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
});

export default app;
