const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"PeopleCore HRMS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "PeopleCore OTP for Registration",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  });
};
