import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./server.js";

dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
