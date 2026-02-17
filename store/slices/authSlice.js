import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminLogin, logout as logoutApi, validateToken } from '@/services/authApi';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Admin login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await adminLogin(email, password);
      const { data } = response;
      
      // Extract token and user data from response
      // Adjust based on actual API response structure
      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user || { email, name: email };
      
      if (!token) {
        throw new Error('Token not received from server');
      }
      
      // Store token and user in localStorage
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Validate token
export const validateAuth = createAsyncThunk(
  'auth/validate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await validateToken();
      const { data } = response;
      
      // API returns { valid: true } or { valid: false }
      // Also handle wrapped response: { success: true, data: { valid: true } }
      const isValid = data?.valid === true || data?.data?.valid === true;
      
      if (isValid) {
        // Token is valid, get user from localStorage
        const userStr = localStorage.getItem('adminUser');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            return { user };
          } catch (e) {
            // If user data is corrupted, still consider token valid
            // User will need to login again to get fresh user data
            return { user: null };
          }
        }
        // Token is valid but no user data - still valid
        return { user: null };
      }
      
      // Token is invalid (valid: false or not present)
      throw new Error('Invalid or expired token');
    } catch (error) {
      // Clear invalid token
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return rejectWithValue(error.message || 'Token validation failed');
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (error) {
      // Even if API call fails, clear local storage
      return true;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checkAuth: (state) => {
      // Check if user is authenticated from localStorage
      const token = localStorage.getItem('adminToken');
      const userStr = localStorage.getItem('adminUser');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.isAuthenticated = true;
          state.user = user;
          state.token = token;
        } catch (e) {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || 'Login failed';
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      })
      // Validate
      .addCase(validateAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = localStorage.getItem('adminToken');
      })
      .addCase(validateAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      });
  },
});

export const { checkAuth, clearError } = authSlice.actions;
export default authSlice.reducer;

