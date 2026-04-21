import { sendResponse } from '../utils/helpers.js';

/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent response
 */
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((field) => field.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  return sendResponse(res, statusCode, false, message);
};

/**
 * 404 Not Found Middleware
 * Handles undefined routes
 */
export const notFound = (req, res) => {
  return sendResponse(res, 404, false, `Route ${req.originalUrl} not found`);
};
