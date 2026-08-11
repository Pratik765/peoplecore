const mongoose = require("mongoose");

const salaryStructureSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PayrollUser",
      required: true,
      unique: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
      required: true,
    },
    annualCtc: {
      type: Number,
      required: true,
      default: 1200000, // Default 12 LPA CTC
    },
    basic: {
      type: Number,
      required: true,
      default: 50000, // Monthly Basic
    },
    hra: {
      type: Number,
      required: true,
      default: 25000, // Monthly HRA
    },
    specialAllowance: {
      type: Number,
      required: true,
      default: 25000, // Monthly Special Allowance
    },
    pfDeduction: {
      type: Number,
      required: true,
      default: 6000, // Monthly PF (Provident Fund)
    },
    taxDeduction: {
      type: Number,
      required: true,
      default: 4000, // Monthly Income Tax (TDS)
    },
    grossSalary: {
      type: Number,
      required: true,
      default: 100000, // Basic + HRA + Special Allowance
    },
    netSalary: {
      type: Number,
      required: true,
      default: 90000, // Gross - PF - Tax
    },
    currency: {
      type: String,
      default: "INR",
    },
    bankName: {
      type: String,
      default: "HDFC Bank",
    },
    accountNumber: {
      type: String,
      default: "50100492817264",
    },
    ifscCode: {
      type: String,
      default: "HDFC0001234",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalaryStructure", salaryStructureSchema);
