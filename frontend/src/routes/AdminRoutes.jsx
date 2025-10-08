import express from "express";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
