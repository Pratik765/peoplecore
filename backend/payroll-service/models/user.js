const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "HR", "EMPLOYEE"],
      default: "EMPLOYEE",
    },
    department: {
      type: String,
      default: "Engineering",
    },
    designation: {
      type: String,
      default: "Software Engineer",
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true, strict: false }
);

delete mongoose.models.PayrollUser;
module.exports = mongoose.model("PayrollUser", userSchema, "users");
