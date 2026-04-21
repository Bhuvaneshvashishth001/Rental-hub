# Frontend Integration Guide

Complete guide to integrate your React frontend with the Rental Services backend.

## 📋 Table of Contents

1. [Setup API Client](#setup-api-client)
2. [Authentication Flow](#authentication-flow)
3. [Making API Calls](#making-api-calls)
4. [State Management Setup](#state-management-setup)
5. [Common Use Cases](#common-use-cases)
6. [Error Handling](#error-handling)
7. [Troubleshooting](#troubleshooting)

---

## Setup API Client

### File: `src/services/apiClient.js`

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add JWT token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Log error
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
```

### File: `.env` (Frontend)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Authentication Flow

### File: `src/services/authService.js`

```javascript
import apiClient from './apiClient';

const authService = {
  /**
   * Register new user
   */
  register: async (name, email, password, phone) => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      phone,
    });

    if (response.data.success) {
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return response.data;
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    if (response.data.success) {
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (name, phone, profileImage) => {
    const response = await apiClient.put('/auth/me', {
      name,
      phone,
      profileImage,
    });

    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }

    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Get stored auth token
   */
  getToken: () => localStorage.getItem('authToken'),

  /**
   * Get stored user data
   */
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => !!localStorage.getItem('authToken'),
};

export default authService;
```

---

## Making API Calls

### File: `src/services/rentalService.js`

```javascript
import apiClient from './apiClient';

const rentalService = {
  /**
   * Get all rentals with filters
   */
  getAllRentals: async (category, location, page = 1, limit = 12, search) => {
    const response = await apiClient.get('/rentals', {
      params: {
        category,
        location,
        page,
        limit,
        search,
      },
    });
    return response.data.data;
  },

  /**
   * Get single rental
   */
  getRentalById: async (id) => {
    const response = await apiClient.get(`/rentals/${id}`);
    return response.data.data;
  },

  /**
   * Get rentals by category
   */
  getRentalsByCategory: async (category, page = 1, limit = 12) => {
    const response = await apiClient.get(`/rentals/category/${category}`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  /**
   * Create rental listing
   */
  createRental: async (rentalData) => {
    const response = await apiClient.post('/rentals', rentalData);
    return response.data;
  },

  /**
   * Update rental
   */
  updateRental: async (id, rentalData) => {
    const response = await apiClient.put(`/rentals/${id}`, rentalData);
    return response.data;
  },

  /**
   * Delete rental
   */
  deleteRental: async (id) => {
    const response = await apiClient.delete(`/rentals/${id}`);
    return response.data;
  },

  /**
   * Get my rentals (owner's listings)
   */
  getMyRentals: async (page = 1, limit = 12) => {
    const response = await apiClient.get('/rentals/my-rentals/list', {
      params: { page, limit },
    });
    return response.data.data;
  },
};

export default rentalService;
```

### File: `src/services/bookingService.js`

```javascript
import apiClient from './apiClient';

const bookingService = {
  /**
   * Create booking
   */
  createBooking: async (rentalId, startDate, endDate) => {
    const response = await apiClient.post('/bookings', {
      rentalId,
      startDate,
      endDate,
    });
    return response.data;
  },

  /**
   * Get user's bookings
   */
  getUserBookings: async () => {
    const response = await apiClient.get('/bookings/my-bookings/list');
    return response.data.data;
  },

  /**
   * Get booking details
   */
  getBookingById: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data.data;
  },

  /**
   * Confirm booking (after payment)
   */
  confirmBooking: async (id) => {
    const response = await apiClient.put(`/bookings/${id}/confirm`);
    return response.data;
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (id, reason = '') => {
    const response = await apiClient.put(`/bookings/${id}/cancel`, {
      reason,
    });
    return response.data;
  },

  /**
   * Add review to booking
   */
  addReview: async (id, rating, review) => {
    const response = await apiClient.post(`/bookings/{id}/review`, {
      rating,
      review,
    });
    return response.data;
  },

  /**
   * Get bookings for my rentals
   */
  getBookingsForMyRentals: async (status, page = 1) => {
    const response = await apiClient.get('/bookings/my-rentals/bookings', {
      params: { status, page },
    });
    return response.data.data;
  },
};

export default bookingService;
```

### File: `src/services/recommendationService.js`

```javascript
import apiClient from './apiClient';

const recommendationService = {
  /**
   * Get smart recommendations
   * (Personalized if logged in, trending if not)
   */
  getRecommendations: async (limit = 8) => {
    const response = await apiClient.get('/recommendations', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get by category
   */
  getByCategory: async (category, location, limit = 6) => {
    const response = await apiClient.get('/recommendations/category', {
      params: { category, location, limit },
    });
    return response.data.data;
  },

  /**
   * Get similar rentals
   */
  getSimilarRentals: async (id, limit = 5) => {
    const response = await apiClient.get(
      `/recommendations/similar/${id}`,
      {
        params: { limit },
      }
    );
    return response.data.data;
  },

  /**
   * Get trending
   */
  getTrending: async (limit = 8) => {
    const response = await apiClient.get('/recommendations/trending/top', {
      params: { limit },
    });
    return response.data.data;
  },
};

export default recommendationService;
```

---

## State Management Setup

### Option 1: Using React Context

```javascript
// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = authService.getToken();
    if (token) {
      const userData = authService.getUser();
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const register = async (name, email, password, phone) => {
    const result = await authService.register(name, email, password, phone);
    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### Usage in Components

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      // Redirect to dashboard
    }
  };

  return (
    // JSX here
  );
}
```

---

## Common Use Cases

### Fetch Rentals on Component Mount

```javascript
import { useEffect, useState } from 'react';
import rentalService from '../services/rentalService';

function RentalList() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const data = await rentalService.getAllRentals('car', 'New York');
        setRentals(data.rentals);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {rentals.map((rental) => (
        <div key={rental._id}>
          <h3>{rental.title}</h3>
          <p>${rental.pricePerDay}/day</p>
        </div>
      ))}
    </div>
  );
}
```

### Create Booking

```javascript
import { useState } from 'react';
import bookingService from '../services/bookingService';

function BookingForm({ rentalId }) {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await bookingService.createBooking(
        rentalId,
        startDate,
        endDate
      );
      if (result.success) {
        alert('Booking created successfully!');
        // Redirect or refresh
      }
    } catch (error) {
      alert('Booking failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  );
}
```

---

## Error Handling

### Create Error Boundary

```javascript
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error: {this.state.error?.message}</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Handle API Errors

```javascript
async function fetchData() {
  try {
    const data = await rentalService.getAllRentals();
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
    } else if (error.response?.status === 404) {
      // Not found
    } else {
      // Generic error
      console.error('API Error:', error.response?.data?.message);
    }
  }
}
```

---

## Troubleshooting

### Issue: CORS Error

**Solution:**
```env
VITE_API_URL=http://localhost:5000/api
```

And ensure backend has correct CORS settings in `.env`:
```env
CLIENT_URL=http://localhost:5173
```

### Issue: Token not being sent

**Solution:** Check that token is stored with correct key:
```javascript
// Correct key
localStorage.setItem('authToken', token);

// Check interceptor is working
console.log(apiClient.defaults);
```

### Issue: 401 Unauthorized repeatedly

**Solution:**
1. Clear localStorage
2. Re-login
3. Check JWT token expiration in backend

### Issue: API calls work in Postman but not in React

**Solution:**
1. Check CORS is enabled
2. Verify Authorization header format: `Bearer <token>`
3. Check Content-Type header
4. Enable credentials in axios if needed

---

## Testing the Integration

```bash
# Start backend
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

Test endpoints:
1. Register at `http://localhost:5173/register`
2. Login at `http://localhost:5173/login`
3. View rentals at `http://localhost:5173/rentals`
4. Create booking at `http://localhost:5173/rentals/:id`

---

## Production Deployment

### Update .env for Production

```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Backend Production

Update backend `.env`:
```env
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
```

---

**You're all set! Happy coding! 🚀**
