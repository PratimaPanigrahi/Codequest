import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Roadmap title is required'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    version: {
      type: Number,
      default: 1, // Feature 7: Versioning
    },
    previousVersions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roadmap',
      },
    ],
    lessons: [
      {
        lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        order: { type: Number, required: true },
        difficulty: {
          type: String,
          enum: ['Easy', 'Medium', 'Hard'],
          default: 'Medium',
        },
      },
    ],
    rewards: [
      {
        type: {
          type: String, // Feature 8: Gamification
          enum: ['badge', 'points'],
          required: true,
        },
        value: { type: Number, required: true },
        description: { type: String },
      },
    ],
    isFree: { type: Boolean, default: true }, // Feature 9: Enrollment
    maxEnrollments: { type: Number },
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Feature 10: Comments
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
