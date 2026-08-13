import { API_BASE_URLS } from "./apiConfig";
import { apiFetch } from "./apiClient";

export const fetchMySalaryStructure = () => {
  return apiFetch(`${API_BASE_URLS.PAYROLL}/payroll/my-structure`);
};

export const fetchMyPayslips = () => {
  return apiFetch(`${API_BASE_URLS.PAYROLL}/payroll/my-payslips`);
};

export const fetchAllPayslips = () => {
  return apiFetch(`${API_BASE_URLS.PAYROLL}/payroll/all-payslips`);
};

export const fetchAllSalaryStructures = () => {
  return apiFetch(`${API_BASE_URLS.PAYROLL}/payroll/all-structures`);
};

export const configureEmployeeCtc = (employeeId, ctc) => {
  return apiFetch(`${API_BASE_URLS.PAYROLL}/payroll/configure-ctc`, {
    method: "POST",
    body: JSON.stringify({ employeeId, ctc }),
  });
};

export const generateBatchPayslips = (month, year) => {
  return apiFetch(`${API_BASE_URLS.PAYROLL}/payroll/generate-batch-payslips`, {
    method: "POST",
    body: JSON.stringify({ month, year }),
  });
};

export const createRazorpayPaymentOrder = (paymentData) => {
  return apiFetch(`${API_BASE_URLS.PAYROLL}/payroll/create-payment-order`, {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
};
