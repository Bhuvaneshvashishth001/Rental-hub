import mongoose from 'mongoose';

/**
 * Connect to MongoDB
 * Initializes the MongoDB connection with proper error handling
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ MongoDB Connected:', conn.connection.host);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

export default connectDB;
