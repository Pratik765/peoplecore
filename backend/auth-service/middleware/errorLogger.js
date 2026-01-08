const fs = require("fs");
const path = require("path");

const errorLogPath = path.join(__dirname, "../logs/error.log");

const errorLogger = (err, req, res, next) => {
  const log = `
[${new Date().toISOString()}]
${req.method} ${req.originalUrl}
${err.stack}
------------------------
`;
  fs.appendFileSync(errorLogPath, log);
  next(err);
};

module.exports = errorLogger;
