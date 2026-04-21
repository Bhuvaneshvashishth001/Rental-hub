import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  confirmBooking,
  addReview,
  getAllBookings,
  getBookingsForMyRentals,
} from '../controllers/bookingController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import { validateCreateBooking } from '../middlewares/validationMiddleware.js';

const router = express.Router();

/**
 * Booking Routes
 */

// Create booking (Protected)
router.post('/', protect, validateCreateBooking, createBooking);

// Get user's bookings (Protected)
router.get('/my-bookings/list', protect, getUserBookings);

// Get bookings for my rentals (Protected)
router.get('/my-rentals/bookings', protect, getBookingsForMyRentals);

// Get all bookings (Admin only)
router.get('/', protect, isAdmin, getAllBookings);

// Get booking by ID (Protected)
router.get('/:id', protect, getBookingById);

// Confirm booking after payment (Protected)
router.put('/:id/confirm', protect, confirmBooking);

// Cancel booking (Protected)
router.put('/:id/cancel', protect, cancelBooking);

// Add review to booking (Protected)
router.post('/:id/review', protect, addReview);

export default router;
