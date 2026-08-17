require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pc_attendance_db";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Attendance Service connected to MongoDB");
  } catch (err) {
    console.log("DB Connection Error:", err.message);
  }
};

module.exports = connectDB;
