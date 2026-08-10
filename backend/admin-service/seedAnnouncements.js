const mongoose = require("mongoose");
const Announcement = require("./models/announcement");
const user = require("./models/user");

async function seedAnnouncements() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/peoplecore");
    console.log("Admin Service: Connected to MongoDB for seeding announcements...");

    // Find Admin and HR users to set as posters
    const adminUser = await user.findOne({ role: "ADMIN" });
    const hrUser = await user.findOne({ role: "HR" });

    if (!adminUser) {
      console.log("Admin user not found. Please seed users first.");
      process.exit(0);
    }

    // Clear existing announcements
    await Announcement.deleteMany({});
    console.log("Cleared old announcements.");

    const announcements = [
      {
        title: "📌 Annual Company Retreat 2026",
        content: "We are excited to announce our Annual Team Retreat in Goa from Oct 15th to Oct 18th! All travel arrangements and accommodation will be sponsored by PeopleCore. Further details regarding itinerary and RSVP forms will be shared shortly.",
        priority: "EVENT",
        isPinned: true,
        postedBy: adminUser._id,
        postedByName: adminUser.name || "Aditya Sharma",
        postedByRole: "ADMIN",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hrs ago
      },
      {
        title: "🚨 Updated Work From Home & Hybrid Guidelines",
        content: "Please review the updated HR policy regarding flexible hybrid working hours. All team leads must submit monthly remote work schedules by the 25th of every month. For any clarifications, reach out to HR.",
        priority: "URGENT",
        isPinned: true,
        postedBy: hrUser ? hrUser._id : adminUser._id,
        postedByName: hrUser ? hrUser.name : "Priya Patel",
        postedByRole: hrUser ? "HR" : "ADMIN",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        title: "🎉 Q3 All-Hands Meeting & Recognition Awards",
        content: "Join us this Friday at 4:00 PM IST for our Quarterly All-Hands Meeting. We will celebrate team achievements, highlight top performers, and discuss our Q4 product roadmap.",
        priority: "INFO",
        isPinned: false,
        postedBy: adminUser._id,
        postedByName: adminUser.name || "Aditya Sharma",
        postedByRole: "ADMIN",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      },
      {
        title: "💡 Health & Wellness Benefits Program",
        content: "Our updated employee health insurance policy now includes expanded dental & vision coverage along with free quarterly mental health consultations. Visit the HR portal or contact Priya Patel for policy enrollment.",
        priority: "INFO",
        isPinned: false,
        postedBy: hrUser ? hrUser._id : adminUser._id,
        postedByName: hrUser ? hrUser.name : "Priya Patel",
        postedByRole: hrUser ? "HR" : "ADMIN",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      },
    ];

    await Announcement.insertMany(announcements);
    console.log(`Successfully seeded ${announcements.length} realistic announcements in MongoDB!`);

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding announcements:", err.message);
    process.exit(1);
  }
}

seedAnnouncements();
