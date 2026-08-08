const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    isActive: { type: Boolean, default: true },
    status: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

async function seed() {
  await mongoose.connect("mongodb://127.0.0.1:27017/peoplecore");
  console.log("Connected to MongoDB for seeding realistic Indian users...");

  // Default password hashes
  const defaultPasswordHash = await bcrypt.hash("Password@123", 10);
  const adityaPass = await bcrypt.hash("aditya123", 10);
  const priyaPass = await bcrypt.hash("priya123", 10);
  const rahulPass = await bcrypt.hash("rahul123", 10);

  // Clear existing users collection
  await User.deleteMany({});

  const realisticUsers = [
    {
      name: "Aditya Sharma",
      email: "aditya.sharma@peoplecore.in",
      password: adityaPass,
      role: "ADMIN",
      isActive: true,
      status: "ACCEPTED",
    },
    {
      name: "Priya Patel",
      email: "priya.patel@peoplecore.in",
      password: priyaPass,
      role: "HR",
      isActive: true,
      status: "ACCEPTED",
    },
    {
      name: "Rahul Verma",
      email: "rahul.verma@peoplecore.in",
      password: rahulPass,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
    },
    {
      name: "Ananya Deshmukh",
      email: "ananya.deshmukh@peoplecore.in",
      password: defaultPasswordHash,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
    },
    {
      name: "Vikramaditya Rao",
      email: "vikram.rao@peoplecore.in",
      password: defaultPasswordHash,
      role: "ADMIN",
      isActive: true,
      status: "ACCEPTED",
    },
    {
      name: "Sneha Kulkarni",
      email: "sneha.kulkarni@peoplecore.in",
      password: defaultPasswordHash,
      role: "HR",
      isActive: true,
      status: "ACCEPTED",
    },
    {
      name: "Rohan Mehta",
      email: "rohan.mehta@peoplecore.in",
      password: defaultPasswordHash,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
    },
    {
      name: "Kavya Iyer",
      email: "kavya.iyer@peoplecore.in",
      password: defaultPasswordHash,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
    },
    {
      name: "Arjun Singhania",
      email: "arjun.singhania@peoplecore.in",
      password: defaultPasswordHash,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
    },
    {
      name: "Neha Mukherjee",
      email: "neha.mukherjee@peoplecore.in",
      password: defaultPasswordHash,
      role: "EMPLOYEE",
      isActive: true,
      status: "PENDING",
    },
    {
      name: "Siddharth Joshi",
      email: "siddharth.joshi@peoplecore.in",
      password: defaultPasswordHash,
      role: "EMPLOYEE",
      isActive: true,
      status: "PENDING",
    },
    {
      name: "Tanvi Nair",
      email: "tanvi.nair@peoplecore.in",
      password: defaultPasswordHash,
      role: "EMPLOYEE",
      isActive: true,
      status: "PENDING",
    },
    {
      name: "Pooja Agarwal",
      email: "pooja.agarwal@peoplecore.in",
      password: defaultPasswordHash,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
    },
    {
      name: "Karan Malhotra",
      email: "karan.malhotra@peoplecore.in",
      password: defaultPasswordHash,
      role: "EMPLOYEE",
      isActive: false,
      status: "ACCEPTED",
    },
    {
      name: "Manish Sen",
      email: "manish.sen@peoplecore.in",
      password: defaultPasswordHash,
      role: "EMPLOYEE",
      isActive: false,
      status: "REJECTED",
    },
  ];

  await User.create(realisticUsers);

  console.log(`Successfully seeded ${realisticUsers.length} realistic Indian users into MongoDB!`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
