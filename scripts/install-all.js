const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = path.resolve(__dirname, "..");
const backendDir = path.join(root, "backend");

const services = fs.readdirSync(backendDir).filter((item) => {
  const itemPath = path.join(backendDir, item);
  return fs.statSync(itemPath).isDirectory() && fs.existsSync(path.join(itemPath, "package.json"));
});

console.log(`📦 Installing dependencies for ${services.length} backend services...`);

for (const svc of services) {
  const svcPath = path.join(backendDir, svc);
  console.log(`\n➡️  Installing dependencies in backend/${svc}...`);
  try {
    execSync("npm install", { cwd: svcPath, stdio: "inherit" });
  } catch (err) {
    console.error(`❌ Failed to install dependencies for backend/${svc}:`, err.message);
    process.exit(1);
  }
}

console.log("\n✅ All backend dependencies installed successfully!");
