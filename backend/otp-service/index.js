require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { sendOtp, verifyOtp } = require("./controllers/otpController");
const app = express();
const router = require("express").Router();
const PORT = process.env.PORT || 5003;
//! Database connection
connectDB();

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "otp-service",
    status: "UP",
    timestamp: new Date().toLocaleString(),
  });
});
app.use("/", router);
router.post("/send", (req, res) => {
  //   const { email } = req.body;
  sendOtp(req, res);
});
router.post("/verify", (req, res) => verifyOtp(req, res));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
