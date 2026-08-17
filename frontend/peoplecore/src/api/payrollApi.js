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
  return apiFetch(`${API_BASE_URLS.PAYROLL}/payroll/salary-structure`, {
    method: "POST",
    body: JSON.stringify({ employeeId, annualCtc: ctc }),
  });
};

export const generateBatchPayslips = (month, year) => {
  return apiFetch(`${API_BASE_URLS.PAYROLL}/payroll/generate-payslips`, {
    method: "POST",
    body: JSON.stringify({ payMonth: month, payYear: year }),
  });
};


export const createRazorpayPaymentOrder = (paymentData) => {
  return apiFetch(`${API_BASE_URLS.PAYROLL}/payroll/create-payment-order`, {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
};
