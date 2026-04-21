import express from 'express';
import {
  createRental,
  getAllRentals,
  getRentalById,
  updateRental,
  deleteRental,
  getMyRentals,
  getRentalsByCategory,
} from '../controllers/rentalController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateCreateRental } from '../middlewares/validationMiddleware.js';
import { createLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

/**
 * Rental Routes
 */

// Create rental (Protected)
router.post('/', protect, createLimiter, validateCreateRental, createRental);

// Get all rentals (Public)
router.get('/', getAllRentals);

// Get rentals by category (Public)
router.get('/category/:category', getRentalsByCategory);

// Get single rental (Public)
router.get('/:id', getRentalById);

// Get my rentals (Protected)
router.get('/my-rentals/list', protect, getMyRentals);

// Update rental (Protected)
router.put('/:id', protect, updateRental);

// Delete rental (Protected)
router.delete('/:id', protect, deleteRental);

export default router;
