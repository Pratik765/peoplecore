require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/verifyToken");
const Notification = require("./models/notification");

const app = express();
const PORT = process.env.PORT || 5005;

//! Database connection
connectDB();

//! Middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

//! Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "notification-service",
    status: "UP",
    timestamp: new Date().toLocaleString(),
  });
});

// ─── All routes below require authentication ───
app.use(verifyToken);

// ─── GET /notifications ───
// Returns all notifications for the logged-in user (newest first)
app.get("/notifications", async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── GET /notifications/unread-count ───
// Returns the count of unread notifications for badge display
app.get("/notifications/unread-count", async (req, res) => {
  try {
    const userId = req.user.userId;
    const count = await Notification.countDocuments({ userId, isRead: false });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting unread:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── PUT /notifications/read-all ───
// Mark ALL notifications as read for the logged-in user
app.put("/notifications/read-all", async (req, res) => {
  try {
    const userId = req.user.userId;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all read:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── DELETE /notifications/clear-all ───
// Delete ALL notifications for the logged-in user
app.delete("/notifications/clear-all", async (req, res) => {
  try {
    const userId = req.user.userId;
    await Notification.deleteMany({ userId });
    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── PUT /notifications/:id/read ───
// Mark a single notification as read
app.put("/notifications/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error marking read:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── DELETE /notifications/:id ───
// Delete a single notification
app.delete("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const notification = await Notification.findOneAndDelete({ _id: id, userId });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── POST /notifications ───
// Create a new notification (used internally by other services)
app.post("/notifications", async (req, res) => {
  try {
    const { userId, type, title, message, metadata } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        message: "userId, type, title, and message are required",
      });
    }

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      metadata: metadata || {},
    });

    res.status(201).json({ message: "Notification created", notification });
  } catch (error) {
    console.error("Error creating notification:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Notification Service running at http://localhost:${PORT}`);
});
