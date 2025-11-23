import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Placeholder async thunk for future API integration
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }) => {
    // TODO: Replace with actual API call
    // For now, simple validation
    if (username === 'admin' && password === 'admin') {
      return { username: 'admin', name: 'Admin User' };
    }
    throw new Error('Invalid credentials');
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    // TODO: Replace with actual API call
    return true;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checkAuth: (state) => {
      // Check if user is authenticated (e.g., from localStorage)
      const storedAuth = localStorage.getItem('heydoctor_auth');
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          state.isAuthenticated = true;
          state.user = authData.user;
        } catch (e) {
          state.isAuthenticated = false;
          state.user = null;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        // Store in localStorage
        localStorage.setItem('heydoctor_auth', JSON.stringify({
          user: action.payload,
          timestamp: Date.now(),
        }));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('heydoctor_auth');
      });
  },
});

export const { checkAuth } = authSlice.actions;
export default authSlice.reducer;

