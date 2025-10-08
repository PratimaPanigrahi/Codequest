import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // assuming you have auth middleware
import User from "../models/User.js";

const router = express.Router();

// GET /user/courses → fetch courses applied by logged-in user
router.get("/courses", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("coursesApplied"); 
    const courses = user.coursesApplied || [];
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
