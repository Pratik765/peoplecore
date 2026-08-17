module.exports = {
  apps: [
    {
      name: "api-gateway",
      script: "./backend/api-gateway/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
    {
      name: "auth-service",
      script: "./backend/auth-service/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5001,
      },
    },
    {
      name: "admin-service",
      script: "./backend/admin-service/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5002,
      },
    },
    {
      name: "otp-service",
      script: "./backend/otp-service/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5003,
      },
    },
    {
      name: "user-service",
      script: "./backend/user-service/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5004,
      },
    },
    {
      name: "notification-service",
      script: "./backend/notification-service/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5005,
      },
    },
    {
      name: "leave-service",
      script: "./backend/leave-service/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5006,
      },
    },
    {
      name: "attendance-service",
      script: "./backend/attendance-service/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5007,
      },
    },
    {
      name: "payroll-service",
      script: "./backend/payroll-service/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5008,
      },
    },
  ],
};
