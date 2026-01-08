require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/verifyToken");
const authorizeRoles = require("./middleware/authorizeRoles");
const user = require("./models/user");
const requestLogger = require("./middleware/accessLogger");
const PORT = process.env.PORT || 5002;

//! Database connection
connectDB();

//! Middlewares
app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

//! Protected routes
app.use("/api", router);
router.use(verifyToken);
router.get("/admin/users", authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const users = await user.find().select("-password");
    res.status(200).json({ users, length: users.length });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
  "/admin/account-approval",
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const pendingUsers = await user
        .find({ status: "PENDING" })
        .select("-password");
      res.status(200).json({ pendingUsers, length: pendingUsers.length });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.put(
  "/admin/approve-user/:id",
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (!id || !role) {
        return res.status(400).json({
          message: "Id or role is not provided",
        });
      }
      const allowedRoles = ["ADMIN", "HR", "EMPLOYEE"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role provided",
        });
      }

      const updatedUser = await user
        .findByIdAndUpdate(
          id,
          { role, status: "ACCEPTED" },
          { new: true, runValidators: true }
        )
        .select("-password");
      res
        .status(200)
        .json({ message: "User approved successfully", updatedUser });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.put(
  "/admin/reject-user/:id",
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: "Id is not provided",
        });
      }
      const updatedUser = await user
        .findByIdAndUpdate(
          id,
          { status: "REJECTED" },
          { new: true, runValidators: true }
        )
        .select("-password");
      res
        .status(200)
        .json({ message: "Request rejected successfully", updatedUser });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
