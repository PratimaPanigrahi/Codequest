// seedAdmin.js
import User from "./models/User.js";

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (!adminExists) {
      const admin = await User.create({
        name: "Admin",
        email: "admin@example.com",
        password: "admin123!",
        role: "admin",
        isAdmin: true,
        isVerified: true,
      });
      console.log("✅ Default admin created:", admin.email);
    } else {
      console.log("ℹ️ Admin already exists:", adminExists.email);
    }
  } catch (err) {
    console.error("❌ Error creating default admin:", err);
  }
};

export default createDefaultAdmin;
