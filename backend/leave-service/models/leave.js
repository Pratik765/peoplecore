const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    lrid: {
      type: String,
      unique: true,
      required: true,
    },
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
    leaveType: {
      type: String,
      enum: ["Paid Annual Leave", "Sick Leave", "Casual Leave", "Emergency Leave"],
      default: "Paid Annual Leave",
    },
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    totalDays: {
      type: Number,
      default: 1,
    },
    remark: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedByName: {
      type: String,
    },
    reviewedAt: {
      type: Date,
    },
    applied_at: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
