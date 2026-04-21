# Quick Reference - Fixed Code Snippets

## 1. API Client Utility (`src/lib/api.ts`)

The API client handles all communication with the backend with automatic error handling, logging, and token management.

**Key Features:**
- Centralized fetch wrapper
- Automatic Bearer token attachment
- Detailed console logging with emoji prefixes
- Parse JSON and check response status
- Dedicated endpoints for Auth/Rental/Booking APIs

**Usage:**
```typescript
const response = await authAPI.register({
  name: "John",
  email: "john@example.com",
  password: "pass123",
  phone: "1234567890"
});

if (response.success) {
  setAuthToken(response.data.token);
  // User is now authenticated
}
```

---

## 2. Auth Context (`src/contexts/AuthContext.tsx`)

Global state management for authentication.

**Provides:**
- `user` - Current logged-in user object
- `isAuthenticated` - Boolean login status
- `loading` - Loading state while fetching user
- `login()` - Update user state after login
- `logout()` - Clear user and token
- `setUser()` - Update user data

**Usage:**
```typescript
const { user, isAuthenticated, login, logout } = useAuth();

if (isAuthenticated) {
  <p>Welcome, {user.name}</p>
}

// After login/register:
login(userData, token);

// On logout:
logout();
```

---

## 3. Register Form (`src/pages/Register.tsx`)

**Key Changes:**
- Validates phone number (10 digits)
- Calls `authAPI.register()` with form data
- Saves auth token using `setAuthToken()`
- Uses `useAuth()` hook to store user
- Shows loading state (disabled inputs, spinner button)
- Full console logging for debugging

**Console Output:**
```
📝 [FORM SUBMIT] Registration data: {...}
🚀 [API CALL] Calling /api/auth/register...
📡 [API REQUEST] POST http://localhost:5000/api/auth/register {...}
✅ [API SUCCESS] Registration response: {...}
✅ Auth token saved to localStorage
```

---

## 4. Login Form (`src/pages/Login.tsx`)

**Key Changes:**
- Calls `authAPI.login()` with email/password
- Same auth token saving and user state update
- Loading state management
- Console logging for debugging
- Error handling with toast messages

---

## 5. Dashboard (`src/pages/Dashboard.tsx`)

**Key Changes:**
✅ Displays real user data:
```typescript
<h1>Welcome, {user?.name || "User"}!</h1>
<img src={user?.profileImage || defaultAvatar} />
```

✅ Fetches bookings from API:
```typescript
useEffect(() => {
  if (user) {
    fetchUserBookings();
    fetchUserItems();
  }
}, [user]);

const fetchUserBookings = async () => {
  const response = await bookingAPI.getAll();
  setBookings(response.data);
};
```

✅ Fallback to sample data if API fails
✅ Loading states for better UX
✅ Protects dashboard - redirects if not authenticated

---

## 6. App Component (`src/App.tsx`)

**Key Change:**
Wrapped app with `AuthProvider`:

```typescript
<AuthProvider>
  <TooltipProvider>
    <BrowserRouter>
      {/* Routes here */}
    </BrowserRouter>
  </TooltipProvider>
</AuthProvider>
```

---

## 7. Environment File (`.env`)

**Frontend Configuration:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend Configuration** (already exists):
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## Console Debugging Reference

### ✅ Success Indicators

Look for these in browser console when everything works:

```javascript
// Registration
📝 [FORM SUBMIT] Registration data: {...}
🚀 [API CALL] Calling /api/auth/register...
📡 [API REQUEST] POST http://localhost:5000/api/auth/register
✅ [API SUCCESS] Registration response: {success: true, data: {token, user}}
✅ Auth token saved to localStorage
✅ [AUTH] User logged in after registration: {id, name, email, phone}

// Login
📝 [FORM SUBMIT] Login attempt: {email, password: "***"}
🚀 [API CALL] Calling /api/auth/login...
✅ [API SUCCESS] Login response: {success: true, data: {token, user}}
✅ [AUTH] User logged in: {id, name, email, phone}

// Dashboard
✅ Current user loaded: {id, name, email, phone}
📡 [API] Fetching user bookings...
✅ [API] Bookings fetched: [...]
📡 [API] Fetching user items...
✅ [API] Items fetched: [...]
```

### ❌ Error Indicators

Look for these if something fails:

```javascript
// Missing API call
❌ API Error: Email already registered
❌ API Error: Invalid credentials
❌ [API ERROR] Registration failed: ...

// Connection issues
❌ TypeError: fetch failed
❌ CORS error
❌ Cannot POST /api/auth/register

// Data issues
❌ [API] Using sample bookings as fallback
⚠️ [AUTH] User not authenticated, redirecting to login
```

---

## How to Debug in Browser

### 1. Open DevTools (F12)

### 2. Go to Console Tab
- See all logs with emoji prefixes
- Search: "❌" for errors
- Search: "✅" for success

### 3. Go to Network Tab
- Click to register/login
- Find POST request to `localhost:5000/api/auth/register`
- Check Status: should be **201** for registration, **200** for login
- Check Response: should have `success: true`
- Check Headers: should show `Content-Type: application/json`

### 4. Check localStorage
- Open Application/Storage tab
- Find `localStorage`
- Look for `authToken` key
- Value should be a long JWT token starting with `eyJh...`

### 5. Check MongoDB
```bash
# If using local MongoDB
mongosh
use rental-services
db.users.find()

# Should show your registered user with hashed password
```

---

## Testing Checklist

- [ ] Can register with valid data (201 response)
- [ ] Cannot register with duplicate email (400 response)
- [ ] Cannot register with short password (400 response)
- [ ] Cannot register with invalid phone (400 response)
- [ ] Auth token saved to localStorage
- [ ] Can login with correct credentials (200 response)
- [ ] Cannot login with incorrect password (401 response)
- [ ] Dashboard shows logged-in user name
- [ ] Dashboard shows user email
- [ ] Bookings fetch from API
- [ ] Items fetch from API
- [ ] Can logout and token is cleared
- [ ] After logout, redirect to login page
- [ ] Data persists in MongoDB

---

## Common Issues & Fixes

### "POST 404 - Cannot POST /api/auth/register"
```
❌ Backend not running
✅ Fix: npm start in backend folder
✅ Verify: http://localhost:5000/api/health works
```

### "CORS error: Access-Control-Allow-Origin"
```
❌ Backend CORS not configured for localhost:5173
✅ Fix: Check backend server.js has correct clientURL
✅ Verify: CLIENT_URL=http://localhost:5173 in .env
```

### "authToken undefined in localStorage"
```
❌ setAuthToken() not called
✅ Fix: Add this after successful login:
  const { token, user } = response.data;
  setAuthToken(token);  // ← Add this line
```

### "Bearer token not sent with requests"
```
❌ Token not being attached to headers
✅ Fix: Check api.ts getAuthToken() function
✅ Verify: Header includes `Authorization: Bearer ${token}`
```

### "Dashboard shows 'Alex' instead of real name"
```
❌ Not using useAuth() hook
✅ Fix: Add this:
  const { user } = useAuth();
  <h1>Welcome, {user?.name}</h1>
```

### "Dashboard shows sample bookings instead of API data"
```
❌ fetchUserBookings() not called
✅ Fix: Add useEffect to fetch on Mount:
  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);
```

---

## API Response Formats

### Register Response (201)
```javascript
{
  success: true,
  message: "User registered successfully",
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "507f1f77bcf86cd799439011",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      role: "user"
    }
  }
}
```

### Login Response (200)
```javascript
{
  success: true,
  message: "Login successful",
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "507f1f77bcf86cd799439011",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      role: "user"
    }
  }
}
```

### Error Response
```javascript
{
  success: false,
  message: "Email already registered",
  data: null
}
```

---

## Files Modified Summary

| File Path | Type | Status |
|-----------|------|--------|
| `src/lib/api.ts` | NEW | ✅ Created |
| `src/contexts/AuthContext.tsx` | NEW | ✅ Created |
| `src/pages/Register.tsx` | MODIFIED | ✅ Fixed (API call added) |
| `src/pages/Login.tsx` | MODIFIED | ✅ Fixed (API call added) |
| `src/pages/Dashboard.tsx` | MODIFIED | ✅ Fixed (fetches real data) |
| `src/App.tsx` | MODIFIED | ✅ Fixed (AuthProvider added) |
| `.env` | NEW | ✅ Created (API URL config) |
| `backend/DEBUGGING_GUIDE.md` | NEW | ✅ Created |

---

Generated: April 16, 2026
