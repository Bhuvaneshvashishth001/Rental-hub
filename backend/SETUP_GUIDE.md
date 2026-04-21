# BACKEND SETUP GUIDE

Get your Rental Services backend running in 5 minutes!

## ✅ Prerequisites

1. **Node.js** - Download from [nodejs.org](https://nodejs.org/) (v14+)
2. **MongoDB** - Either:
   - Local: Download from [mongodb.com](https://mongodb.com/try/download/community)
   - Cloud: Free tier at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
3. **Git** (optional) - For version control

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
npm install
```

### Step 2: Setup Environment Variables

Create `.env` file in the `backend` folder:

```env
MONGODB_URI=mongodb://localhost:27017/rental-services
JWT_SECRET=change_this_secret_key_in_production
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_EXPIRE=7d
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rental-services?retryWrites=true&w=majority
```

### Step 3: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   🚀 Rental Services Backend Running   ║
╠════════════════════════════════════════╣
║   Server: http://localhost:5000         
║   Environment: DEVELOPMENT
║   Database: MongoDB Connected
╚════════════════════════════════════════╝
```

### Step 4: Test the Server

Open your browser or Postman and go to:
```
http://localhost:5000/api/health
```

You should get:
```json
{
  "success": true,
  "message": "Backend is running",
  "timestamp": "2024-04-16T10:30:00.000Z"
}
```

✅ Backend is ready!

---

## 🧪 Test First API Request

### Register a New User

Using **Postman**:

1. Create a new request
2. Set method to `POST`
3. URL: `http://localhost:5000/api/auth/register`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```
6. Click **Send**

Using **cURL**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

**Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "user"
    }
  }
}
```

---

## 🔗 Connecting Frontend to Backend

Update your React frontend's API client:

**File: `src/services/apiClient.js`**

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-add JWT token
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

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**Usage in React:**

```javascript
import apiClient from './services/apiClient';

// Login
async function handleLogin(email, password) {
  try {
    const res = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('authToken', res.data.data.token);
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error.response.data.message);
  }
}

// Get rentals
async function fetchRentals() {
  try {
    const res = await apiClient.get('/rentals');
    return res.data.data.rentals;
  } catch (error) {
    console.error('Failed to fetch rentals');
  }
}
```

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to MongoDB"

**Solution:**
1. Check MongoDB is running (local or cloud)
2. Verify MONGODB_URI in `.env` is correct
3. For MongoDB Atlas, ensure IP is whitelisted

### Problem: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: CORS errors from frontend

**Solution:** Update `.env`:
```env
CLIENT_URL=http://localhost:3000  # or your frontend URL
```

### Problem: "Port 5000 already in use"

**Solution:** Either:
1. Kill the process using port 5000
2. Change PORT in `.env` to another number (e.g., 5001)

### Problem: JWT token errors

**Solution:**
1. Ensure JWT_SECRET is set in `.env`
2. Check token is included in Authorization header
3. Token format: `Bearer <token_here>`

---

## 📱 Change Port

Edit `.env`:
```env
PORT=3001
```

Then restart:
```bash
npm run dev
```

Server will now run on `http://localhost:3001/api`

---

## 🔐 Security Settings (Production)

Before deploying to production:

1. **Change JWT_SECRET** to a strong random string:
```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. **Update CLIENT_URL** to your production frontend URL

3. **Set NODE_ENV to production**:
```env
NODE_ENV=production
```

4. **Use MongoDB Atlas** (cloud) instead of local MongoDB

5. **Enable HTTPS** on your hosting

6. **Update CORS** to only allow your domain

---

## 📊 Database Models

### User Schema
- `name`: String (3+ chars)
- `email`: String (unique)
- `password`: String (hashed)
- `phone`: String (10 digits)
- `role`: String (user/admin)
- `profileImage`: String (URL)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Rental Schema
- `title`: String
- `category`: String (car/bike/room/equipment/other)
- `pricePerDay`: Number
- `location`: String
- `description`: String
- `imageUrl`: String
- `owner`: ObjectId (User reference)
- `availability`: Boolean
- `rating`: Number (0-5)
- `createdAt`: Timestamp

### Booking Schema
- `user`: ObjectId (User reference)
- `rental`: ObjectId (Rental reference)
- `startDate`: Date
- `endDate`: Date
- `numberOfDays`: Number
- `totalPrice`: Number
- `status`: String (pending/confirmed/cancelled/completed)
- `paymentStatus`: String (pending/completed/failed)
- `rating`: Number (1-5)
- `review`: String
- `createdAt`: Timestamp

---

## 📚 Useful Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Install a new package
npm install package-name

# Run specific file
node filename.js

# Check Node version
node -v

# Check npm version
npm -v
```

---

## 📞 Getting Help

1. Check [API_REFERENCE.md](./API_REFERENCE.md) for endpoint documentation
2. Check [README.md](./README.md) for detailed setup
3. Review error messages in console
4. Verify .env variables are correct
5. Check MongoDB connection is working

---

## ✨ You're All Set!

Your backend is ready to serve your frontend. Now:

1. ✅ Backend running on `http://localhost:5000`
2. ✅ MongoDB connected
3. ✅ JWT authentication ready
4. ✅ All APIs implemented
5. ✅ Ready to integrate with React frontend

**Next Steps:**
- Start your React frontend
- Connect it to backend using provided API client
- Test login, rentals, bookings
- Deploy to production

Happy coding! 🚀
