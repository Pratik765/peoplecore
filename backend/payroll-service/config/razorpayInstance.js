const dotenv = require("dotenv");
dotenv.config();
const Razorpay = require("razorpay");

let razorpayInstance = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("[PayrollService] Razorpay initialized successfully");
} else {
  console.warn("[PayrollService] Razorpay keys not configured — payment orders will be unavailable");
}

module.exports = razorpayInstance;
