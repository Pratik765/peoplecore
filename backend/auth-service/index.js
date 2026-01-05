require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const user = require("./models/user");
const verifyToken = require("./middleware/verifyToken");
const authorizeRoles = require("./middleware/authorizeRoles");
const PORT = process.env.PORT || 5001;

//! Database connection
connectDB();

//! Middlewares
app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});
app.use(express.json());
app.use("/api", router);

//! Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
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
app.post("/api/login", async (req, res) => {
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
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//! Protected routes
router.use(verifyToken);
router.get("/admin/users", authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const users = await user.find().select("-password");
    res.status(200).json({ users, length: users.length });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
  "/admin/account-approval",
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const pendingUsers = await user
        .find({ status: "PENDING" })
        .select("-password");
      res.status(200).json({ pendingUsers, length: pendingUsers.length });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.put(
  "/admin/approve-user/:id",
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (!id || !role) {
        return res.status(400).json({
          message: "Id or role is not provided",
        });
      }
      const allowedRoles = ["ADMIN", "HR", "EMPLOYEE"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role provided",
        });
      }

      const updatedUser = await user
        .findByIdAndUpdate(
          id,
          { role, status: "ACCEPTED" },
          { new: true, runValidators: true }
        )
        .select("-password");
      res
        .status(200)
        .json({ message: "User approved successfully", updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
