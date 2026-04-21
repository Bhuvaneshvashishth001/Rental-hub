import { sendResponse, asyncHandler } from '../utils/helpers.js';
import recommendationService from '../services/recommendationService.js';

/**
 * Get Recommendations by Category Controller
 */
export const getRecommendationsByCategory = asyncHandler(async (req, res) => {
  const { category, location, limit = 6 } = req.query;

  if (!category) {
    return sendResponse(res, 400, false, 'Category is required');
  }

  const recommendations = await recommendationService.getRecommendationsByCategory(
    category,
    location,
    parseInt(limit)
  );

  return sendResponse(res, 200, true, 'Recommendations fetched successfully', recommendations);
});

/**
 * Get Similar Rentals Controller
 */
export const getSimilarRentals = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit = 5 } = req.query;

  const similarRentals = await recommendationService.getSimilarRentals(
    id,
    parseInt(limit)
  );

  return sendResponse(res, 200, true, 'Similar rentals fetched successfully', similarRentals);
});

/**
 * Get Trending Rentals Controller
 */
export const getTrendingRentals = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  const trendingRentals = await recommendationService.getTrendingRentals(parseInt(limit));

  return sendResponse(res, 200, true, 'Trending rentals fetched successfully', trendingRentals);
});

/**
 * Get Personalized Recommendations Controller
 * Requires authentication
 */
export const getPersonalizedRecommendations = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const recommendations = await recommendationService.getPersonalizedRecommendations(
    req.user._id,
    parseInt(limit)
  );

  return sendResponse(res, 200, true, 'Personalized recommendations fetched successfully', recommendations);
});

/**
 * Fallback Recommendations (No auth required)
 * Returns trending rentals if user not authenticated
 */
export const getRecommendations = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  let recommendations;

  if (req.user) {
    // Authenticated user - get personalized recommendations
    recommendations = await recommendationService.getPersonalizedRecommendations(
      req.user._id,
      parseInt(limit)
    );
  } else {
    // Anonymous user - get trending rentals
    recommendations = await recommendationService.getTrendingRentals(parseInt(limit));
  }

  return sendResponse(res, 200, true, 'Recommendations fetched successfully', recommendations);
});
