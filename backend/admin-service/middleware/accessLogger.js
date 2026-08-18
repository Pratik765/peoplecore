const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs");
const logFile = path.join(logDir, "access.log");

const requestLogger = (req, res, next) => {
  res.on("finish", () => {
    try {
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      const userId = req.user?.userId || "anonymous";
      const role = req.user?.role || "N/A";

      const log = `${new Date().toISOString()} | ${req.method} ${
        req.originalUrl
      } | userId=${userId} | role=${role} | status=${res.statusCode} | ip=${
        req.ip
      }\n-----------------------------------------------------------------------\n`;

      fs.appendFile(logFile, log, (err) => {
        if (err) console.error("Log write error:", err.message);
      });
    } catch (err) {
      console.error("Access log error:", err.message);
    }
  });

  next();
};

module.exports = requestLogger;
