import mongoose from 'mongoose';

/**
 * Rental Schema - Stores rental item listings
 */
const rentalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      enum: ['car', 'bike', 'room', 'equipment', 'other'],
      required: [true, 'Please select a category'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Please provide price per day'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      minlength: [10, 'Description must be at least 10 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    specifications: {
      // For cars, bikes, etc.
      type: Map,
      of: String,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
rentalSchema.index({ category: 1, location: 1 });
rentalSchema.index({ owner: 1 });

const Rental = mongoose.model('Rental', rentalSchema);

export default Rental;
