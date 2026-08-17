const mongoose = require("mongoose");
const Notification = require("./models/notification");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  status: String,
});

async function seedNotifications() {
  try {
    const userConn = await mongoose.createConnection("mongodb://127.0.0.1:27017/pc_user_db").asPromise();
    await mongoose.connect("mongodb://127.0.0.1:27017/pc_notification_db");
    console.log("Notification Service: Connected to pc_notification_db for seeding...");

    const User = userConn.model("EmployeeProfile", userSchema, "users");
    const users = await User.find();

    if (!users || users.length === 0) {
      console.log("No users found in pc_user_db. Please seed users first.");
      process.exit(0);
    }

    // Clear existing notifications
    await Notification.deleteMany({});
    console.log("Cleared old notification documents.");

    // Find pending users dynamically for notification messages
    const pendingUsers = users.filter((u) => u.status === "PENDING");
    const employees = users.filter((u) => u.role === "EMPLOYEE" && u.status === "ACCEPTED");

    const newNotifications = [];

    for (const user of users) {
      if (user.role === "ADMIN") {
        newNotifications.push(
          {
            userId: user._id,
            type: "SYSTEM",
            title: "System Health Check ✅",
            message: "All PeopleCore microservices are operating normally.",
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
          },
          {
            userId: user._id,
            type: "SYSTEM",
            title: "New Registration Request 👤",
            message: pendingUsers.length > 0
              ? `${pendingUsers[0].name} has submitted an account registration request.`
              : "No new registration requests at the moment.",
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
          },
          {
            userId: user._id,
            type: "ANNOUNCEMENT",
            title: "📢 System Maintenance Scheduled",
            message: "Routine database maintenance will occur on Sunday at 2:00 AM IST.",
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          }
        );
      } else if (user.role === "HR") {
        const leaveRequester = employees.length > 0 ? employees[0].name : "an employee";
        newNotifications.push(
          {
            userId: user._id,
            type: "LEAVE_APPLIED",
            title: "📝 Leave Request Pending",
            message: `${leaveRequester} requested Paid Annual Leave for review.`,
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 45),
          },
          {
            userId: user._id,
            type: "SYSTEM",
            title: "Pending Onboarding Approvals",
            message: pendingUsers.length > 0
              ? `${pendingUsers.length} employee registration request(s) are waiting for approval.`
              : "All employee registrations are up to date.",
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
          }
        );
      } else {
        newNotifications.push(
          {
            userId: user._id,
            type: "SYSTEM",
            title: "Welcome to PeopleCore! 🎉",
            message: `Hi ${user.name.split(" ")[0]}, your employee portal is active. You can check attendance, apply for leave, and view payroll.`,
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          },
          {
            userId: user._id,
            type: "ANNOUNCEMENT",
            title: "📢 Annual Company Retreat",
            message: "We are excited to announce our Annual Team Retreat in Goa! Details will be shared shortly.",
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
          }
        );
      }
    }

    await Notification.insertMany(newNotifications);
    console.log(
      `Successfully seeded ${newNotifications.length} notification documents in pc_notification_db across ${users.length} users!`
    );

    await userConn.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedNotifications();
