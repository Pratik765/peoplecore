const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pc_user_db";

const connectDB = async () => {
  try {
    console.log(`[UserService] Connecting to MongoDB: ${MONGO_URI.replace(/:([^@]+)@/, ":****@")}`);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("[UserService] ✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("[UserService] ❌ MongoDB Connection Error:", err.message);
  }
};

module.exports = connectDB;
