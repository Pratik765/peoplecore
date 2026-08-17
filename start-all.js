import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
  { name: "api-gateway", dir: "backend/api-gateway", port: 5000 },
  { name: "auth-service", dir: "backend/auth-service", port: 5001 },
  { name: "admin-service", dir: "backend/admin-service", port: 5002 },
  { name: "otp-service", dir: "backend/otp-service", port: 5003 },
  { name: "user-service", dir: "backend/user-service", port: 5004 },
  { name: "notification-service", dir: "backend/notification-service", port: 5005 },
  { name: "leave-service", dir: "backend/leave-service", port: 5006 },
  { name: "attendance-service", dir: "backend/attendance-service", port: 5007 },
  { name: "payroll-service", dir: "backend/payroll-service", port: 5008 },
];

console.log("🚀 Starting all PeopleCore backend microservices...\n");

for (const svc of services) {
  const child = spawn("node", ["index.js"], {
    cwd: path.join(__dirname, svc.dir),
    stdio: "inherit",
    shell: true,
  });

  child.on("error", (err) => {
    console.error(`❌ [${svc.name}] Failed to start:`, err.message);
  });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`⚠️ [${svc.name}] Exited with code ${code}`);
    }
  });

  console.log(`✅ [${svc.name}] Launching on port :${svc.port}`);
}

console.log("\n🌐 All backend microservices launched successfully!");
