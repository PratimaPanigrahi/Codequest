import Lesson from "../models/lesson.js";

// Add a new lesson
export const addLesson = async (req, res) => {
  try {
    const { title, difficulty } = req.body;

    if (!title || !difficulty) {
      return res.status(400).json({ message: "Title and difficulty are required" });
    }

    const lesson = new Lesson({
      title,
      difficulty,
      author: req.user._id, // admin's ID
      levels: [],
    });

    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    console.error("Error adding lesson:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a level to an existing lesson
export const addLevel = async (req, res) => {
  try {
    const { lessonId, number, title, content } = req.body;

    if (!lessonId || !number || !title) {
      return res.status(400).json({ message: "Lesson ID, level number, and title are required" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    lesson.levels.push({ number, title, content });
    await lesson.save();

    res.status(201).json(lesson);
  } catch (error) {
    console.error("Error adding level:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete lesson
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    await lesson.remove();
    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete level
export const deleteLevel = async (req, res) => {
  try {
    const { id, levelNumber } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    lesson.levels = lesson.levels.filter(l => l.number != levelNumber);
    await lesson.save();

    res.json({ message: "Level deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all lessons
export const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().populate("author", "name email");
    res.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
