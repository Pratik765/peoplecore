const mongoose = require("mongoose");

const payslipSchema = new mongoose.Schema(
  {
    payslipId: {
      type: String,
      unique: true,
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PayrollUser",
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: "Engineering",
    },
    designation: {
      type: String,
      default: "Software Engineer",
    },
    payMonth: {
      type: String, // e.g. "August 2026"
      required: true,
    },
    payYear: {
      type: Number,
      default: 2026,
    },
    basic: {
      type: Number,
      required: true,
    },
    hra: {
      type: Number,
      required: true,
    },
    specialAllowance: {
      type: Number,
      required: true,
    },
    pfDeduction: {
      type: Number,
      required: true,
    },
    taxDeduction: {
      type: Number,
      required: true,
    },
    grossSalary: {
      type: Number,
      required: true,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PAID", "PROCESSING"],
      default: "PAID",
    },
    paidOn: {
      type: String, // "YYYY-MM-DD"
      default: () => new Date().toISOString().split("T")[0],
    },
    paymentMethod: {
      type: String,
      default: "Direct Bank Transfer",
    },
    bankName: {
      type: String,
      default: "HDFC Bank",
    },
    accountNumber: {
      type: String,
      default: "50100492817264",
    },
  },
  { timestamps: true }
);

// Unique index per employee per pay month
payslipSchema.index({ employeeId: 1, payMonth: 1 }, { unique: true });

module.exports = mongoose.model("Payslip", payslipSchema);
