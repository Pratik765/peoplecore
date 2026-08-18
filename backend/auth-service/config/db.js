const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pc_auth_db";

let isConnecting = false;

const connectDB = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) return;
  isConnecting = true;

  try {
    console.log(`[AuthService] Connecting to MongoDB: ${MONGO_URI.replace(/:([^@]+)@/, ":****@")}`);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("[AuthService] ✅ Connected to MongoDB successfully");
    isConnecting = false;
  } catch (err) {
    console.error("[AuthService] ❌ MongoDB Connection Error:", err.message);
    isConnecting = false;
    // Retry in 5 seconds
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("[AuthService] MongoDB disconnected. Reconnecting in 5s...");
  setTimeout(connectDB, 5000);
});

module.exports = connectDB;
