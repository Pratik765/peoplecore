require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const user = require("./models/user");
const verifyToken = require("./middleware/verifyToken");
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 5004;
//! Database connection
connectDB();

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.url, req.method);
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

    const existingUser = await user.findById(userId).select("-password");

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
    const { id, name, email } = req.body;
    console.log(id, name, email);
    const updatedUser = await user
      .findByIdAndUpdate(id, { name, email }, { new: true })
      .select("-password");
    res.status(200).json({
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
