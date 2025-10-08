import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    isVerified: {
      type: Boolean,
      default: false, // New users must verify email before login
    },
    verificationToken: {
      type: String, // For email verification link
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'], // Future-proof roles
      default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Expire in 1 hour
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
