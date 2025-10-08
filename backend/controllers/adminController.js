import Lesson from "../models/lesson.js";
import User from "../models/user.js";

// Get total users
export const getUsersCount = async (req, res) => {
  const count = await User.countDocuments();
  res.json({ count });
};

// List all lessons
export const getLessons = async (req, res) => {
  const lessons = await Lesson.find();
  res.json(lessons);
};

// Add lesson
export const addLesson = async (req, res) => {
  const { title, difficulty } = req.body;
  const lesson = new Lesson({ title, difficulty, levels: [], author: req.user._id });
  await lesson.save();
  res.status(201).json(lesson);
};

// Delete lesson
export const deleteLesson = async (req, res) => {
  await Lesson.findByIdAndDelete(req.params.id);
  res.status(204).send();
};

// Add level to lesson
export const addLevel = async (req, res) => {
  const { title, slide } = req.body;
  const lesson = await Lesson.findById(req.params.lessonId);
  lesson.levels.push({ title, slide });
  await lesson.save();
  res.status(201).json(lesson);
};
// Get all users (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }};