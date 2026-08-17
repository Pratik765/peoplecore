require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/verifyToken");
const authorizeRoles = require("./middleware/authorizeRoles");
const Attendance = require("./models/attendance");

const app = express();
const PORT = process.env.PORT || 5007;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5004";

// Interservice Helpers
const getUserById = async (userId) => {
  try {
    const res = await fetch(`${USER_SERVICE_URL}/internal/users/${userId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.error(`[AttendanceService] Error fetching user ${userId}:`, err.message);
  }
  return null;
};

const getActiveUsersCount = async () => {
  try {
    const res = await fetch(`${USER_SERVICE_URL}/internal/users?status=ACCEPTED`);
    if (res.ok) {
      const users = await res.json();
      if (users.length > 0) return users.length;
    }
    const allRes = await fetch(`${USER_SERVICE_URL}/internal/users`);
    if (allRes.ok) {
      const allUsers = await allRes.json();
      return allUsers.length;
    }
  } catch (err) {
    console.error(`[AttendanceService] Error fetching active users count:`, err.message);
  }
  return 0;
};

// Database connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[AttendanceService] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "attendance-service",
    status: "UP",
    timestamp: new Date().toLocaleString(),
  });
});

// All endpoints below require JWT
app.use(verifyToken);

// Helper: Format today's date "YYYY-MM-DD" in local timezone (not UTC)
const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper: Format Time string "09:15:00 AM"
const getTimeString = (dateObj = new Date()) => {
  return dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

// ─── POST /attendance/checkin (Daily Check-in) ───
app.post("/attendance/checkin", async (req, res) => {
  try {
    const todayStr = getTodayDateString();
    const userId = req.user.userId;

    // Check if already checked in today
    const existing = await Attendance.findOne({ employeeId: userId, date: todayStr });
    if (existing) {
      return res.status(400).json({
        message: `You have already checked in today at ${existing.checkIn}`,
        attendance: existing,
      });
    }

    const employee = await getUserById(userId);
    const now = new Date();
    const checkInTime = getTimeString(now);

    // Check if late (e.g. check-in after 9:30 AM local time)
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const isLate = hours > 9 || (hours === 9 && minutes > 30);

    const newAttendance = await Attendance.create({
      employeeId: userId,
      employeeName: employee?.name || "Employee",
      employeeEmail: employee?.email || "",
      date: todayStr,
      checkIn: checkInTime,
      checkInTimestamp: now,
      status: "PRESENT",
      isLate,
      remarks: isLate ? "Late Check-in" : "On Time",
    });

    res.status(201).json({
      message: `Checked in successfully at ${checkInTime}${isLate ? " (Late)" : ""}`,
      attendance: newAttendance,
    });
  } catch (error) {
    console.error("Check-in error:", error.message);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

// ─── PUT /attendance/checkout (Daily Check-out) ───
app.put("/attendance/checkout", async (req, res) => {
  try {
    const todayStr = getTodayDateString();
    const userId = req.user.userId;

    const existing = await Attendance.findOne({ employeeId: userId, date: todayStr });
    if (!existing) {
      return res.status(400).json({ message: "You have not checked in today yet." });
    }

    if (existing.checkOut) {
      return res.status(400).json({
        message: `You have already checked out today at ${existing.checkOut}`,
        attendance: existing,
      });
    }

    const now = new Date();
    const checkOutTime = getTimeString(now);
    const checkInTime = new Date(existing.checkInTimestamp);

    // Calculate total hours
    const diffMs = Math.max(now - checkInTime, 0);
    const totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    // Determine status (HALF_DAY if < 5 hours)
    let status = existing.status;
    if (totalHours < 5.0) {
      status = "HALF_DAY";
    }

    existing.checkOut = checkOutTime;
    existing.checkOutTimestamp = now;
    existing.totalHours = totalHours;
    existing.status = status;
    await existing.save();

    res.status(200).json({
      message: `Checked out successfully at ${checkOutTime}. Worked ${totalHours} hrs.`,
      attendance: existing,
    });
  } catch (error) {
    console.error("Check-out error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── GET /attendance/today (Fetch today's attendance for user) ───
app.get("/attendance/today", async (req, res) => {
  try {
    const todayStr = getTodayDateString();
    const userId = req.user.userId;

    const attendance = await Attendance.findOne({ employeeId: userId, date: todayStr });
    res.status(200).json(attendance || null);
  } catch (error) {
    console.error("Error fetching today attendance:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── GET /attendance/my (Fetch user's attendance history) ───
app.get("/attendance/my", async (req, res) => {
  try {
    const userId = req.user.userId;
    const history = await Attendance.find({ employeeId: userId }).sort({ date: -1, createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching my attendance:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── GET /attendance/all (Fetch all attendance records for Admin/HR) ───
app.get("/attendance/all", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const { date } = req.query;
    const query = {};
    if (date) {
      query.date = date;
    }
    const records = await Attendance.find(query).sort({ date: -1, createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching all attendance:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── GET /attendance/stats (Today's HR Stats Summary) ───
app.get("/attendance/stats", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const todayStr = getTodayDateString();
    const totalUsers = await getActiveUsersCount();
    const todayRecords = await Attendance.find({ date: todayStr });

    const present = todayRecords.filter((r) => r.status === "PRESENT").length;
    const late = todayRecords.filter((r) => r.isLate).length;
    const halfDay = todayRecords.filter((r) => r.status === "HALF_DAY").length;
    const checkedInCount = todayRecords.length;
    const absent = Math.max(totalUsers - checkedInCount, 0);

    res.status(200).json({
      totalUsers,
      present,
      late,
      halfDay,
      absent,
      date: todayStr,
    });
  } catch (error) {
    console.error("Error fetching attendance stats:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Attendance Service running at http://localhost:${PORT}`);
});
