const mongoose = require("mongoose");
const Notification = require("./models/notification");

// User schema inline for querying existing users from the shared database
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  status: String,
});
const User = mongoose.model("User", userSchema);

async function seedNotifications() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/peoplecore");
    console.log("Notification Service: Connected to MongoDB for seeding...");

    // Find all users in database
    const users = await User.find();
    if (!users || users.length === 0) {
      console.log("No users found in MongoDB. Please seed users first.");
      process.exit(0);
    }

    // Clear existing notifications
    await Notification.deleteMany({});
    console.log("Cleared old notification documents.");

    const newNotifications = [];

    for (const user of users) {
      if (user.role === "ADMIN") {
        newNotifications.push(
          {
            userId: user._id,
            type: "SYSTEM",
            title: "System Health Check ✅",
            message: "All 5 PeopleCore microservices are operating normally.",
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
          },
          {
            userId: user._id,
            type: "SYSTEM",
            title: "New Registration Request 👤",
            message: "New user Siddharth Joshi has submitted an account registration request.",
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          },
          {
            userId: user._id,
            type: "ANNOUNCEMENT",
            title: "📢 System Maintenance Scheduled",
            message: "Routine database maintenance will occur on Sunday at 2:00 AM IST.",
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          }
        );
      } else if (user.role === "HR") {
        newNotifications.push(
          {
            userId: user._id,
            type: "SYSTEM",
            title: "Leave Applications Pending ⏳",
            message: "3 new employee leave requests are awaiting HR review.",
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
          },
          {
            userId: user._id,
            type: "ACCOUNT_APPROVED",
            title: "HR Portal Activated 🎉",
            message: "Your HR Manager privileges have been enabled by Administration.",
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          },
          {
            userId: user._id,
            type: "ANNOUNCEMENT",
            title: "📢 HR Policy Update Published",
            message: "Updated hybrid work & attendance policy has been broadcasted to all employees.",
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          }
        );
      } else {
        // EMPLOYEE
        newNotifications.push(
          {
            userId: user._id,
            type: "ACCOUNT_APPROVED",
            title: "Welcome to PeopleCore! 🎉",
            message: "Your account registration has been approved by the Administrator. You now have full employee portal access.",
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
          },
          {
            userId: user._id,
            type: "LEAVE_APPROVED",
            title: "Leave Request Approved 🌴",
            message: "Your casual leave request for next Monday has been approved by HR.",
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          },
          {
            userId: user._id,
            type: "ANNOUNCEMENT",
            title: "📢 Company All-Hands Townhall",
            message: "Join us this Friday at 4 PM IST for the Q3 town hall and team recognitions.",
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          }
        );
      }
    }

    await Notification.insertMany(newNotifications);
    console.log(
      `Successfully seeded ${newNotifications.length} notification documents in MongoDB across ${users.length} users!`
    );

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding notifications:", err.message);
    process.exit(1);
  }
}

seedNotifications();
