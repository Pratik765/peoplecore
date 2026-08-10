require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/verifyToken");
const authorizeRoles = require("./middleware/authorizeRoles");
const user = require("./models/user");
const Announcement = require("./models/announcement");
const requestLogger = require("./middleware/accessLogger");
const PORT = process.env.PORT || 5002;
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5005";

// Helper: Send a notification to the notification-service (fire-and-forget)
const sendNotification = async (token, { userId, type, title, message, metadata }) => {
  try {
    await fetch(`${NOTIFICATION_SERVICE_URL}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ userId, type, title, message, metadata }),
    });
  } catch (err) {
    console.log("Notification send failed (non-blocking):", err.message);
  }
};

//! Database connection
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
    service: "admin-service",
    status: "UP",
    timestamp: new Date().toLocaleString(),
  });
});

//! Protected routes
router.use(verifyToken);
router.get("/users", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const users = await user.find().select("-password");
    res.status(200).json({ users, length: users.length });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/account-approval", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const pendingUsers = await user
      .find({ status: "PENDING" })
      .select("-password");
    res.status(200).json({ pendingUsers, length: pendingUsers.length });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/approve-user/:id", authorizeRoles("ADMIN", "HR"), async (req, res) => {
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
    // Fire notification to the approved user
    sendNotification(req.headers.authorization, {
      userId: id,
      type: "ACCOUNT_APPROVED",
      title: "Account Approved! 🎉",
      message: `Your account has been approved with the role: ${role}. You can now log in and access the system.`,
      metadata: { role },
    });

    res
      .status(200)
      .json({ message: "User approved successfully", updatedUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/reject-user/:id", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Id is not provided",
      });
    }
    const updatedUser = await user
      .findByIdAndUpdate(
        id,
        { status: "REJECTED" },
        { new: true, runValidators: true }
      )
      .select("-password");
    // Fire notification to the rejected user
    sendNotification(req.headers.authorization, {
      userId: id,
      type: "ACCOUNT_REJECTED",
      title: "Registration Request Declined",
      message: "Your registration request has been reviewed and declined by the administrator.",
      metadata: {},
    });

    res
      .status(200)
      .json({ message: "Request rejected successfully", updatedUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── ANNOUNCEMENTS ENDPOINTS ───

// GET /announcements — All authenticated users can view
router.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ isPinned: -1, createdAt: -1 })
      .lean();
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /announcements — Only ADMIN and HR can create
router.post("/announcements", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const { title, content, priority, isPinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const poster = await user.findById(req.user.userId).select("name role");

    const announcement = await Announcement.create({
      title,
      content,
      priority: priority || "INFO",
      isPinned: isPinned || false,
      postedBy: req.user.userId,
      postedByName: poster?.name || "Admin / HR",
      postedByRole: poster?.role || req.user.role,
    });

    // Notify all accepted users about new announcement
    try {
      const allUsers = await user.find({ status: "ACCEPTED" }).select("_id");
      const token = req.headers.authorization;
      for (const u of allUsers) {
        sendNotification(token, {
          userId: u._id,
          type: "ANNOUNCEMENT",
          title: `📢 ${title}`,
          message: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
          metadata: { announcementId: announcement._id },
        });
      }
    } catch (notifErr) {
      console.log("Announcement notification error:", notifErr.message);
    }

    res.status(201).json({ message: "Announcement posted successfully", announcement });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /announcements/:id — Only ADMIN and HR can edit
router.put("/announcements/:id", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, priority, isPinned } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { title, content, priority, isPinned },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json({ message: "Announcement updated", announcement });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /announcements/:id — Only ADMIN and HR can delete
router.delete("/announcements/:id", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /announcements/:id/pin — Toggle pin status
router.put("/announcements/:id/pin", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    announcement.isPinned = !announcement.isPinned;
    await announcement.save();
    res.status(200).json({
      message: `Announcement ${announcement.isPinned ? "pinned" : "unpinned"}`,
      announcement,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
