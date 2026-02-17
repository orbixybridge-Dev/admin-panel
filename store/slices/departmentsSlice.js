import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as departmentsApi from '@/services/departmentsApi';

const initialState = {
  departments: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all', // 'all', 'active', 'inactive'
  },
};

// Get all departments (including inactive)
export const fetchAllDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.getAllDepartments();
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch departments');
    }
  }
);

// Create department
export const createDepartment = createAsyncThunk(
  'departments/create',
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.createDepartment(departmentData);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create department');
    }
  }
);

// Update department
export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ departmentId, departmentData }, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.updateDepartment(departmentId, departmentData);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update department');
    }
  }
);

// Toggle department status
export const toggleDepartmentStatus = createAsyncThunk(
  'departments/toggleStatus',
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await departmentsApi.toggleDepartmentStatus(departmentId);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle department status');
    }
  }
);

// Delete department
export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (departmentId, { rejectWithValue }) => {
    try {
      await departmentsApi.deleteDepartment(departmentId);
      return departmentId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete department');
    }
  }
);

const departmentsSlice = createSlice({
  name: 'departments',
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
      .addCase(fetchAllDepartments.pending, (state) => {
        // Only set loading if not already loading (prevents duplicate calls)
        if (!state.loading) {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(fetchAllDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchAllDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments.push(action.payload);
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.departments.findIndex(
          (d) => d.departmentId === action.payload.departmentId
        );
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle status
      .addCase(toggleDepartmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleDepartmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.departments.findIndex(
          (d) => d.departmentId === action.payload.departmentId
        );
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
      })
      .addCase(toggleDepartmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = state.departments.filter(
          (d) => d.departmentId !== action.payload
        );
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearError } = departmentsSlice.actions;
export default departmentsSlice.reducer;
