import Booking from '../models/Booking.js';
import Rental from '../models/Rental.js';
import { sendResponse, asyncHandler } from '../utils/helpers.js';
import bookingService from '../services/bookingService.js';

/**
 * Create Booking Controller
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { rentalId, startDate, endDate } = req.body;

  const booking = await bookingService.createBooking(
    req.user._id,
    rentalId,
    startDate,
    endDate
  );

  return sendResponse(res, 201, true, 'Booking created successfully', booking);
});

/**
 * Get User's Bookings Controller
 */
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getUserBookings(req.user._id);

  return sendResponse(res, 200, true, 'Bookings fetched successfully', bookings);
});

/**
 * Get Booking by ID Controller
 */
export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await bookingService.getBookingById(id);

  // Check if user is booking owner or rental owner
  if (
    booking.user._id.toString() !== req.user._id.toString() &&
    booking.rental.owner.toString() !== req.user._id.toString()
  ) {
    return sendResponse(res, 403, false, 'Not authorized to view this booking');
  }

  return sendResponse(res, 200, true, 'Booking fetched successfully', booking);
});

/**
 * Cancel Booking Controller
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const booking = await Booking.findById(id);

  if (!booking) {
    return sendResponse(res, 404, false, 'Booking not found');
  }

  // Check if user is booking owner
  if (booking.user.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Only booking owner can cancel');
  }

  const cancelledBooking = await bookingService.cancelBooking(id, reason);

  return sendResponse(res, 200, true, 'Booking cancelled successfully', cancelledBooking);
});

/**
 * Confirm Booking Controller (After Payment)
 */
export const confirmBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    return sendResponse(res, 404, false, 'Booking not found');
  }

  // Check if user is booking owner
  if (booking.user.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Only booking owner can confirm');
  }

  const confirmedBooking = await bookingService.confirmBooking(id);

  return sendResponse(res, 200, true, 'Booking confirmed successfully', confirmedBooking);
});

/**
 * Add Review to Booking Controller
 */
export const addReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return sendResponse(res, 400, false, 'Rating must be between 1 and 5');
  }

  const booking = await Booking.findById(id);

  if (!booking) {
    return sendResponse(res, 404, false, 'Booking not found');
  }

  // Check if user is booking owner
  if (booking.user.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Only booking owner can review');
  }

  const reviewedBooking = await bookingService.addReview(id, rating, review);

  return sendResponse(res, 200, true, 'Review added successfully', reviewedBooking);
});

/**
 * Get All Bookings Controller (Admin only)
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  // Calculate pagination
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(parseInt(limit), 50);
  const skip = (pageNum - 1) * limitNum;

  // Get bookings
  const bookings = await Booking.find(filter)
    .populate('user', 'name email phone')
    .populate('rental', 'title category pricePerDay')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const total = await Booking.countDocuments(filter);

  return sendResponse(res, 200, true, 'Bookings fetched successfully', {
    bookings,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

/**
 * Get Bookings for Rental Owner Controller
 */
export const getBookingsForMyRentals = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  // Get all bookings for rentals owned by user
  const userRentals = await Rental.find({ owner: req.user._id }).select('_id');
  const rentalIds = userRentals.map((r) => r._id);

  const filter = { rental: { $in: rentalIds } };
  if (status) {
    filter.status = status;
  }

  // Calculate pagination
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(parseInt(limit), 50);
  const skip = (pageNum - 1) * limitNum;

  // Get bookings
  const bookings = await Booking.find(filter)
    .populate('user', 'name email phone')
    .populate('rental', 'title category pricePerDay')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const total = await Booking.countDocuments(filter);

  return sendResponse(res, 200, true, 'Bookings fetched successfully', {
    bookings,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});
