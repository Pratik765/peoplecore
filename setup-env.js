/**
 * Creates .env files for all backend services with sensible local defaults.
 * Run once: node setup-env.js
 */
const fs = require("fs");
const path = require("path");

const JWT_SECRET = "peoplecore_dev_jwt_secret";
const MONGO_BASE = "mongodb://127.0.0.1:27017";

const serviceEnvs = {
  "backend/api-gateway": {
    PORT: 5000,
  },
  "backend/auth-service": {
    PORT: 5001,
    MONGO_URI: `${MONGO_BASE}/pc_auth_db`,
    JWT_SECRET,
    USER_SERVICE_URL: "http://localhost:5004",
  },
  "backend/admin-service": {
    PORT: 5002,
    MONGO_URI: `${MONGO_BASE}/pc_admin_db`,
    JWT_SECRET,
    USER_SERVICE_URL: "http://localhost:5004",
    AUTH_SERVICE_URL: "http://localhost:5001",
    NOTIFICATION_SERVICE_URL: "http://localhost:5005",
  },
  "backend/otp-service": {
    PORT: 5003,
    MONGO_URI: `${MONGO_BASE}/pc_otp_db`,
    JWT_SECRET,
  },
  "backend/user-service": {
    PORT: 5004,
    MONGO_URI: `${MONGO_BASE}/pc_user_db`,
    JWT_SECRET,
  },
  "backend/notification-service": {
    PORT: 5005,
    MONGO_URI: `${MONGO_BASE}/pc_notification_db`,
    JWT_SECRET,
  },
  "backend/leave-service": {
    PORT: 5006,
    MONGO_URI: `${MONGO_BASE}/pc_leave_db`,
    JWT_SECRET,
    USER_SERVICE_URL: "http://localhost:5004",
    NOTIFICATION_SERVICE_URL: "http://localhost:5005",
  },
  "backend/attendance-service": {
    PORT: 5007,
    MONGO_URI: `${MONGO_BASE}/pc_attendance_db`,
    JWT_SECRET,
    USER_SERVICE_URL: "http://localhost:5004",
    NOTIFICATION_SERVICE_URL: "http://localhost:5005",
  },
  "backend/payroll-service": {
    PORT: 5008,
    MONGO_URI: `${MONGO_BASE}/pc_payroll_db`,
    JWT_SECRET,
    USER_SERVICE_URL: "http://localhost:5004",
    NOTIFICATION_SERVICE_URL: "http://localhost:5005",
  },
};

const root = __dirname;

for (const [dir, vars] of Object.entries(serviceEnvs)) {
  const envPath = path.join(root, dir, ".env");
  const content =
    Object.entries(vars)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n") + "\n";

  fs.writeFileSync(envPath, content, "utf8");
  console.log(`Created ${envPath}`);
}

console.log("\nAll .env files created. Run: node backend/auth-service/seed.js");
