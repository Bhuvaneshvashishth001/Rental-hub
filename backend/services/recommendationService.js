import Rental from '../models/Rental.js';

/**
 * Recommendation Service
 * Contains business logic for rental recommendations
 */
class RecommendationService {
  /**
   * Get rental recommendations based on category and location
   * @param {string} category - Rental category
   * @param {string} location - Rental location
   * @param {number} limit - Number of recommendations
   * @returns {Array} - Array of recommended rentals
   */
  async getRecommendationsByCategory(category, location = null, limit = 6) {
    try {
      const query = {
        availability: true,
      };

      if (category) {
        query.category = category;
      }

      if (location) {
        query.location = location;
      }

      const recommendations = await Rental.find(query)
        .sort({ rating: -1, reviewCount: -1 })
        .limit(limit)
        .populate('owner', 'name email phone');

      return recommendations;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  /**
   * Get similar rentals to a given rental
   * @param {string} rentalId - Rental ID to find similar items for
   * @param {number} limit - Number of recommendations
   * @returns {Array} - Array of similar rentals
   */
  async getSimilarRentals(rentalId, limit = 5) {
    try {
      const rental = await Rental.findById(rentalId);

      if (!rental) {
        throw new Error('Rental not found');
      }

      const similarRentals = await Rental.find({
        _id: { $ne: rentalId },
        category: rental.category,
        availability: true,
      })
        .sort({ rating: -1 })
        .limit(limit)
        .populate('owner', 'name email phone');

      return similarRentals;
    } catch (error) {
      console.error('Error fetching similar rentals:', error);
      throw error;
    }
  }

  /**
   * Get trending rentals (highest rated and reviewed)
   * @param {number} limit - Number of trending rentals
   * @returns {Array} - Array of trending rentals
   */
  async getTrendingRentals(limit = 8) {
    try {
      const trendingRentals = await Rental.find({
        availability: true,
        rating: { $gte: 4 }, // Only highly rated items
      })
        .sort({ rating: -1, reviewCount: -1, createdAt: -1 })
        .limit(limit)
        .populate('owner', 'name email phone');

      return trendingRentals;
    } catch (error) {
      console.error('Error fetching trending rentals:', error);
      throw error;
    }
  }

  /**
   * Get personalized recommendations based on user's previous bookings
   * @param {string} userId - User ID
   * @param {number} limit - Number of recommendations
   * @returns {Array} - Array of personalized recommendations
   */
  async getPersonalizedRecommendations(userId, limit = 6) {
    try {
      // Import here to avoid circular dependency
      const Booking = (await import('../models/Booking.js')).default;

      // Get user's booking history
      const userBookings = await Booking.find({ user: userId })
        .populate('rental');

      if (userBookings.length === 0) {
        // If no booking history, return trending rentals
        return this.getTrendingRentals(limit);
      }

      // Extract categories from booking history
      const bookedCategories = [
        ...new Set(userBookings.map((b) => b.rental?.category)),
      ];

      // Find similar rentals
      const recommendations = await Rental.find({
        category: { $in: bookedCategories },
        availability: true,
        _id: {
          $nin: userBookings.map((b) => b.rental?._id),
        },
      })
        .sort({ rating: -1, reviewCount: -1 })
        .limit(limit)
        .populate('owner', 'name email phone');

      return recommendations;
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
      throw error;
    }
  }
}

export default new RecommendationService();
