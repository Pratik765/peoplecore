const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pc_auth_db";

const connectDB = async () => {
  try {
    console.log(`[AuthService] Connecting to MongoDB: ${MONGO_URI.replace(/:([^@]+)@/, ":****@")}`);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("[AuthService] ✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("[AuthService] ❌ MongoDB Connection Error:", err.message);
  }
};

module.exports = connectDB;
