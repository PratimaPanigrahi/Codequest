// backend/seedLessons.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Lesson from "./models/Lesson.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/codequest";

// Replace this with your actual admin user ID from MongoDB
const ADMIN_ID = "68b701f6821a7a146ee62070";

const lessonsData = [
  {
    difficulty: "Beginner",
    title: "Beginner Lessons",
    author: ADMIN_ID,
    levels: [
      { title: "Beginner Level 1", slide: "slide_1.html" },
      { title: "Beginner Level 2", slide: "slide_2.html" },
      { title: "Beginner Level 3", slide: "slide_3.html" },
    ],
  },
  {
    difficulty: "Intermediate",
    title: "Intermediate Lessons",
    author: ADMIN_ID,
    levels: [
      { title: "Intermediate Level 4", slide: "slide_4.html" },
      { title: "Intermediate Level 5", slide: "slide_5.html" },
      { title: "Intermediate Level 6", slide: "slide_6.html" },
    ],
  },
  {
    difficulty: "Advanced",
    title: "Advanced Lessons",
    author: ADMIN_ID,
    levels: [
      { title: "Advanced Level 7", slide: "slide_7.html" },
      { title: "Advanced Level 8", slide: "slide_8.html" },
      { title: "Advanced Level 9", slide: "slide_9.html" },
    ],
  },
];

const seedLessons = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    // Remove existing lessons
    await Lesson.deleteMany();
    console.log("Old lessons deleted");

    // Insert new lessons
    const inserted = await Lesson.insertMany(lessonsData);
    console.log("Lessons seeded:", inserted.length);

    mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error("Error seeding lessons:", err);
    mongoose.disconnect();
  }
};

seedLessons();
