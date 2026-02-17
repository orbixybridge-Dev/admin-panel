import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as doctorsApi from '@/services/doctorsApi';

const initialState = {
  doctors: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all', // 'all', 'ONLINE', 'OFFLINE', 'BUSY'
  },
};

// Get all verified doctors
export const fetchVerifiedDoctors = createAsyncThunk(
  'verifiedDoctors/fetchAll',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await doctorsApi.getAllVerifiedDoctors(page, size);
      const data = response.data?.data || response.data || {};
      return {
        doctors: data.content || data.doctors || [],
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        currentPage: page,
        pageSize: size,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch verified doctors');
    }
  }
);

const verifiedDoctorsSlice = createSlice({
  name: 'verifiedDoctors',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch verified doctors
      .addCase(fetchVerifiedDoctors.pending, (state) => {
        // Only set loading if not already loading (prevents duplicate calls)
        if (!state.loading) {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(fetchVerifiedDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchVerifiedDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setPage, setPageSize, clearError } = verifiedDoctorsSlice.actions;
export default verifiedDoctorsSlice.reducer;
