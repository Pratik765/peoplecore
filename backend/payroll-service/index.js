require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/verifyToken");
const authorizeRoles = require("./middleware/authorizeRoles");
const SalaryStructure = require("./models/salaryStructure");
const Payslip = require("./models/payslip");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 5008;

// Database connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[PayrollService] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "payroll-service",
    status: "UP",
    timestamp: new Date().toLocaleString(),
  });
});

// Protected routes require valid JWT
app.use(verifyToken);

// Helper: Auto-calculate salary components from annual CTC
const calculateSalaryComponents = (annualCtc) => {
  const monthlyGross = Math.round(annualCtc / 12);
  const basic = Math.round(monthlyGross * 0.5); // 50% Basic
  const hra = Math.round(monthlyGross * 0.25); // 25% HRA
  const specialAllowance = Math.max(monthlyGross - basic - hra, 0); // Remaining 25%
  const pfDeduction = Math.min(Math.round(basic * 0.12), 6000); // 12% PF or cap
  const taxDeduction = Math.round(monthlyGross * 0.05); // 5% TDS / Tax
  const grossSalary = basic + hra + specialAllowance;
  const netSalary = grossSalary - pfDeduction - taxDeduction;

  return {
    annualCtc,
    basic,
    hra,
    specialAllowance,
    pfDeduction,
    taxDeduction,
    grossSalary,
    netSalary,
  };
};

// ─── GET /payroll/my-structure (Get logged in user's CTC breakdown) ───
app.get("/payroll/my-structure", async (req, res) => {
  try {
    const userId = req.user.userId;
    let structure = await SalaryStructure.findOne({ employeeId: userId }).lean();

    if (!structure) {
      // Auto-create default salary structure for user if none exists
      const user = await User.findById(userId).select("name email department designation");
      const defaultComponents = calculateSalaryComponents(1200000); // Default 12 LPA CTC

      structure = await SalaryStructure.create({
        employeeId: userId,
        employeeName: user?.name || "Employee",
        employeeEmail: user?.email || "",
        ...defaultComponents,
      });
    }

    res.status(200).json(structure);
  } catch (error) {
    console.error("Error fetching salary structure:", error.message);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

// ─── GET /payroll/my-payslips (Get logged in user's payslips) ───
app.get("/payroll/my-payslips", async (req, res) => {
  try {
    const userId = req.user.userId;
    let payslips = await Payslip.find({ employeeId: userId }).sort({ payYear: -1, createdAt: -1 }).lean();

    if (payslips.length === 0) {
      // Seed a starter payslip for immediate visual feedback
      const user = await User.findById(userId).select("name email department designation");
      const structure = await SalaryStructure.findOne({ employeeId: userId });
      const comp = structure || calculateSalaryComponents(1200000);

      const defaultPayslip = await Payslip.create({
        payslipId: `PS-2026-08-${Date.now().toString().slice(-4)}`,
        employeeId: userId,
        employeeName: user?.name || "Employee",
        employeeEmail: user?.email || "",
        department: user?.department || "Engineering",
        designation: user?.designation || "Software Engineer",
        payMonth: "August 2026",
        payYear: 2026,
        basic: comp.basic,
        hra: comp.hra,
        specialAllowance: comp.specialAllowance,
        pfDeduction: comp.pfDeduction,
        taxDeduction: comp.taxDeduction,
        grossSalary: comp.grossSalary,
        netSalary: comp.netSalary,
        status: "PAID",
        paidOn: new Date().toISOString().split("T")[0],
      });

      payslips = [defaultPayslip];
    }

    res.status(200).json(payslips);
  } catch (error) {
    console.error("Error fetching my payslips:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── GET /payroll/payslip/:id (Get single payslip details) ───
app.get("/payroll/payslip/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payslip = await Payslip.findById(id).lean();

    if (!payslip) {
      return res.status(404).json({ message: "Payslip not found" });
    }

    // Security check: must be owner or ADMIN/HR
    if (payslip.employeeId.toString() !== req.user.userId && !["ADMIN", "HR"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(payslip);
  } catch (error) {
    console.error("Error fetching payslip:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── GET /payroll/all-structures (Admin / HR) ───
app.get("/payroll/all-structures", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const structures = await SalaryStructure.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(structures);
  } catch (error) {
    console.error("Error fetching all structures:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── POST /payroll/salary-structure (Configure CTC for employee) ───
app.post("/payroll/salary-structure", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const { employeeId, annualCtc, bankName, accountNumber, ifscCode } = req.body;

    if (!employeeId || !annualCtc) {
      return res.status(400).json({ message: "Employee ID and annual CTC are required" });
    }

    const employee = await User.findById(employeeId).select("name email department designation");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const components = calculateSalaryComponents(Number(annualCtc));

    const structure = await SalaryStructure.findOneAndUpdate(
      { employeeId },
      {
        employeeName: employee.name,
        employeeEmail: employee.email,
        ...components,
        bankName: bankName || "HDFC Bank",
        accountNumber: accountNumber || "50100492817264",
        ifscCode: ifscCode || "HDFC0001234",
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Salary structure updated successfully", structure });
  } catch (error) {
    console.error("Error setting salary structure:", error.message);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

// ─── POST /payroll/generate-payslips (Batch generate payslips for a month) ───
app.post("/payroll/generate-payslips", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const { payMonth, payYear } = req.body;
    const month = payMonth || "August 2026";
    const year = payYear || 2026;

    const allUsers = await User.find({ status: "ACCEPTED" }).select("_id name email department designation");
    let generatedCount = 0;

    for (const user of allUsers) {
      let struct = await SalaryStructure.findOne({ employeeId: user._id });
      const comp = struct || calculateSalaryComponents(1200000);

      const payslipId = `PS-${year}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`;

      try {
        await Payslip.create({
          payslipId,
          employeeId: user._id,
          employeeName: user.name,
          employeeEmail: user.email,
          department: user.department || "Engineering",
          designation: user.designation || "Software Engineer",
          payMonth: month,
          payYear: year,
          basic: comp.basic,
          hra: comp.hra,
          specialAllowance: comp.specialAllowance,
          pfDeduction: comp.pfDeduction,
          taxDeduction: comp.taxDeduction,
          grossSalary: comp.grossSalary,
          netSalary: comp.netSalary,
          status: "PAID",
          paidOn: new Date().toISOString().split("T")[0],
        });
        generatedCount++;
      } catch (dupErr) {
        // Skip duplicate payslips for same employee + payMonth
      }
    }

    res.status(200).json({
      message: `Generated ${generatedCount} payslip(s) for ${month}`,
      generatedCount,
    });
  } catch (error) {
    console.error("Error generating payslips:", error.message);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

// ─── GET /payroll/all-payslips (Admin / HR) ───
app.get("/payroll/all-payslips", authorizeRoles("ADMIN", "HR"), async (req, res) => {
  try {
    const payslips = await Payslip.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(payslips);
  } catch (error) {
    console.error("Error fetching all payslips:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Payroll Service running at http://localhost:${PORT}`);
});
