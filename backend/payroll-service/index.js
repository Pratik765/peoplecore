require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/verifyToken");
const authorizeRoles = require("./middleware/authorizeRoles");
const SalaryStructure = require("./models/salaryStructure");
const Payslip = require("./models/payslip");
const razorpayInstance = require("./config/razorpayInstance");

const app = express();
const PORT = process.env.PORT || 5008;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5004";

// Interservice Helpers
const getUserById = async (userId) => {
  try {
    const res = await fetch(`${USER_SERVICE_URL}/internal/users/${userId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.error(`[PayrollService] Error fetching user ${userId}:`, err.message);
  }
  return null;
};

const getAcceptedUsers = async () => {
  try {
    const res = await fetch(`${USER_SERVICE_URL}/internal/users?status=ACCEPTED`);
    if (res.ok) {
      const users = await res.json();
      if (users.length > 0) return users;
    }
    const allRes = await fetch(`${USER_SERVICE_URL}/internal/users`);
    if (allRes.ok) return await allRes.json();
  } catch (err) {
    console.error(`[PayrollService] Error fetching accepted users:`, err.message);
  }
  return [];
};

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

// Helper: Get current month and year dynamically
const getCurrentPayPeriod = () => {
  const now = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  return {
    payMonth: `${monthNames[now.getMonth()]} ${now.getFullYear()}`,
    payYear: now.getFullYear(),
  };
};

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
    let structure = await SalaryStructure.findOne({
      employeeId: userId,
    }).lean();

    if (!structure) {
      // No salary structure configured yet — return empty so HR/Admin can configure it
      return res.status(200).json(null);
    }

    res.status(200).json(structure);
  } catch (error) {
    console.error("Error fetching salary structure:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
});

// ─── GET /payroll/my-payslips (Get logged in user's payslips) ───
app.get("/payroll/my-payslips", async (req, res) => {
  try {
    const userId = req.user.userId;
    let payslips = await Payslip.find({ employeeId: userId })
      .sort({ payYear: -1, createdAt: -1 })
      .lean();

    // Return empty array if no payslips generated yet — no dummy data
    // Payslips are created via POST /payroll/generate-payslips by Admin/HR

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
    if (
      payslip.employeeId.toString() !== req.user.userId &&
      !["ADMIN", "HR"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(payslip);
  } catch (error) {
    console.error("Error fetching payslip:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── GET /payroll/all-structures (Admin / HR) ───
app.get(
  "/payroll/all-structures",
  authorizeRoles("ADMIN", "HR"),
  async (req, res) => {
    try {
      const structures = await SalaryStructure.find()
        .sort({ createdAt: -1 })
        .lean();
      res.status(200).json(structures);
    } catch (error) {
      console.error("Error fetching all structures:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

// ─── POST /payroll/salary-structure (Configure CTC for employee) ───
app.post(
  "/payroll/salary-structure",
  authorizeRoles("ADMIN", "HR"),
  async (req, res) => {
    try {
      const { employeeId, annualCtc, bankName, accountNumber, ifscCode } =
        req.body;

      if (!employeeId || !annualCtc) {
        return res
          .status(400)
          .json({ message: "Employee ID and annual CTC are required" });
      }

      const employee = await getUserById(employeeId);
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
          bankName: bankName || "",
          accountNumber: accountNumber || "",
          ifscCode: ifscCode || "",
        },
        { upsert: true, new: true },
      );

      res
        .status(200)
        .json({ message: "Salary structure updated successfully", structure });
    } catch (error) {
      console.error("Error setting salary structure:", error.message);
      res
        .status(500)
        .json({ message: "Internal server error: " + error.message });
    }
  },
);

// ─── POST /payroll/generate-payslips (Batch generate payslips for a month) ───
app.post(
  "/payroll/generate-payslips",
  authorizeRoles("ADMIN", "HR"),
  async (req, res) => {
    try {
      const { payMonth, payYear } = req.body;
      const currentPeriod = getCurrentPayPeriod();
      const month = payMonth || currentPeriod.payMonth;
      const year = payYear || currentPeriod.payYear;

      const allUsers = await getAcceptedUsers();
      let generatedCount = 0;

      for (const user of allUsers) {
        let struct = await SalaryStructure.findOne({ employeeId: user._id });
        if (!struct) continue; // Skip users without a configured salary structure

        const payslipId = `PS-${year}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`;

        try {
          await Payslip.create({
            payslipId,
            employeeId: user._id,
            employeeName: user.name,
            employeeEmail: user.email,
            department: user.department,
            designation: user.designation,
            payMonth: month,
            payYear: year,
            basic: struct.basic,
            hra: struct.hra,
            specialAllowance: struct.specialAllowance,
            pfDeduction: struct.pfDeduction,
            taxDeduction: struct.taxDeduction,
            grossSalary: struct.grossSalary,
            netSalary: struct.netSalary,
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
      res
        .status(500)
        .json({ message: "Internal server error: " + error.message });
    }
  },
);

// ─── GET /payroll/all-payslips (Admin / HR) ───
app.get(
  "/payroll/all-payslips",
  authorizeRoles("ADMIN", "HR"),
  async (req, res) => {
    try {
      const payslips = await Payslip.find().sort({ createdAt: -1 }).lean();
      res.status(200).json(payslips);
    } catch (error) {
      console.error("Error fetching all payslips:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

app.post(
  "/payroll/create-payment-order",
  authorizeRoles("ADMIN", "HR"),
  async (req, res) => {
    try {
      const { amount, currency, receipt } = req.body;

      if (!amount || !currency || !receipt) {
        return res
          .status(400)
          .json({ message: "Amount, currency, and receipt are required" });
      }
      if (!razorpayInstance) {
        return res.status(503).json({ message: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env" });
      }

      razorpayInstance.orders.create(
        {
          amount: amount * 100, // Convert to smallest currency unit
          currency,
          receipt,
        },
        (err, order) => {
          if (err) {
            console.error("Razorpay order creation error:", err);
            return res
              .status(500)
              .json({ message: "Payment order creation failed" });
          }
          res.status(200).json(order);
        },
      );
    } catch (error) {
      console.error("Error creating payment order:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

app.listen(PORT, () => {
  console.log(`Payroll Service running at http://localhost:${PORT}`);
});
