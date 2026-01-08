const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../logs/access.log");

const requestLogger = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.on("finish", () => {
    const userId = req.user?.userId || "anonymous";
    const role = req.user?.role || "N/A";
    const date = new Date();
    const log = `USER ID : ${userId} | ROLE : ${role} | REQUEST FOR : ${
      req.originalUrl
    } | METHOD : ${
      req.method
    } | DATE : ${date.toLocaleDateString()} | TIME : ${date.toLocaleTimeString()} -------------------------------------------------------------------------------------------\n`;

    fs.appendFile(logFile, log, (err) => {
      if (err) console.error("Log write error:", err.message);
    });
  });

  next();
};

module.exports = requestLogger;
