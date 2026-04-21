/**
 * Standard API Response Format
 * Ensures consistent response structure across all endpoints
 */
export const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};

/**
 * Custom Error Class
 * Thrown throughout application for consistent error handling
 */
export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'CustomError';
  }
}

/**
 * Async handler wrapper
 * Catches async errors and passes to error middleware
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

/**
 * Validate phone number (10 digits)
 */
export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

/**
 * Calculate number of days between two dates
 */
export const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; // Minimum 1 day
};
