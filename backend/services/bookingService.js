import Booking from '../models/Booking.js';
import Rental from '../models/Rental.js';
import { calculateDays, CustomError } from '../utils/helpers.js';

/**
 * Booking Service
 * Contains business logic for booking operations
 */
class BookingService {
  /**
   * Create a new booking
   * @param {string} userId - User ID
   * @param {string} rentalId - Rental ID
   * @param {Date} startDate - Booking start date
   * @param {Date} endDate - Booking end date
   * @returns {Object} - Created booking
   */
  async createBooking(userId, rentalId, startDate, endDate) {
    try {
      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        throw new CustomError('End date must be after start date', 400);
      }

      if (start < new Date()) {
        throw new CustomError('Cannot book in the past', 400);
      }

      // Fetch rental
      const rental = await Rental.findById(rentalId);

      if (!rental) {
        throw new CustomError('Rental not found', 404);
      }

      if (!rental.availability) {
        throw new CustomError('Rental is not available', 400);
      }

      // Check for existing bookings
      const existingBooking = await Booking.findOne({
        rental: rentalId,
        $or: [
          { startDate: { $lt: end }, endDate: { $gt: start } },
        ],
        status: { $in: ['pending', 'confirmed'] },
      });

      if (existingBooking) {
        throw new CustomError(
          'Rental is already booked for these dates',
          400
        );
      }

      // Calculate booking details
      const numberOfDays = calculateDays(start, end);
      const totalPrice = numberOfDays * rental.pricePerDay;

      // Create booking
      const booking = await Booking.create({
        user: userId,
        rental: rentalId,
        startDate: start,
        endDate: end,
        numberOfDays,
        pricePerDay: rental.pricePerDay,
        totalPrice,
        status: 'pending',
        paymentStatus: 'pending',
      });

      // Populate references
      await booking.populate('user rental');

      return booking;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error('Error creating booking:', error);
      throw new CustomError('Error creating booking', 500);
    }
  }

  /**
   * Get user's bookings
   * @param {string} userId - User ID
   * @returns {Array} - User's bookings
   */
  async getUserBookings(userId) {
    try {
      const bookings = await Booking.find({ user: userId })
        .populate('rental')
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });

      return bookings;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  /**
   * Get booking by ID
   * @param {string} bookingId - Booking ID
   * @returns {Object} - Booking details
   */
  async getBookingById(bookingId) {
    try {
      const booking = await Booking.findById(bookingId)
        .populate('user rental');

      if (!booking) {
        throw new CustomError('Booking not found', 404);
      }

      return booking;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  /**
   * Cancel booking
   * @param {string} bookingId - Booking ID
   * @param {string} reason - Cancellation reason
   * @returns {Object} - Cancelled booking
   */
  async cancelBooking(bookingId, reason = null) {
    try {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        throw new CustomError('Booking not found', 404);
      }

      if (booking.status === 'cancelled') {
        throw new CustomError('Booking is already cancelled', 400);
      }

      if (booking.status === 'completed') {
        throw new CustomError('Cannot cancel completed booking', 400);
      }

      booking.status = 'cancelled';
      booking.cancellationReason = reason;
      booking.paymentStatus = 'refunded';

      await booking.save();

      return booking;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  /**
   * Confirm booking (after payment)
   * @param {string} bookingId - Booking ID
   * @returns {Object} - Confirmed booking
   */
  async confirmBooking(bookingId) {
    try {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        throw new CustomError('Booking not found', 404);
      }

      booking.status = 'confirmed';
      booking.paymentStatus = 'completed';

      await booking.save();

      return booking;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error('Error confirming booking:', error);
      throw error;
    }
  }

  /**
   * Add review to booking
   * @param {string} bookingId - Booking ID
   * @param {number} rating - Rating (1-5)
   * @param {string} review - Review text
   * @returns {Object} - Updated booking
   */
  async addReview(bookingId, rating, review) {
    try {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        throw new CustomError('Booking not found', 404);
      }

      if (booking.status !== 'completed') {
        throw new CustomError('Can only review completed bookings', 400);
      }

      booking.rating = Math.min(5, Math.max(1, rating));
      booking.review = review;

      await booking.save();

      // Update rental rating
      await this.updateRentalRating(booking.rental);

      return booking;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error('Error adding review:', error);
      throw error;
    }
  }

  /**
   * Update rental rating based on reviews
   * @param {string} rentalId - Rental ID
   */
  async updateRentalRating(rentalId) {
    try {
      const reviews = await Booking.find({
        rental: rentalId,
        rating: { $exists: true, $ne: null },
      });

      if (reviews.length === 0) return;

      const avgRating =
        reviews.reduce((sum, b) => sum + b.rating, 0) / reviews.length;

      await Rental.findByIdAndUpdate(rentalId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      });
    } catch (error) {
      console.error('Error updating rental rating:', error);
    }
  }
}

export default new BookingService();
