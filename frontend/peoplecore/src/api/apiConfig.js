let rawGatewayUrl = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:5000";
if (rawGatewayUrl && !rawGatewayUrl.startsWith("http://") && !rawGatewayUrl.startsWith("https://")) {
  rawGatewayUrl = `https://${rawGatewayUrl}`;
}
if (rawGatewayUrl.includes("peoplecore-backend") && !rawGatewayUrl.includes(".onrender.com") && !rawGatewayUrl.includes("localhost")) {
  rawGatewayUrl = `${rawGatewayUrl}.onrender.com`;
}
const GATEWAY_URL = rawGatewayUrl.replace(/\/+$/, "");

export const API_BASE_URLS = {
  GATEWAY: GATEWAY_URL,
  AUTH: `${GATEWAY_URL}/pc/auth`,
  ADMIN: `${GATEWAY_URL}/pc/admin`,
  OTP: `${GATEWAY_URL}/pc/otp`,
  USER: `${GATEWAY_URL}/pc/user`,
  NOTIFICATION: `${GATEWAY_URL}/pc/notification`,
  LEAVE: `${GATEWAY_URL}/pc/leave`,
  ATTENDANCE: `${GATEWAY_URL}/pc/attendance`,
  PAYROLL: `${GATEWAY_URL}/pc/payroll`,
};

export const MICROSERVICE_PORTS = ["5000", "5001", "5002", "5003", "5004", "5005", "5006", "5007", "5008"];

