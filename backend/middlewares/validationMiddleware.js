import { body, validationResult } from 'express-validator';
import { sendResponse } from '../utils/helpers.js';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, false, 'Validation failed', errors.array());
  }
  next();
};

/**
 * Register Validation Rules
 */
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^\d{10}$/)
    .withMessage('Phone must be 10 digits'),
  handleValidationErrors,
];

/**
 * Login Validation Rules
 */
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

/**
 * Create Rental Validation Rules
 */
export const validateCreateRental = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['car', 'bike', 'room', 'equipment', 'other'])
    .withMessage('Invalid category'),
  body('pricePerDay')
    .notEmpty()
    .withMessage('Price per day is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required')
    .isURL()
    .withMessage('Invalid URL format'),
  handleValidationErrors,
];

/**
 * Create Booking Validation Rules
 */
export const validateCreateBooking = [
  body('rentalId')
    .trim()
    .notEmpty()
    .withMessage('Rental ID is required'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  handleValidationErrors,
];
