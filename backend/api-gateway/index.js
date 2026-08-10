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

app.use(
  "/pc/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:5001",
    changeOrigin: true,
  })
);
app.use(
  "/pc/admin",
  createProxyMiddleware({
    target: process.env.ADMIN_SERVICE_URL || "http://localhost:5002",
    changeOrigin: true,
  })
);
app.use(
  "/pc/user",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || "http://localhost:5004",
    changeOrigin: true,
  })
);
app.use(
  "/pc/notification",
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5005",
    changeOrigin: true,
  })
);

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
