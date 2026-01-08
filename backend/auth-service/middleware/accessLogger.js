const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../logs/access.log");

const requestLogger = (req, res, next) => {
  res.on("finish", () => {
    const userId = req.user?.userId || "anonymous";
    const role = req.user?.role || "N/A";

    const log = `${new Date().toISOString()} | ${req.method} ${
      req.originalUrl
    } | userId=${userId} | role=${role} | status=${req.status} | ip=${
      req.ip
    }\n-----------------------------------------------------------------------\n`;

    fs.appendFile(logFile, log, (err) => {
      if (err) console.error("Log write error:", err.message);
    });
  });

  next();
};

module.exports = requestLogger;
