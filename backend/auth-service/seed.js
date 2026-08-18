require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Schema for auth-service (pc_auth_db)
const authUserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["ADMIN", "HR", "EMPLOYEE"], default: "EMPLOYEE" },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" },
    phone: { type: String, default: "" },
    department: { type: String, default: "Engineering" },
    designation: { type: String, default: "Software Engineer" },
    joinDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
    location: { type: String, default: "Pune, Maharashtra" },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

// Schema for user-service (pc_user_db)
const userProfileSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    role: { type: String, enum: ["ADMIN", "HR", "EMPLOYEE"], default: "EMPLOYEE" },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" },
    phone: { type: String, default: "" },
    department: { type: String, default: "Engineering" },
    designation: { type: String, default: "Software Engineer" },
    joinDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
    location: { type: String, default: "Pune, Maharashtra" },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

/**
 * Build per-service MongoDB URI from the base MONGO_URI env var.
 * Supports both Atlas (mongodb+srv://) and local (mongodb://) URIs.
 */
function getServiceUri(baseUri, dbName) {
  if (!baseUri) return `mongodb://127.0.0.1:27017/${dbName}`;
  if (baseUri.includes("?")) {
    const [prefix, query] = baseUri.split("?");
    const clean = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
    return `${clean}/${dbName}?${query}`;
  }
  return baseUri.endsWith("/") ? `${baseUri}${dbName}` : `${baseUri}/${dbName}`;
}

async function seed() {
  const BASE_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
  const authUri = getServiceUri(BASE_URI, "pc_auth_db");
  const userUri = getServiceUri(BASE_URI, "pc_user_db");

  const authConn = await mongoose.createConnection(authUri).asPromise();
  const userConn = await mongoose.createConnection(userUri).asPromise();

  console.log("Connected to pc_auth_db and pc_user_db for seeding...");

  const AuthUser = authConn.model("User", authUserSchema, "users");
  const UserProfile = userConn.model("EmployeeProfile", userProfileSchema, "users");

  // Hash passwords
  const pratikPass = await bcrypt.hash("pratik@123", 10);
  const meghnaPass = await bcrypt.hash("meghna@123", 10);
  const arjunPass = await bcrypt.hash("arjun@123", 10);
  const defaultPass = await bcrypt.hash("Password@123", 10);

  // Clear existing
  await AuthUser.deleteMany({});
  await UserProfile.deleteMany({});

  // Dynamic join dates (relative to today)
  const today = new Date();
  const daysAgo = (d) => {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    return date.toISOString().split("T")[0];
  };

  const users = [
    // ─── ADMIN ───
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Pratik Kamble",
      email: "pratik.kamble@peoplecore.in",
      password: pratikPass,
      role: "ADMIN",
      isActive: true,
      status: "ACCEPTED",
      department: "Executive",
      designation: "Founder & CTO",
      location: "Pune, Maharashtra",
      phone: "+91 98230 44556",
      bio: "Full-stack engineer and founder of PeopleCore. Passionate about building scalable microservice architectures.",
      joinDate: daysAgo(365),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Vikramaditya Rao",
      email: "vikram.rao@peoplecore.in",
      password: defaultPass,
      role: "ADMIN",
      isActive: true,
      status: "ACCEPTED",
      department: "Operations",
      designation: "VP of Operations",
      location: "Hyderabad, Telangana",
      phone: "+91 94400 99001",
      bio: "Scaling organizational workflows and infrastructure for enterprise efficiency.",
      joinDate: daysAgo(320),
    },

    // ─── HR ───
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Meghna Kulkarni",
      email: "meghna.kulkarni@peoplecore.in",
      password: meghnaPass,
      role: "HR",
      isActive: true,
      status: "ACCEPTED",
      department: "Human Resources",
      designation: "HR Operations Lead",
      location: "Pune, Maharashtra",
      phone: "+91 98450 33445",
      bio: "Dedicated HR professional focused on talent acquisition, employee wellbeing, and organizational culture.",
      joinDate: daysAgo(290),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Sneha Joshi",
      email: "sneha.joshi@peoplecore.in",
      password: defaultPass,
      role: "HR",
      isActive: true,
      status: "ACCEPTED",
      department: "Human Resources",
      designation: "Talent Acquisition Specialist",
      location: "Mumbai, Maharashtra",
      phone: "+91 98220 22334",
      bio: "Connecting top engineering talent with opportunities at PeopleCore.",
      joinDate: daysAgo(240),
    },

    // ─── EMPLOYEES ───
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Arjun Patil",
      email: "arjun.patil@peoplecore.in",
      password: arjunPass,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
      department: "Engineering",
      designation: "Senior Software Engineer",
      location: "Bengaluru, Karnataka",
      phone: "+91 97110 55667",
      bio: "Full stack developer specializing in Node.js, React, and distributed systems.",
      joinDate: daysAgo(200),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Aarti Deshmukh",
      email: "aarti.deshmukh@peoplecore.in",
      password: defaultPass,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
      department: "Engineering",
      designation: "Frontend Engineer",
      location: "Pune, Maharashtra",
      phone: "+91 98900 77889",
      bio: "Creating accessible, pixel-perfect user experiences with modern React and CSS.",
      joinDate: daysAgo(180),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Rohan Mehta",
      email: "rohan.mehta@peoplecore.in",
      password: defaultPass,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
      department: "Product Design",
      designation: "Senior UI/UX Designer",
      location: "Delhi NCR",
      phone: "+91 98100 44556",
      bio: "Design thinker obsessed with user empathy, micro-interactions, and design systems.",
      joinDate: daysAgo(150),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Kavitha Iyer",
      email: "kavitha.iyer@peoplecore.in",
      password: defaultPass,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
      department: "Engineering",
      designation: "DevOps Engineer",
      location: "Chennai, Tamil Nadu",
      phone: "+91 98400 66778",
      bio: "Automating CI/CD pipelines, Kubernetes clusters, and cloud infrastructure at scale.",
      joinDate: daysAgo(130),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Siddharth Nair",
      email: "siddharth.nair@peoplecore.in",
      password: defaultPass,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
      department: "Engineering",
      designation: "Backend Engineer",
      location: "Kochi, Kerala",
      phone: "+91 94470 88990",
      bio: "Building robust APIs and microservices with Node.js and MongoDB.",
      joinDate: daysAgo(100),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Tanvi Sharma",
      email: "tanvi.sharma@peoplecore.in",
      password: defaultPass,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
      department: "Marketing",
      designation: "Growth Marketing Manager",
      location: "Mumbai, Maharashtra",
      phone: "+91 99200 11234",
      bio: "Data-driven marketing strategist driving brand awareness and user engagement.",
      joinDate: daysAgo(80),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Omkar Bhosale",
      email: "omkar.bhosale@peoplecore.in",
      password: defaultPass,
      role: "EMPLOYEE",
      isActive: true,
      status: "ACCEPTED",
      department: "Finance",
      designation: "Financial Analyst",
      location: "Pune, Maharashtra",
      phone: "+91 98230 67890",
      bio: "Managing financial planning, budgeting, and payroll analytics for the organization.",
      joinDate: daysAgo(60),
    },

    // ─── PENDING (awaiting approval) ───
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Neha Mukherjee",
      email: "neha.mukherjee@peoplecore.in",
      password: defaultPass,
      role: "EMPLOYEE",
      isActive: true,
      status: "PENDING",
      department: "Quality Assurance",
      designation: "QA Engineer",
      location: "Kolkata, West Bengal",
      phone: "+91 98300 12345",
      bio: "New hire awaiting HR account approval.",
      joinDate: daysAgo(5),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Rajesh Gupta",
      email: "rajesh.gupta@peoplecore.in",
      password: defaultPass,
      role: "EMPLOYEE",
      isActive: true,
      status: "PENDING",
      department: "Engineering",
      designation: "Junior Backend Developer",
      location: "Jaipur, Rajasthan",
      phone: "+91 98290 54321",
      bio: "Fresh graduate eager to contribute to core backend services.",
      joinDate: daysAgo(2),
    },
  ];

  // Insert into auth database (with passwords)
  await AuthUser.create(users);

  // Insert into user database (without passwords)
  const profileDocs = users.map(({ password, ...rest }) => rest);
  await UserProfile.create(profileDocs);

  console.log(`Successfully seeded ${users.length} users into pc_auth_db and pc_user_db!`);
  console.log(`\nAdmin login: pratik.kamble@peoplecore.in / pratik@123`);
  console.log(`HR login:    meghna.kulkarni@peoplecore.in / meghna@123`);
  console.log(`EMP login:   arjun.patil@peoplecore.in / arjun@123`);

  await authConn.close();
  await userConn.close();
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
