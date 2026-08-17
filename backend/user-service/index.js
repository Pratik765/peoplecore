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

// ─── INTERNAL INTER-SERVICE ENDPOINTS (NO JWT REQUIRED) ───

// POST /internal/users — Used by auth-service on registration
app.post("/internal/users", async (req, res) => {
  try {
    const profile = await User.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Profile already exists" });
    }
    res.status(500).json({ message: error.message });
  }
});

// PUT /internal/users/:id/approve — Used by admin-service
app.put("/internal/users/:id/approve", async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role, status: "ACCEPTED" },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /internal/users/:id/reject — Used by admin-service
app.put("/internal/users/:id/reject", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { status: "REJECTED" },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /internal/users/:id — Used by leave, attendance, payroll, admin
app.get("/internal/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name email role department designation status phone location bio avatar")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /internal/users?role=ADMIN,HR  OR  ?status=ACCEPTED
// Used by leave-service (find HR users), attendance-service (count active users), payroll, admin
app.get("/internal/users", async (req, res) => {
  try {
    const query = {};
    if (req.query.role) query.role = { $in: req.query.role.split(",") };
    if (req.query.status) query.status = req.query.status;
    const users = await User.find(query)
      .select("_id name email role department designation status phone location bio avatar")
      .lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`User Service running at http://localhost:${PORT}`);
});
