require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const verifyToken = require("./middleware/verifyToken");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

const createProxy = (target, pathPrefix) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${pathPrefix}`]: "" },
    on: {
      error: (err, req, res) => {
        console.error(`[Gateway Proxy Error] ${req.method} ${req.url} -> ${target}:`, err.message);
        if (!res.headersSent) {
          res.status(502).json({
            message: `Service at ${pathPrefix} is currently unavailable. Please try again in a few seconds.`,
            error: err.message,
          });
        }
      },
    },
  });

app.use("/pc/auth", createProxy(process.env.AUTH_SERVICE_URL || "http://localhost:5001", "/pc/auth"));
app.use("/pc/admin", createProxy(process.env.ADMIN_SERVICE_URL || "http://localhost:5002", "/pc/admin"));
app.use("/pc/otp", createProxy(process.env.OTP_SERVICE_URL || "http://localhost:5003", "/pc/otp"));
app.use("/pc/user", createProxy(process.env.USER_SERVICE_URL || "http://localhost:5004", "/pc/user"));
app.use("/pc/notification", createProxy(process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5005", "/pc/notification"));
app.use("/pc/leave", createProxy(process.env.LEAVE_SERVICE_URL || "http://localhost:5006", "/pc/leave"));
app.use("/pc/attendance", createProxy(process.env.ATTENDANCE_SERVICE_URL || "http://localhost:5007", "/pc/attendance"));
app.use("/pc/payroll", createProxy(process.env.PAYROLL_SERVICE_URL || "http://localhost:5008", "/pc/payroll"));


app.get("/health", (req, res) => {
  res.status(200).json({
    service: "api-gateway",
    status: "UP",
    timestamp: new Date().toLocaleString(),
  });
});
app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
