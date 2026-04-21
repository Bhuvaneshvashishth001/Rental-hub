# Rental Services Backend

A production-ready Node.js/Express backend for a rental services platform with MongoDB integration, JWT authentication, and comprehensive REST APIs.

## 🚀 Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Rental Listings Management
- ✅ Booking System
- ✅ Recommendation Engine
- ✅ Rate Limiting & Validation
- ✅ CORS Enabled for Frontend Integration
- ✅ Error Handling & Logging
- ✅ MongoDB with Mongoose ODM
- ✅ Async/Await Error Handling

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

Or with yarn:

```bash
yarn install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/rental-services

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173
```

### 3. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/           # Database configuration
│   └── database.js
├── controllers/      # Request handlers
│   ├── authController.js
│   ├── rentalController.js
│   ├── bookingController.js
│   └── recommendationController.js
├── models/          # Mongoose schemas
│   ├── User.js
│   ├── Rental.js
│   └── Booking.js
├── routes/          # API endpoints
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── rentalRoutes.js
│   ├── bookingRoutes.js
│   └── recommendationRoutes.js
├── middlewares/     # Express middleware
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── validationMiddleware.js
│   └── rateLimitMiddleware.js
├── services/        # Business logic layer
│   ├── bookingService.js
│   └── recommendationService.js
├── utils/          # Utility functions
│   ├── helpers.js
│   └── tokenUtils.js
├── .env            # Environment variables
├── package.json
└── server.js       # Main server file
```

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

### Authentication Routes

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "user"
    }
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /auth/me
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "9876543210"
}
```

### User Routes

#### Get User Profile
```http
GET /user/profile
Authorization: Bearer <jwt_token>
```

### Rental Routes

#### Create Rental
```http
POST /rentals
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Toyota Camry 2022",
  "category": "car",
  "pricePerDay": 50,
  "location": "New York",
  "description": "Luxury sedan available for daily rental",
  "imageUrl": "https://example.com/car.jpg",
  "specifications": {
    "transmission": "Automatic",
    "fuel": "Petrol"
  }
}
```

#### Get All Rentals
```http
GET /rentals?category=car&location=New York&page=1&limit=12&search=Toyota
```

#### Get Rental by ID
```http
GET /rentals/:id
```

#### Get My Rentals
```http
GET /rentals/my-rentals/list
Authorization: Bearer <jwt_token>
```

#### Update Rental
```http
PUT /rentals/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "pricePerDay": 60
}
```

#### Delete Rental
```http
DELETE /rentals/:id
Authorization: Bearer <jwt_token>
```

#### Get Rentals by Category
```http
GET /rentals/category/:category
```

### Booking Routes

#### Create Booking
```http
POST /bookings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "rentalId": "rental_id",
  "startDate": "2024-12-25",
  "endDate": "2024-12-30"
}
```

#### Get User's Bookings
```http
GET /bookings/my-bookings/list
Authorization: Bearer <jwt_token>
```

#### Get Booking by ID
```http
GET /bookings/:id
Authorization: Bearer <jwt_token>
```

#### Confirm Booking
```http
PUT /bookings/:id/confirm
Authorization: Bearer <jwt_token>
```

#### Cancel Booking
```http
PUT /bookings/:id/cancel
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "reason": "Changed plans"
}
```

#### Add Review
```http
POST /bookings/:id/review
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "rating": 5,
  "review": "Great experience!"
}
```

#### Get Bookings for My Rentals
```http
GET /bookings/my-rentals/bookings
Authorization: Bearer <jwt_token>
```

#### Get All Bookings (Admin only)
```http
GET /bookings?status=confirmed&page=1&limit=10
Authorization: Bearer <admin_jwt_token>
```

### Recommendation Routes

#### Get Recommendations
```http
GET /recommendations
Authorization: Bearer <jwt_token> (Optional - gives personalized)
```

#### Get Recommendations by Category
```http
GET /recommendations/category?category=car&location=New York&limit=6
```

#### Get Similar Rentals
```http
GET /recommendations/similar/:id?limit=5
```

#### Get Trending Rentals
```http
GET /recommendations/trending/top?limit=8
```

#### Get Personalized Recommendations
```http
GET /recommendations/personalized/my?limit=6
Authorization: Bearer <jwt_token>
```

## 📊 Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

## 🔐 Authentication

Include JWT token in request headers:

```
Authorization: Bearer <your_jwt_token>
```

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Rate limiting on auth endpoints
- Input validation with express-validator
- CORS protection
- Global error handling

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.0",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "express-validator": "^7.0.0",
  "express-rate-limit": "^7.0.0"
}
```

## 🚀 Frontend Integration

### Setup Axios Instance

Create `src/services/apiClient.js`:

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
```

### Use in React Components

```javascript
import apiClient from './services/apiClient';

// Login
const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  localStorage.setItem('authToken', response.data.data.token);
  return response.data;
};

// Get rentals
const getRentals = async () => {
  const response = await apiClient.get('/rentals');
  return response.data.data.rentals;
};

// Create booking
const createBooking = async (rentalId, startDate, endDate) => {
  const response = await apiClient.post('/bookings', {
    rentalId,
    startDate,
    endDate,
  });
  return response.data;
};
```

## 🧪 Testing API Endpoints

### Using Postman

1. Import the endpoints provided above
2. Set up environment variables:
   - `{{base_url}}`: http://localhost:5000/api
   - `{{token}}`: Your JWT token from login

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get Rentals
curl http://localhost:5000/api/rentals
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify connection string format

### CORS Error
- Update CLIENT_URL in .env
- Ensure frontend URL matches exactly

### JWT Errors
- Verify JWT_SECRET is set
- Check token expiration
- Ensure token is included in Authorization header

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/rental-services |
| JWT_SECRET | Secret key for JWT signing | change_in_production |
| JWT_EXPIRE | JWT expiration time | 7d |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💡 Support

For issues and questions, please create an issue in the repository.

---

**Happy Coding! 🚀**
