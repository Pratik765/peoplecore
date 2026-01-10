const Otp = require("../models/Otp");
const { sendOtpEmail } = require("../services/emailservice");
const { generateOtp } = require("../services/otpService");

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.create({ email, otp, expiresAt });
  await sendOtpEmail(email, otp);

  res.status(200).json({ message: "OTP sent successfully" });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email, otp });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await Otp.deleteMany({ email });

  res.status(200).json({ message: "OTP verified" });
};
