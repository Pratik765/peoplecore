const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = path.resolve(__dirname, "..");
const JWT_SECRET = process.env.JWT_SECRET || "peoplecore_production_jwt_secret";
const PUBLIC_PORT = process.env.PORT || 5000;
const RAW_MONGO_URI = process.env.MONGO_URI || process.env.MONGO_BASE_URI || "mongodb://127.0.0.1:27017";

// Run seed script on startup (safe - seed.js uses upsert/skip if admin exists)
console.log("🌱 Running database seed...");
try {
  execSync(`node ${path.join(root, "backend/auth-service/seed.js")}`, {
    stdio: "inherit",
    env: { ...process.env, MONGO_URI: RAW_MONGO_URI },
  });
  console.log("✅ Database seed completed.");
} catch (err) {
  console.warn("⚠️  Seed script failed (this is OK if already seeded):", err.message);
}

/**
 * Formats a base MongoDB URI into a per-service database URI.
 * Handles both standard `mongodb://` and Atlas `mongodb+srv://` URIs.
 */
function getServiceMongoUri(baseUri, dbName) {
  if (!baseUri) return `mongodb://127.0.0.1:27017/${dbName}`;
  try {
    if (baseUri.includes("?")) {
      const [prefix, query] = baseUri.split("?");
      const cleanPrefix = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
      return `${cleanPrefix}/${dbName}?${query}`;
    }
    return baseUri.endsWith("/") ? `${baseUri}${dbName}` : `${baseUri}/${dbName}`;
  } catch {
    return `${baseUri}/${dbName}`;
  }
}

const services = [
  {
    name: "auth-service",
    dir: "backend/auth-service",
    env: {
      PORT: "5001",
      MONGO_URI: getServiceMongoUri(RAW_MONGO_URI, "pc_auth_db"),
      JWT_SECRET,
      USER_SERVICE_URL: "http://127.0.0.1:5004",
    },
  },
  {
    name: "admin-service",
    dir: "backend/admin-service",
    env: {
      PORT: "5002",
      MONGO_URI: getServiceMongoUri(RAW_MONGO_URI, "pc_admin_db"),
      JWT_SECRET,
      USER_SERVICE_URL: "http://127.0.0.1:5004",
      AUTH_SERVICE_URL: "http://127.0.0.1:5001",
      NOTIFICATION_SERVICE_URL: "http://127.0.0.1:5005",
    },
  },
  {
    name: "otp-service",
    dir: "backend/otp-service",
    env: {
      PORT: "5003",
      MONGO_URI: getServiceMongoUri(RAW_MONGO_URI, "pc_otp_db"),
      JWT_SECRET,
    },
  },
  {
    name: "user-service",
    dir: "backend/user-service",
    env: {
      PORT: "5004",
      MONGO_URI: getServiceMongoUri(RAW_MONGO_URI, "pc_user_db"),
      JWT_SECRET,
    },
  },
  {
    name: "notification-service",
    dir: "backend/notification-service",
    env: {
      PORT: "5005",
      MONGO_URI: getServiceMongoUri(RAW_MONGO_URI, "pc_notification_db"),
      JWT_SECRET,
    },
  },
  {
    name: "leave-service",
    dir: "backend/leave-service",
    env: {
      PORT: "5006",
      MONGO_URI: getServiceMongoUri(RAW_MONGO_URI, "pc_leave_db"),
      JWT_SECRET,
      USER_SERVICE_URL: "http://127.0.0.1:5004",
      NOTIFICATION_SERVICE_URL: "http://127.0.0.1:5005",
    },
  },
  {
    name: "attendance-service",
    dir: "backend/attendance-service",
    env: {
      PORT: "5007",
      MONGO_URI: getServiceMongoUri(RAW_MONGO_URI, "pc_attendance_db"),
      JWT_SECRET,
      USER_SERVICE_URL: "http://127.0.0.1:5004",
      NOTIFICATION_SERVICE_URL: "http://127.0.0.1:5005",
    },
  },
  {
    name: "payroll-service",
    dir: "backend/payroll-service",
    env: {
      PORT: "5008",
      MONGO_URI: getServiceMongoUri(RAW_MONGO_URI, "pc_payroll_db"),
      JWT_SECRET,
      USER_SERVICE_URL: "http://127.0.0.1:5004",
      NOTIFICATION_SERVICE_URL: "http://127.0.0.1:5005",
    },
  },
  {
    name: "api-gateway",
    dir: "backend/api-gateway",
    env: {
      PORT: String(PUBLIC_PORT),
      JWT_SECRET,
      AUTH_SERVICE_URL: "http://127.0.0.1:5001",
      ADMIN_SERVICE_URL: "http://127.0.0.1:5002",
      OTP_SERVICE_URL: "http://127.0.0.1:5003",
      USER_SERVICE_URL: "http://127.0.0.1:5004",
      NOTIFICATION_SERVICE_URL: "http://127.0.0.1:5005",
      LEAVE_SERVICE_URL: "http://127.0.0.1:5006",
      ATTENDANCE_SERVICE_URL: "http://127.0.0.1:5007",
      PAYROLL_SERVICE_URL: "http://127.0.0.1:5008",
    },
  },
];

console.log("🚀 Launching PeopleCore Backend on Render...");
console.log(`🌐 Public Port: ${PUBLIC_PORT}`);

const runningProcesses = [];

for (const svc of services) {
  const svcDir = path.join(root, svc.dir);
  const svcEnv = { ...process.env, ...svc.env };

  const child = spawn("node", ["index.js"], {
    cwd: svcDir,
    env: svcEnv,
    stdio: "inherit",
  });

  child.on("error", (err) => {
    console.error(`❌ [${svc.name}] Failed to start:`, err.message);
  });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`⚠️ [${svc.name}] Process exited with code ${code}`);
    }
  });

  runningProcesses.push(child);
  console.log(`✅ [${svc.name}] started on port ${svc.env.PORT}`);
}

process.on("SIGTERM", () => {
  console.log("Stopping all services...");
  runningProcesses.forEach((p) => p.kill("SIGTERM"));
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Stopping all services...");
  runningProcesses.forEach((p) => p.kill("SIGINT"));
  process.exit(0);
});
