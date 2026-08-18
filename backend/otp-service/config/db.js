const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pc_otp_db";

const connectDB = async () => {
  try {
    console.log(`[OtpService] Connecting to MongoDB: ${MONGO_URI.replace(/:([^@]+)@/, ":****@")}`);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("[OtpService] ✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("[OtpService] ❌ MongoDB Connection Error:", err.message);
  }
};

module.exports = connectDB;
