require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const User = require("./models/user");
const verifyToken = require("./middleware/verifyToken");
const cors = require("cors");

app.use(cors());
// Increased body size limit for base64 profile pictures
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const PORT = process.env.PORT || 5004;

//! Database connection
connectDB();

app.use((req, res, next) => {
  console.log(`[UserService] ${req.method} ${req.url}`);
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "user-service",
    status: "UP",
    timestamp: new Date().toLocaleString(),
  });
});

app.get("/user/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const existingUser = await User.findById(userId).select("-password").lean();

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(existingUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/user/update", verifyToken, async (req, res) => {
  try {
    console.log("UPDATE REQ BODY:", req.body);
    const userId = req.body.id || req.user.userId;
    const { name, email, phone, department, designation, joinDate, location, bio, avatar } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (department !== undefined) updateFields.department = department;
    if (designation !== undefined) updateFields.designation = designation;
    if (joinDate !== undefined) updateFields.joinDate = joinDate;
    if (location !== undefined) updateFields.location = location;
    if (bio !== undefined) updateFields.bio = bio;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true })
      .select("-password")
      .lean();

    res.status(200).json({
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`User Service running at http://localhost:${PORT}`);
});
