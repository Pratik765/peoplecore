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
    currency: {
      type: String,
      default: "INR",
    },
    bankName: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: String,
      default: "",
    },
    ifscCode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalaryStructure", salaryStructureSchema);
