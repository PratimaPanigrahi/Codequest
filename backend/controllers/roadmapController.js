// controllers/roadmapController.js
import Roadmap from "../models/Roadmap.js";
import User from "../models/User.js";

// -------------------- CREATE --------------------
export const createRoadmap = async (req, res) => {
  try {
    const { title, description, lessons, rewards, isFree, maxEnrollments, creatorId } = req.body;

    const roadmap = await Roadmap.create({
      title,
      description,
      lessons,
      rewards,
      isFree,
      maxEnrollments,
      creator: creatorId || req.user._id, // Use logged-in admin if creatorId not provided
    });

    res.status(201).json({ success: true, roadmap });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// -------------------- READ --------------------
export const getAllRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find().populate("enrolledUsers", "name email");
    res.status(200).json({ success: true, roadmaps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id)
      .populate("enrolledUsers", "name email")
      .populate("comments.user", "name email");
    if (!roadmap) return res.status(404).json({ success: false, message: "Roadmap not found" });

    res.status(200).json({ success: true, roadmap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- UPDATE --------------------
export const updateRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!roadmap) return res.status(404).json({ success: false, message: "Roadmap not found" });

    res.status(200).json({ success: true, roadmap });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// -------------------- DELETE --------------------
export const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndDelete(req.params.id);
    if (!roadmap) return res.status(404).json({ success: false, message: "Roadmap not found" });

    res.status(200).json({ success: true, message: "Roadmap deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- ASSIGN ROADMAP --------------------
export const assignRoadmapToUser = async (req, res) => {
  try {
    const roadmapId = req.params.id;
    const userId = req.user._id;

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) return res.status(404).json({ success: false, message: "Roadmap not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.assignedRoadmaps = user.assignedRoadmaps || [];
    if (!user.assignedRoadmaps.includes(roadmap._id)) {
      user.assignedRoadmaps.push(roadmap._id);
      await user.save();
    }

    res.status(200).json({ success: true, message: "Roadmap assigned successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- USER ROADMAP --------------------
export const getMyRoadmap = async (req, res) => {
  try {
    const userId = req.user._id;

    const roadmaps = await Roadmap.find({ enrolledUsers: userId });
    res.status(200).json({ success: true, roadmaps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- ROADMAP PROGRESS --------------------
export const getRoadmapProgress = async (req, res) => {
  try {
    const roadmapId = req.params.id;
    const userId = req.user._id;

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) return res.status(404).json({ success: false, message: "Roadmap not found" });

    // TODO: Implement real user progress tracking
    const completedLessons = [];

    res.status(200).json({ success: true, completedLessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
