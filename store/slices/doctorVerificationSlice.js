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
  lastFetchTime: null, // Track when we last fetched to prevent rapid duplicate calls
  filters: {
    search: '',
    department: '',
  },
};

// Get pending verification doctors
export const fetchPendingDoctors = createAsyncThunk(
  'doctorVerification/fetchPending',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await doctorsApi.getPendingVerificationDoctors(page, size);
      const data = response.data?.data || response.data || {};
      return {
        doctors: data.content || data.doctors || [],
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        currentPage: page,
        pageSize: size,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch pending doctors');
    }
  }
);

// Approve doctor
export const approveDoctor = createAsyncThunk(
  'doctorVerification/approve',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await doctorsApi.approveDoctor(doctorId);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to approve doctor');
    }
  }
);

// Reject doctor application
export const rejectDoctor = createAsyncThunk(
  'doctorVerification/reject',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await doctorsApi.rejectDoctorApplication(doctorId);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reject doctor');
    }
  }
);

const doctorVerificationSlice = createSlice({
  name: 'doctorVerification',
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
      // Fetch pending
      .addCase(fetchPendingDoctors.pending, (state) => {
        // Only set loading if not already loading (prevents duplicate calls)
        if (!state.loading) {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(fetchPendingDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.lastFetchTime = Date.now();
        // Only update doctors if we're fetching the full page (size >= 10)
        // If it's just a count fetch (size: 1), only update totalElements
        if (action.payload.pageSize >= 10) {
          state.doctors = action.payload.doctors;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
          state.pageSize = action.payload.pageSize;
        }
        // Always update totalElements (needed for sidebar badge)
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchPendingDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve
      .addCase(approveDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveDoctor.fulfilled, (state, action) => {
        state.loading = false;
        // Remove approved doctor from list
        state.doctors = state.doctors.filter(
          (d) => d.doctorId !== action.payload.doctorId
        );
        state.totalElements = Math.max(0, state.totalElements - 1);
      })
      .addCase(approveDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reject
      .addCase(rejectDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectDoctor.fulfilled, (state, action) => {
        state.loading = false;
        // Remove rejected doctor from list
        state.doctors = state.doctors.filter(
          (d) => d.doctorId !== action.payload.doctorId
        );
        state.totalElements = Math.max(0, state.totalElements - 1);
      })
      .addCase(rejectDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setPage, setPageSize, clearError } = doctorVerificationSlice.actions;
export default doctorVerificationSlice.reducer;
