import User from '../models/User.js';
import { sendResponse, asyncHandler, CustomError } from '../utils/helpers.js';
import { generateToken } from '../utils/tokenUtils.js';

/**
 * Register Controller
 * Create new user account
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return sendResponse(res, 400, false, 'Email already registered');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  // Generate token
  const token = generateToken(user._id);

  // Return response
  return sendResponse(res, 201, true, 'User registered successfully', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

/**
 * Login Controller
 * Authenticate user and return JWT token
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return sendResponse(res, 401, false, 'Invalid credentials');
  }

  // Compare passwords
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return sendResponse(res, 401, false, 'Invalid credentials');
  }

  // Generate token
  const token = generateToken(user._id);

  // Return response
  return sendResponse(res, 200, true, 'Login successful', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

/**
 * Get Current User Controller
 * Return authenticated user details
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return sendResponse(res, 200, true, 'User fetched successfully', {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
  });
});

/**
 * Update User Profile Controller
 * Update user information
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, profileImage } = req.body;

  const user = req.user;

  // Update fields
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (profileImage) user.profileImage = profileImage;

  await user.save();

  return sendResponse(res, 200, true, 'Profile updated successfully', {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profileImage: user.profileImage,
  });
});

/**
 * Logout Controller
 * Frontend handles this by removing token from localStorage
 */
export const logout = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Logged out successfully');
});
