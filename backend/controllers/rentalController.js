import Rental from '../models/Rental.js';
import { sendResponse, asyncHandler, CustomError } from '../utils/helpers.js';

/**
 * Create Rental Listing Controller
 */
export const createRental = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    pricePerDay,
    location,
    description,
    imageUrl,
    specifications,
  } = req.body;

  // Create rental
  const rental = await Rental.create({
    title,
    category,
    pricePerDay,
    location,
    description,
    imageUrl,
    owner: req.user._id,
    specifications: specifications || new Map(),
  });

  // Populate owner details
  await rental.populate('owner', 'name email phone');

  return sendResponse(res, 201, true, 'Rental created successfully', rental);
});

/**
 * Get All Rentals Controller
 * With pagination, filtering, and search
 */
export const getAllRentals = asyncHandler(async (req, res) => {
  const { category, location, page = 1, limit = 12, search } = req.query;

  // Build filter query
  const filter = { availability: true };

  if (category) {
    filter.category = category;
  }

  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Calculate pagination
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(parseInt(limit), 50); // Max 50 per page
  const skip = (pageNum - 1) * limitNum;

  // Get rentals
  const rentals = await Rental.find(filter)
    .populate('owner', 'name email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const total = await Rental.countDocuments(filter);

  return sendResponse(res, 200, true, 'Rentals fetched successfully', {
    rentals,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

/**
 * Get Single Rental Controller
 */
export const getRentalById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const rental = await Rental.findById(id).populate('owner', {
    name: 1,
    email: 1,
    phone: 1,
    profileImage: 1,
  });

  if (!rental) {
    return sendResponse(res, 404, false, 'Rental not found');
  }

  return sendResponse(res, 200, true, 'Rental fetched successfully', rental);
});

/**
 * Update Rental Controller
 * Only owner can update
 */
export const updateRental = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, category, pricePerDay, location, description, imageUrl, specifications, availability } = req.body;

  // Find rental
  const rental = await Rental.findById(id);

  if (!rental) {
    return sendResponse(res, 404, false, 'Rental not found');
  }

  // Check if user is owner
  if (rental.owner.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Not authorized to update this rental');
  }

  // Update fields
  if (title) rental.title = title;
  if (category) rental.category = category;
  if (pricePerDay) rental.pricePerDay = pricePerDay;
  if (location) rental.location = location;
  if (description) rental.description = description;
  if (imageUrl) rental.imageUrl = imageUrl;
  if (specifications) rental.specifications = specifications;
  if (typeof availability !== 'undefined') rental.availability = availability;

  await rental.save();

  return sendResponse(res, 200, true, 'Rental updated successfully', rental);
});

/**
 * Delete Rental Controller
 * Only owner can delete
 */
export const deleteRental = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find rental
  const rental = await Rental.findById(id);

  if (!rental) {
    return sendResponse(res, 404, false, 'Rental not found');
  }

  // Check if user is owner
  if (rental.owner.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Not authorized to delete this rental');
  }

  await Rental.findByIdAndDelete(id);

  return sendResponse(res, 200, true, 'Rental deleted successfully');
});

/**
 * Get My Rentals Controller
 * Get rentals owned by authenticated user
 */
export const getMyRentals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;

  // Calculate pagination
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(parseInt(limit), 50);
  const skip = (pageNum - 1) * limitNum;

  // Get user's rentals
  const rentals = await Rental.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const total = await Rental.countDocuments({ owner: req.user._id });

  return sendResponse(res, 200, true, 'Your rentals fetched successfully', {
    rentals,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

/**
 * Get Rentals by Category Controller
 */
export const getRentalsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 12 } = req.query;

  // Validate category
  const validCategories = ['car', 'bike', 'room', 'equipment', 'other'];
  if (!validCategories.includes(category)) {
    return sendResponse(res, 400, false, 'Invalid category');
  }

  // Calculate pagination
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(parseInt(limit), 50);
  const skip = (pageNum - 1) * limitNum;

  // Get rentals
  const rentals = await Rental.find({
    category,
    availability: true,
  })
    .populate('owner', 'name email phone')
    .sort({ rating: -1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const total = await Rental.countDocuments({
    category,
    availability: true,
  });

  return sendResponse(res, 200, true, `${category} rentals fetched successfully`, {
    rentals,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});
