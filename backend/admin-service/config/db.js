require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pc_admin_db";

const connectDB = async () => {
  try {
    console.log(`[AdminService] Connecting to MongoDB: ${MONGO_URI.replace(/:([^@]+)@/, ":****@")}`);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("[AdminService] ✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("[AdminService] ❌ MongoDB Connection Error:", err.message);
  }
};

module.exports = connectDB;
