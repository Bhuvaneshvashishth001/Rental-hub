# Rental Services API - Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Common Response Format
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {}
}
```

---

## 1. AUTHENTICATION

### Register
```
POST /auth/register

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "1234567890"
}
```

### Login
```
POST /auth/login

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

Response includes JWT token to use in Authorization header.

### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer {token}
```

### Update Profile
```
PUT /auth/me
Headers: Authorization: Bearer {token}

{
  "name": "Jane Doe",
  "phone": "9876543210",
  "profileImage": "https://example.com/profile.jpg"
}
```

### Logout
```
POST /auth/logout
Headers: Authorization: Bearer {token}
```

---

## 2. USER

### Get User Profile
```
GET /user/profile
Headers: Authorization: Bearer {token}
```

---

## 3. RENTALS

### Create Rental Listing
```
POST /rentals
Headers: Authorization: Bearer {token}

{
  "title": "Toyota Camry 2022",
  "category": "car",
  "pricePerDay": 50.00,
  "location": "New York, NY",
  "description": "Luxury automatic sedan, air conditioning, GPS navigation",
  "imageUrl": "https://example.com/car.jpg",
  "specifications": {
    "transmission": "Automatic",
    "fuelType": "Petrol",
    "seatingCapacity": "5"
  }
}
```

### Get All Rentals
```
GET /rentals?category=car&location=New York&page=1&limit=12&search=Camry
```

Query Parameters:
- `category`: car, bike, room, equipment, or other
- `location`: Location name (case-insensitive search)
- `search`: Search in title and description
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12, max: 50)

### Get Single Rental
```
GET /rentals/{rentalId}
```

### Get Rentals by Category
```
GET /rentals/category/{category}?page=1&limit=12
```

### Get My Rentals (Owner)
```
GET /rentals/my-rentals/list?page=1&limit=12
Headers: Authorization: Bearer {token}
```

### Update Rental
```
PUT /rentals/{rentalId}
Headers: Authorization: Bearer {token}

{
  "title": "Updated Title",
  "pricePerDay": 60.00,
  "availability": true
}
```

### Delete Rental
```
DELETE /rentals/{rentalId}
Headers: Authorization: Bearer {token}
```

---

## 4. BOOKINGS

### Create Booking
```
POST /bookings
Headers: Authorization: Bearer {token}

{
  "rentalId": "rental_id_here",
  "startDate": "2024-12-25",
  "endDate": "2024-12-30"
}
```

### Get My Bookings
```
GET /bookings/my-bookings/list
Headers: Authorization: Bearer {token}
```

### Get Booking Details
```
GET /bookings/{bookingId}
Headers: Authorization: Bearer {token}
```

### Confirm Booking (After Payment)
```
PUT /bookings/{bookingId}/confirm
Headers: Authorization: Bearer {token}
```

### Cancel Booking
```
PUT /bookings/{bookingId}/cancel
Headers: Authorization: Bearer {token}

{
  "reason": "Changed my plans"
}
```

### Add Review/Rating
```
POST /bookings/{bookingId}/review
Headers: Authorization: Bearer {token}

{
  "rating": 5,
  "review": "Excellent service and item condition!"
}
```

### Get Bookings for My Rentals
```
GET /bookings/my-rentals/bookings?status=confirmed&page=1&limit=10
Headers: Authorization: Bearer {token}
```

### Get All Bookings (Admin)
```
GET /bookings?status=confirmed&page=1&limit=10
Headers: Authorization: Bearer {admin_token}
```

---

## 5. RECOMMENDATIONS

### Get Recommendations (Smart - Personalized if Logged In)
```
GET /recommendations?limit=8
Headers: Authorization: Bearer {token} (Optional - enhances results with personalization)
```

### Get Recommendations by Category
```
GET /recommendations/category?category=car&location=New York&limit=6
```

### Get Similar Rentals
```
GET /recommendations/similar/{rentalId}?limit=5
```

### Get Trending Rentals
```
GET /recommendations/trending/top?limit=8
```

### Get Personalized Recommendations
```
GET /recommendations/personalized/my?limit=6
Headers: Authorization: Bearer {token}
```

---

## QUICK INTEGRATION EXAMPLE (React + Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
async function login(email, password) {
  const res = await apiClient.post('/auth/login', { email, password });
  localStorage.setItem('authToken', res.data.data.token);
  return res.data;
}

// Get Rentals
async function getRentals(category, page = 1) {
  const res = await apiClient.get('/rentals', {
    params: { category, page, limit: 12 }
  });
  return res.data.data;
}

// Create Booking
async function createBooking(rentalId, startDate, endDate) {
  const res = await apiClient.post('/bookings', {
    rentalId, startDate, endDate
  });
  return res.data;
}
```

---

## HTTP STATUS CODES

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error |

---

## AUTHENTICATION HEADER FORMAT

All protected endpoints require:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## CATEGORY OPTIONS

- `car` - Vehicles
- `bike` - Bicycles/Motorcycles
- `room` - Accommodation
- `equipment` - Tools/Sports Equipment
- `other` - Other items

---

## TEST CREDENTIALS

After running the backend and creating test data:

```
Email: test@example.com
Password: testpass123
```

---

## RATE LIMITS

- General: 100 requests per 15 minutes
- Auth (login/register): 5 attempts per 15 minutes
- Create resources: 30 per hour

---

## ERROR RESPONSE EXAMPLE

```json
{
  "success": false,
  "message": "Rental not found",
  "data": null
}
```

---

**For complete API documentation, see README.md**
