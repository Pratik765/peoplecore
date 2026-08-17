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
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    payMonth: {
      type: String,
      required: true,
    },
    payYear: {
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
    status: {
      type: String,
      enum: ["PAID", "PROCESSING"],
      default: "PAID",
    },
    paidOn: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    paymentMethod: {
      type: String,
      default: "Direct Bank Transfer",
    },
    bankName: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Unique index per employee per pay month
payslipSchema.index({ employeeId: 1, payMonth: 1 }, { unique: true });

module.exports = mongoose.model("Payslip", payslipSchema);
