const mongoose = require("mongoose");
const Announcement = require("./models/announcement");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  status: String,
});

async function seedAnnouncements() {
  try {
    const userConn = await mongoose.createConnection("mongodb://127.0.0.1:27017/pc_user_db").asPromise();
    await mongoose.connect("mongodb://127.0.0.1:27017/pc_admin_db");
    console.log("Admin Service: Connected to pc_admin_db for seeding announcements...");

    const User = userConn.model("EmployeeProfile", userSchema, "users");

    // Find Admin and HR users to set as posters
    const adminUser = await User.findOne({ role: "ADMIN" });
    const hrUser = await User.findOne({ role: "HR" });

    if (!adminUser) {
      console.log("Admin user not found in pc_user_db. Please seed users first.");
      process.exit(0);
    }

    // Clear existing announcements
    await Announcement.deleteMany({});
    console.log("Cleared old announcements in pc_admin_db.");

    const announcements = [
      {
        title: "📌 Annual Company Retreat 2026",
        content: "We are excited to announce our Annual Team Retreat in Goa from Oct 15th to Oct 18th! All travel arrangements and accommodation will be sponsored by PeopleCore. Further details regarding itinerary and RSVP forms will be shared shortly.",
        priority: "EVENT",
        isPinned: true,
        postedBy: adminUser._id,
        postedByName: adminUser.name,
        postedByRole: "ADMIN",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hrs ago
      },
      {
        title: "🚨 Updated Work From Home & Hybrid Guidelines",
        content: "Please review the updated HR policy regarding flexible hybrid working hours. All team leads must submit monthly remote work schedules by the 25th of every month. For any clarifications, reach out to HR.",
        priority: "URGENT",
        isPinned: true,
        postedBy: hrUser ? hrUser._id : adminUser._id,
        postedByName: hrUser ? hrUser.name : adminUser.name,
        postedByRole: hrUser ? "HR" : "ADMIN",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        title: "💡 Health & Wellness Benefits Enhancement",
        content: "Starting next month, our comprehensive corporate health insurance coverage is expanding to include mental wellness consultations, annual full-body checkups, and gym membership reimbursements up to ₹25,000/year.",
        priority: "INFO",
        isPinned: false,
        postedBy: hrUser ? hrUser._id : adminUser._id,
        postedByName: hrUser ? hrUser.name : adminUser.name,
        postedByRole: hrUser ? "HR" : "ADMIN",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      },
    ];

    await Announcement.insertMany(announcements);
    console.log(`Successfully seeded ${announcements.length} announcements into pc_admin_db!`);

    await userConn.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedAnnouncements();
