require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const connectDB = require("./config/db");
const user = require("./models/user");
const verifyToken = require("./middleware/verifyToken");
const authorizeRoles = require("./middleware/authorizeRoles");
const requestLogger = require("./middleware/accessLogger");
const errorLogger = require("./middleware/errorLogger");
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "peoplecore_dev_jwt_secret";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5004";

const createUserProfile = async (profile) => {
  try {
    const res = await fetch(`${USER_SERVICE_URL}/internal/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) {
      console.error("[AuthService] Failed to create user profile:", await res.text());
    }
  } catch (err) {
    console.error("[AuthService] User profile creation error:", err.message);
  }
};

connectDB();

//! Middlewares
app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "auth-service",
    status: "UP",
    timestamp: new Date().toLocaleString(),
  });
});
//! Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Request body:", req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await user.create({
      name,
      email,
      password: hashedPass,
    });
    await createUserProfile({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      isActive: newUser.isActive,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//! Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (existingUser.status != "ACCEPTED") {
      return res.status(403).json({ message: "Account pending approval" });
    }
    if (!existingUser.isActive) {
      return res.status(403).json({
        message: "Account is disabled",
      });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        userId: existingUser._id,
        role: existingUser.role,
      },
      process.env.JWT_SECRET || JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(200).json({
      token,
      user: {
        name: existingUser.name,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

app.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await user.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(existingUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── INTERNAL INTER-SERVICE ENDPOINTS (NO JWT REQUIRED) ───

// PUT /internal/users/:id/approve — Used by admin-service
app.put("/internal/users/:id/approve", async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await user.findByIdAndUpdate(
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
    const updated = await user.findByIdAndUpdate(
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

app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
