// Centralized API configuration for PeopleCore microservices

export const API_BASE_URLS = {
  AUTH: "http://localhost:5001",
  ADMIN: "http://localhost:5002",
  USER: "http://localhost:5004",
  NOTIFICATION: "http://localhost:5005",
  LEAVE: "http://localhost:5006",
  ATTENDANCE: "http://localhost:5007",
  PAYROLL: "http://localhost:5008",
  LEAVE_LEGACY: "http://localhost:8080/api1",
};

export const MICROSERVICE_PORTS = ["5001", "5002", "5004", "5005", "5006", "5007", "5008"];
