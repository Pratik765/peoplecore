require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/verifyToken");
const authorizeRoles = require("./middleware/authorizeRoles");
const Leave = require("./models/leave");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 5006;
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5005";

// Helper: Fire-and-forget notification to notification-service
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

// Database connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[LeaveService] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "leave-service",
    status: "UP",
    timestamp: new Date().toLocaleString(),
  });
});

// Protected routes require valid JWT
app.use(verifyToken);

// ─── POST /leaves (Apply for leave) ───
app.post("/leaves", async (req, res) => {
  try {
    const { leaveType, start_date, end_date, remark } = req.body;

    if (!start_date || !end_date || !remark) {
      return res.status(400).json({ message: "Start date, end date, and reason are required" });
    }

    const employee = await User.findById(req.user.userId).select("name email role");

    // Calculate total days
    const s = new Date(start_date);
    const e = new Date(end_date);
    const diffTime = Math.abs(e - s);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 || 1;

    const lrid = `LR-${Date.now().toString().slice(-6)}`;

    const newLeave = await Leave.create({
      lrid,
      employeeId: req.user.userId,
      employeeName: employee?.name || "Employee",
      employeeEmail: employee?.email || "",
      leaveType: leaveType || "Paid Annual Leave",
      start_date,
      end_date,
      totalDays,
      remark,
      status: "PENDING",
      applied_at: new Date().toISOString().split("T")[0],
    });

    // Notify HR / Admins
    try {
      const hrUsers = await User.find({ role: { $in: ["ADMIN", "HR"] } }).select("_id");
      const token = req.headers.authorization;
      for (const hr of hrUsers) {
        sendNotification(token, {
          userId: hr._id,
          type: "LEAVE_APPLICATION",
          title: `📝 New Leave Application (${lrid})`,
          message: `${employee?.name || "An employee"} applied for ${totalDays} day(s) of ${leaveType || "leave"}.`,
          metadata: { leaveId: newLeave._id, lrid },
        });
      }
    } catch (notifErr) {
      console.log("Leave application notification error:", notifErr.message);
    }

    res.status(201).json({ message: "Leave request submitted successfully", leave: newLeave });
  } catch (error) {
    console.error("Error creating leave:", error.message);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

// ─── GET /leaves/my (Get logged-in user's leaves) ───
app.get("/leaves/my", async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching my leaves:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── GET /leaves/all (Get all leaves for Admin/HR) ───
app.get("/leaves/all", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching all leaves:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── PUT /leaves/:id/approve (Approve leave request) ───
app.put("/leaves/:id/approve", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const { id } = req.params;
    const reviewer = await User.findById(req.user.userId).select("name");

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        status: "APPROVED",
        reviewedBy: req.user.userId,
        reviewedByName: reviewer?.name || "HR/Admin",
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Send notification to employee
    sendNotification(req.headers.authorization, {
      userId: leave.employeeId,
      type: "LEAVE_APPROVED",
      title: "Leave Approved! ✅",
      message: `Your ${leave.leaveType} from ${leave.start_date} to ${leave.end_date} has been approved.`,
      metadata: { leaveId: leave._id, lrid: leave.lrid },
    });

    res.status(200).json({ message: "Leave request approved", leave });
  } catch (error) {
    console.error("Error approving leave:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── PUT /leaves/:id/reject (Reject leave request) ───
app.put("/leaves/:id/reject", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const { id } = req.params;
    const reviewer = await User.findById(req.user.userId).select("name");

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        status: "REJECTED",
        reviewedBy: req.user.userId,
        reviewedByName: reviewer?.name || "HR/Admin",
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Send notification to employee
    sendNotification(req.headers.authorization, {
      userId: leave.employeeId,
      type: "LEAVE_REJECTED",
      title: "Leave Request Declined ❌",
      message: `Your ${leave.leaveType} request from ${leave.start_date} to ${leave.end_date} was declined.`,
      metadata: { leaveId: leave._id, lrid: leave.lrid },
    });

    res.status(200).json({ message: "Leave request rejected", leave });
  } catch (error) {
    console.error("Error rejecting leave:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── DELETE /leaves/:id (Delete / Cancel leave request) ───
app.delete("/leaves/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Search by _id or lrid
    let leave = await Leave.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { lrid: id }],
    });

    if (!leave) {
      return res.status(404).json({ message: "Leave application not found" });
    }

    // Check ownership or admin role
    if (leave.employeeId.toString() !== req.user.userId && !["ADMIN", "HR"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Leave.findByIdAndDelete(leave._id);
    res.status(200).json({ message: "Leave application canceled successfully" });
  } catch (error) {
    console.error("Error deleting leave:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── Backward compatibility routes for existing frontend code ───
app.get("/api1/leaverequest/getById", async (req, res) => {
  try {
    const mongoid = req.query.mongoid || req.user?.userId;
    const leaves = await Leave.find({ employeeId: mongoid }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api1/leaverequest/delete", async (req, res) => {
  try {
    const lrid = req.query.lrid;
    await Leave.findOneAndDelete({ lrid });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Leave Service running at http://localhost:${PORT}`);
});
