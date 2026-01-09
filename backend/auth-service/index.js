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

//! Database connection
connectDB();

//! Middlewares
app.use(requestLogger);
app.use(errorLogger);
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

//! Register
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "auth-service",
    status: "UP",
    timestamp: new Date().toLocaleString(),
  });
});
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
    await user.create({
      name,
      email,
      password: hashedPass,
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
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      token,
      user: {
        name: existingUser.name,
        role: existingUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(5000).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
