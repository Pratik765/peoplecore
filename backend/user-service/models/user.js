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
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["ADMIN", "HR", "EMPLOYEE"],
      default: "EMPLOYEE",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
    phone: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "Engineering",
    },
    designation: {
      type: String,
      default: "Software Engineer",
    },
    joinDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    location: {
      type: String,
      default: "Bengaluru, India",
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, strict: false }
);

delete mongoose.models.EmployeeProfile;
delete mongoose.models.User;
delete mongoose.models.UserProfile;

module.exports = mongoose.model("EmployeeProfile", userSchema, "users");
