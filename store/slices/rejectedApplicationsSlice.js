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
  lastFetchTime: null,
  filters: {
    search: '',
  },
};

// Get rejected doctor applications
export const fetchRejectedApplications = createAsyncThunk(
  'rejectedApplications/fetch',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await doctorsApi.getRejectedApplications(page, size);
      const data = response.data?.data || response.data || {};
      return {
        doctors: data.content || data.doctors || [],
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        currentPage: page,
        pageSize: size,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch rejected applications');
    }
  }
);

// Accept rejected doctor application
export const acceptRejectedDoctor = createAsyncThunk(
  'rejectedApplications/accept',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await doctorsApi.approveDoctor(doctorId);
      const data = response.data?.data || response.data || {};
      // Ensure we return doctorId for filtering
      return { ...data, doctorId: data.doctorId || doctorId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to accept doctor');
    }
  }
);

const rejectedApplicationsSlice = createSlice({
  name: 'rejectedApplications',
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
      // Fetch rejected applications
      .addCase(fetchRejectedApplications.pending, (state) => {
        if (!state.loading) {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(fetchRejectedApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.lastFetchTime = Date.now();
        if (action.payload.pageSize >= 10) {
          state.doctors = action.payload.doctors;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
          state.pageSize = action.payload.pageSize;
        }
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchRejectedApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Accept rejected doctor
      .addCase(acceptRejectedDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptRejectedDoctor.fulfilled, (state, action) => {
        state.loading = false;
        // Remove accepted doctor from list
        state.doctors = state.doctors.filter(
          (d) => d.doctorId !== action.payload.doctorId
        );
        state.totalElements = Math.max(0, state.totalElements - 1);
      })
      .addCase(acceptRejectedDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setPage, setPageSize, clearError } = rejectedApplicationsSlice.actions;
export default rejectedApplicationsSlice.reducer;
