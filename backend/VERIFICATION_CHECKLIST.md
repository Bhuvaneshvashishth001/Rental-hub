# ✅ BACKEND VERIFICATION CHECKLIST

Complete this checklist to ensure everything is working correctly.

## 📦 Installation & Setup

- [ ] Node.js installed (`node -v`)
- [ ] Project dependencies installed (`npm install`)
- [ ] `.env` file created with correct values
- [ ] MongoDB connection configured
- [ ] JWT_SECRET changed to secure value
- [ ] Required node_modules directory exists

## 🗄️ Database

- [ ] MongoDB server is running (local or Atlas)
- [ ] MongoDB connection string is correct
- [ ] Can connect to database from server
- [ ] Database name is correct (`rental-services`)
- [ ] Collections will be auto-created by Mongoose

## 🚀 Server Startup

```bash
# Run this command:
npm run dev
```

- [ ] Server starts without errors
- [ ] Listening on correct port (5000)
- [ ] Shows "✅ MongoDB Connected" message
- [ ] Shows version and environment info
- [ ] No unhandled exceptions in console

## 🧪 API Health Check

**Test:** Open in browser or Postman
```
GET http://localhost:5000/api/health
```

- [ ] Returns 200 status code
- [ ] Response includes `success: true`
- [ ] Response includes current timestamp
- [ ] Message says "Backend is running"

## 📊 Seed Sample Data

Run this command:
```bash
node seeder.js
```

- [ ] Command completes without errors
- [ ] Shows "✅ Database Seeded Successfully"
- [ ] Returns user count (should be 4)
- [ ] Returns rental count (should be 9)
- [ ] Returns booking count (should be 2)
- [ ] Provides test credentials

## 🔐 Authentication Endpoints

### 1. Register New User

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456",
    "phone": "1234567890"
  }'
```

- [ ] Returns 201 status code
- [ ] Response includes JWT token
- [ ] Response includes user data
- [ ] Token is not empty string

### 2. Login User

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

- [ ] Returns 200 status code
- [ ] Response includes JWT token
- [ ] Token matches registration token format
- [ ] User email matches request

### 3. Get Current User (Protected)

**Request:**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Replace `YOUR_TOKEN_HERE` with token from login**

- [ ] Returns 200 status code
- [ ] User data matches logged-in user
- [ ] Includes name, email, phone, role
- [ ] Fails when token is missing (401)
- [ ] Fails when token is invalid (401)

## 🏠 Rental Endpoints

### 1. Get All Rentals

**Request:**
```bash
curl http://localhost:5000/api/rentals
```

- [ ] Returns 200 status code
- [ ] Response includes rentals array
- [ ] Response includes pagination info
- [ ] Shows at least 9 rentals (from seeding)
- [ ] Supports pagination: `?page=1&limit=12`
- [ ] Supports filtering: `?category=car`
- [ ] Supports search: `?search=Toyota`

### 2. Get Single Rental

**Request:**
```bash
curl http://localhost:5000/api/rentals/RENTAL_ID
```

- [ ] Returns 200 status code
- [ ] Returns complete rental details
- [ ] Includes owner information
- [ ] Returns 404 for invalid ID

### 3. Get My Rentals (Protected)

**Request:**
```bash
curl http://localhost:5000/api/rentals/my-rentals/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

- [ ] Returns 200 status code
- [ ] Returns only user's rentals
- [ ] Returns 401 without token
- [ ] Includes pagination info

### 4. Create Rental (Protected)

**Request:**
```bash
curl -X POST http://localhost:5000/api/rentals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "New Rental",
    "category": "car",
    "pricePerDay": 50,
    "location": "New York",
    "description": "A great item for rent with full specifications",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

- [ ] Returns 201 status code
- [ ] Includes created rental data
- [ ] Sets owner to current user
- [ ] Returns 400 for invalid data
- [ ] Returns 401 without token

### 5. Update Rental (Protected)

**Request:**
```bash
curl -X PUT http://localhost:5000/api/rentals/RENTAL_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pricePerDay": 60,
    "availability": true
  }'
```

- [ ] Returns 200 status code
- [ ] Returns updated rental data
- [ ] Returns 403 if not owner
- [ ] Returns 404 for invalid ID

### 6. Delete Rental (Protected)

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/rentals/RENTAL_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

- [ ] Returns 200 status code
- [ ] Includes success message
- [ ] Returns 403 if not owner
- [ ] Returns 404 for invalid ID

## 📅 Booking Endpoints

### 1. Create Booking (Protected)

**Request:**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "rentalId": "RENTAL_ID",
    "startDate": "2024-12-25",
    "endDate": "2024-12-30"
  }'
```

- [ ] Returns 201 status code
- [ ] Calculates numberOfDays correctly
- [ ] Calculates totalPrice correctly
- [ ] Sets status to "pending"
- [ ] Returns 400 for past dates
- [ ] Returns 400 for overlapping bookings

### 2. Get My Bookings (Protected)

**Request:**
```bash
curl http://localhost:5000/api/bookings/my-bookings/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

- [ ] Returns 200 status code
- [ ] Returns all user's bookings
- [ ] Includes rental and user details
- [ ] Sorted by creation date

### 3. Get Booking Details (Protected)

**Request:**
```bash
curl http://localhost:5000/api/bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

- [ ] Returns 200 status code
- [ ] Returns complete booking details
- [ ] Returns 403 for unauthorized user
- [ ] Returns 404 for invalid ID

### 4. Confirm Booking (Protected)

**Request:**
```bash
curl -X PUT http://localhost:5000/api/bookings/BOOKING_ID/confirm \
  -H "Authorization: Bearer YOUR_TOKEN"
```

- [ ] Returns 200 status code
- [ ] Changes status to "confirmed"
- [ ] Changes paymentStatus to "completed"
- [ ] Returns 403 for unauthorized user

### 5. Cancel Booking (Protected)

**Request:**
```bash
curl -X PUT http://localhost:5000/api/bookings/BOOKING_ID/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "reason": "Changed my plans"
  }'
```

- [ ] Returns 200 status code
- [ ] Changes status to "cancelled"
- [ ] Sets cancellationReason
- [ ] Sets paymentStatus to "refunded"
- [ ] Returns 403 for unauthorized user

## 💡 Recommendation Endpoints

### 1. Get General Recommendations

**Request (Anonymous):**
```bash
curl http://localhost:5000/api/recommendations
```

**Request (Authenticated):**
```bash
curl http://localhost:5000/api/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

- [ ] Returns 200 status code
- [ ] Returns recommendations array
- [ ] Anonymous gets trending items
- [ ] Authenticated gets personalized

### 2. Get by Category

**Request:**
```bash
curl "http://localhost:5000/api/recommendations/category?category=car&limit=6"
```

- [ ] Returns 200 status code
- [ ] Returns only car rentals
- [ ] Respects limit parameter
- [ ] Shows highest rated first

### 3. Get Similar Rentals

**Request:**
```bash
curl http://localhost:5000/api/recommendations/similar/RENTAL_ID?limit=5
```

- [ ] Returns 200 status code
- [ ] Returns similar category items
- [ ] Excludes original rental
- [ ] Shows highest rated first

### 4. Get Trending

**Request:**
```bash
curl http://localhost:5000/api/recommendations/trending/top?limit=8
```

- [ ] Returns 200 status code
- [ ] Returns highly rated items (>=4 stars)
- [ ] Shows most reviewed first

## 🛡️ Security & Validation

### 1. Input Validation

Test with invalid data:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "J",
    "email": "invalid-email",
    "password": "123",
    "phone": "123"
  }'
```

- [ ] Returns 400 status code
- [ ] Shows validation errors for each field
- [ ] Name must be 3+ characters
- [ ] Email must be valid format
- [ ] Password must be 6+ characters
- [ ] Phone must be 10 digits

### 2. Rate Limiting

Make 6+ login attempts quickly:
```bash
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

- [ ] First 5 attempts processed
- [ ] 6th attempt returns 429 (Too Many Requests)
- [ ] Rate limit message shown

### 3. Authorization

Try endpoints without token:
```bash
curl http://localhost:5000/api/rentals/my-rentals/list
```

- [ ] Returns 401 Unauthorized
- [ ] Shows "No token provided" message

Try endpoints with invalid token:
```bash
curl http://localhost:5000/api/rentals/my-rentals/list \
  -H "Authorization: Bearer invalid-token"
```

- [ ] Returns 401 Unauthorized
- [ ] Shows "Invalid token" message

### 4. Ownership Checks

- [ ] Can't update others' rentals (returns 403)
- [ ] Can't delete others' rentals (returns 403)
- [ ] Can't view others' bookings (returns 403)
- [ ] Can't cancel others' bookings (returns 403)

## 📊 Database Verification

### Check MongoDB Collections

Using MongoDB CLI or Compass:

```javascript
// In MongoDB Shell
use rental-services

// Check collections
show collections

// Should show:
// - users
// - rentals
// - bookings

// Check document counts
db.users.countDocuments()      // Should be 4
db.rentals.countDocuments()    // Should be 9
db.bookings.countDocuments()   // Should be 2
```

- [ ] Users collection exists
- [ ] Rentals collection exists
- [ ] Bookings collection exists
- [ ] All users have hashed passwords
- [ ] Timestamps on all documents
- [ ] References properly linked

## 🔄 Data Relationships

### 1. Rental Owner References

```bash
curl http://localhost:5000/api/rentals/RENTAL_ID
```

- [ ] Rental has `owner` field (ObjectId)
- [ ] Owner matches a user in database
- [ ] Owner details populated in response

### 2. Booking References

```bash
curl http://localhost:5000/api/bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

- [ ] Has `user` ObjectId reference
- [ ] Has `rental` ObjectId reference
- [ ] User and rental details populated
- [ ] Dates stored as ISO format

## 🚨 Error Handling

### 1. Database Errors

Stop MongoDB and try request:

- [ ] Returns 500 status code
- [ ] Shows error message
- [ ] Server stays running
- [ ] Can recover when DB back up

### 2. Validation Errors

Send invalid JSON:
```bash
curl -X POST http://localhost:5000/api/rentals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d 'invalid json'
```

- [ ] Returns 400 status code
- [ ] Shows meaningful error
- [ ] Doesn't crash server

### 3. Not Found Errors

Request non-existent resource:
```bash
curl http://localhost:5000/api/rentals/000000000000000000000000
```

- [ ] Returns 404 status code
- [ ] Shows "not found" message

## 📈 Performance Checks

### 1. Response Times

```bash
curl -w "Total time: %{time_total}s\n" \
  http://localhost:5000/api/rentals
```

- [ ] Response time under 500ms
- [ ] Generally under 200ms
- [ ] No timeouts

### 2. Pagination Works

```bash
curl "http://localhost:5000/api/rentals?page=2&limit=3"
```

- [ ] Returns correct page
- [ ] Returns correct limit
- [ ] Shows pagination info
- [ ] Shows correct total count

## 🎯 CORS & Frontend Ready

### 1. CORS Headers Present

```bash
curl -i http://localhost:5000/api/health
```

- [ ] Response includes `Access-Control-Allow-Origin`
- [ ] Set to CLIENT_URL value from .env
- [ ] Includes proper CORS headers

### 2. Preflight Requests Work

```bash
curl -X OPTIONS http://localhost:5000/api/auth/login \
  -H "Access-Control-Request-Method: POST"
```

- [ ] Returns 200 status code
- [ ] Includes CORS headers
- [ ] Allows POST method

## 📝 Logging & Monitoring

- [ ] Console shows incoming requests
- [ ] Console shows database operations
- [ ] Errors logged with stack traces
- [ ] Timestamps on all log messages
- [ ] No sensitive data in logs

## ✨ Final Checks

- [ ] Server starts without warnings
- [ ] All dependencies loaded correctly
- [ ] No unhandled promise rejections
- [ ] Environment variables loaded
- [ ] CORS configured for frontend
- [ ] JWT tokens working correctly
- [ ] Database properly indexed
- [ ] All features working as expected

## 🎊 Success!

If all items are checked:

✅ **Backend is fully functional and production-ready!**

### Next Steps:
1. Connect React frontend
2. Test end-to-end flow
3. Deploy to production

---

**Keep this checklist handy for future reference!**
