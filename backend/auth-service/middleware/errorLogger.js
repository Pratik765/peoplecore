const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs");
const errorLogPath = path.join(logDir, "error.log");

const errorLogger = (err, req, res, next) => {
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const log = `
[${new Date().toISOString()}]
${req.method} ${req.originalUrl}
${err.stack}
------------------------
`;
    fs.appendFileSync(errorLogPath, log);
  } catch (logErr) {
    console.error("Error logging failure:", logErr.message);
  }
  next(err);
};

module.exports = errorLogger;
