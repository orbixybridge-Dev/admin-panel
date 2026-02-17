import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as qualificationsApi from '@/services/qualificationsApi';

const initialState = {
  qualifications: [],
  loading: false,
  error: null,
  filters: {
    search: '',
  },
};

// Get all qualifications (including inactive)
export const fetchAllQualifications = createAsyncThunk(
  'qualifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await qualificationsApi.getAllQualifications();
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch qualifications');
    }
  }
);

// Create qualification
export const createQualification = createAsyncThunk(
  'qualifications/create',
  async (qualificationData, { rejectWithValue }) => {
    try {
      const response = await qualificationsApi.createQualification(qualificationData);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create qualification');
    }
  }
);

// Update qualification
export const updateQualification = createAsyncThunk(
  'qualifications/update',
  async ({ qualificationId, qualificationData }, { rejectWithValue }) => {
    try {
      const response = await qualificationsApi.updateQualification(qualificationId, qualificationData);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update qualification');
    }
  }
);

// Delete qualification
export const deleteQualification = createAsyncThunk(
  'qualifications/delete',
  async (qualificationId, { rejectWithValue }) => {
    try {
      await qualificationsApi.deleteQualification(qualificationId);
      return qualificationId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete qualification');
    }
  }
);

const qualificationsSlice = createSlice({
  name: 'qualifications',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllQualifications.pending, (state) => {
        // Only set loading if not already loading (prevents duplicate calls)
        if (!state.loading) {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(fetchAllQualifications.fulfilled, (state, action) => {
        state.loading = false;
        state.qualifications = action.payload;
      })
      .addCase(fetchAllQualifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createQualification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQualification.fulfilled, (state, action) => {
        state.loading = false;
        state.qualifications.push(action.payload);
      })
      .addCase(createQualification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateQualification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQualification.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.qualifications.findIndex(
          (q) => q.qualificationId === action.payload.qualificationId
        );
        if (index !== -1) {
          state.qualifications[index] = action.payload;
        }
      })
      .addCase(updateQualification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteQualification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQualification.fulfilled, (state, action) => {
        state.loading = false;
        state.qualifications = state.qualifications.filter(
          (q) => q.qualificationId !== action.payload
        );
      })
      .addCase(deleteQualification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearError } = qualificationsSlice.actions;
export default qualificationsSlice.reducer;
