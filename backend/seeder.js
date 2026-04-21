import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/User.js';
import Rental from './models/Rental.js';
import Booking from './models/Booking.js';

dotenv.config();

/**
 * Seed Database with Sample Data
 * Run: node seeder.js
 */

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Rental.deleteMany({});
    await Booking.deleteMany({});

    // Sample Users
    const users = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'user',
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        phone: '9876543210',
        role: 'user',
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: 'password123',
        phone: '5555555555',
        role: 'user',
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        phone: '1111111111',
        role: 'admin',
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Sample Rentals
    const rentals = await Rental.create([
      // Cars
      {
        title: 'Toyota Camry 2022 - Luxury Automatic',
        category: 'car',
        pricePerDay: 50,
        location: 'New York, NY',
        description:
          'Brand new luxury sedan with automatic transmission, air conditioning, and GPS navigation. Perfect for business trips and city tours.',
        imageUrl:
          'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=350&fit=crop',
        owner: users[0]._id,
        availability: true,
        rating: 4.8,
        reviewCount: 25,
        specifications: {
          transmission: 'Automatic',
          fuel: 'Petrol',
          seating: '5',
          color: 'Silver',
        },
      },
      {
        title: 'Honda Civic 2021 - Economy Car',
        category: 'car',
        pricePerDay: 35,
        location: 'Los Angeles, CA',
        description:
          'Fuel-efficient economy car, ideal for daily commute and short trips. Low emission, good for environment.',
        imageUrl:
          'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=350&fit=crop',
        owner: users[1]._id,
        availability: true,
        rating: 4.5,
        reviewCount: 18,
        specifications: {
          transmission: 'Manual',
          fuel: 'Petrol',
          seating: '5',
          color: 'Red',
        },
      },
      {
        title: 'BMW X5 2023 - Luxury SUV',
        category: 'car',
        pricePerDay: 120,
        location: 'Miami, FL',
        description:
          'Premium luxury SUV with leather interior, panoramic sunroof, and advanced safety features. Perfect for special occasions.',
        imageUrl:
          'https://images.unsplash.com/photo-1606611013016-969c19d14bf1?w=500&h=350&fit=crop',
        owner: users[2]._id,
        availability: true,
        rating: 5.0,
        reviewCount: 12,
        specifications: {
          transmission: 'Automatic',
          fuel: 'Diesel',
          seating: '7',
          color: 'Black',
        },
      },
      // Bikes
      {
        title: 'Mountain Bike - Trek X-Caliber',
        category: 'bike',
        pricePerDay: 25,
        location: 'Denver, CO',
        description:
          'Professional grade mountain bike with full suspension. Great for trail riding and outdoor adventures.',
        imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=350&fit=crop',
        owner: users[0]._id,
        availability: true,
        rating: 4.7,
        reviewCount: 30,
        specifications: {
          type: 'Mountain',
          suspension: 'Full',
          gears: '21',
        },
      },
      {
        title: 'Road Bike - Specialized Tarmac',
        category: 'bike',
        pricePerDay: 30,
        location: 'Austin, TX',
        description:
          'Lightweight road bike perfect for speed and long-distance cycling. Carbon frame, drop bars.',
        imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=350&fit=crop',
        owner: users[1]._id,
        availability: true,
        rating: 4.6,
        reviewCount: 22,
        specifications: {
          type: 'Road',
          weight: '7kg',
          gears: '18',
        },
      },
      // Rooms
      {
        title: 'Luxury Loft Apartment - Downtown',
        category: 'room',
        pricePerDay: 150,
        location: 'New York, NY',
        description:
          'Spacious loft apartment with modern furnishings, kitchen, and spectacular city views. Perfect for families.',
        imageUrl:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=350&fit=crop',
        owner: users[2]._id,
        availability: true,
        rating: 4.9,
        reviewCount: 45,
        specifications: {
          bedrooms: '2',
          bathrooms: '2',
          area: '1200 sqft',
          amenities: 'WiFi, Kitchen, Parking',
        },
      },
      {
        title: 'Cozy Studio - Beach Side',
        category: 'room',
        pricePerDay: 80,
        location: 'Miami, FL',
        description:
          'Small but comfortable studio apartment with beach access. Great for couples or solo travelers.',
        imageUrl:
          'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500&h=350&fit=crop',
        owner: users[0]._id,
        availability: true,
        rating: 4.4,
        reviewCount: 28,
        specifications: {
          bedrooms: '1',
          bathrooms: '1',
          area: '350 sqft',
          amenities: 'WiFi, AC, Beach Access',
        },
      },
      // Equipment
      {
        title: 'Professional Photography Camera Kit',
        category: 'equipment',
        pricePerDay: 75,
        location: 'Los Angeles, CA',
        description:
          'Canon EOS 5D Mark IV with lenses and tripod. Perfect for photography professionals and enthusiasts.',
        imageUrl:
          'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=350&fit=crop',
        owner: users[1]._id,
        availability: true,
        rating: 4.8,
        reviewCount: 35,
        specifications: {
          camera: 'Canon EOS 5D Mark IV',
          lenses: '2x Professional Lenses',
          tripod: 'Carbon Fiber',
        },
      },
      {
        title: 'Camping Gear Bundle',
        category: 'equipment',
        pricePerDay: 40,
        location: 'Portland, OR',
        description:
          'Complete camping package including tent, sleeping bag, and cooking equipment. Ready for outdoor adventures.',
        imageUrl:
          'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&h=350&fit=crop',
        owner: users[2]._id,
        availability: true,
        rating: 4.5,
        reviewCount: 20,
        specifications: {
          tent: 'Capacity 3 people',
          sleepingBag: '2 included',
          cookware: 'Complete Set',
        },
      },
    ]);

    console.log(`✅ Created ${rentals.length} rentals`);

    // Sample Bookings
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days

    const bookings = await Booking.create([
      {
        user: users[1]._id,
        rental: rentals[0]._id,
        startDate,
        endDate,
        numberOfDays: 5,
        pricePerDay: 50,
        totalPrice: 250,
        status: 'confirmed',
        paymentStatus: 'completed',
        rating: 5,
        review: 'Excellent car rental experience! Clean car, smooth ride.',
      },
      {
        user: users[2]._id,
        rental: rentals[3]._id,
        startDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000),
        numberOfDays: 2,
        pricePerDay: 25,
        totalPrice: 50,
        status: 'confirmed',
        paymentStatus: 'completed',
      },
    ]);

    console.log(`✅ Created ${bookings.length} bookings`);

    console.log(`
╔════════════════════════════════════════╗
║      Database Seeded Successfully!     ║
╠════════════════════════════════════════╣
║  👥 Users: ${users.length}
║  🏠 Rentals: ${rentals.length}
║  📅 Bookings: ${bookings.length}
╚════════════════════════════════════════╝

Test Credentials:
- Email: alice@example.com (User)
- Email: admin@example.com (Admin)
- Password: password123 (for users)
- Password: admin123 (for admin)
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
