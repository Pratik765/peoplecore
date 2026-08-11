const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    checkIn: {
      type: String, // "09:15:23 AM"
      required: true,
    },
    checkOut: {
      type: String, // "06:30:10 PM" or null
      default: null,
    },
    checkInTimestamp: {
      type: Date,
      default: Date.now,
    },
    checkOutTimestamp: {
      type: Date,
      default: null,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["PRESENT", "HALF_DAY", "ABSENT", "LATE"],
      default: "PRESENT",
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent multiple attendance records for the same employee on the same date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
