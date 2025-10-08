import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String },
});

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, required: true }, // easy, intermediate, hard
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  levels: [levelSchema],
}, {
  timestamps: true,
});

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
