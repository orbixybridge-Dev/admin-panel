import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Dummy data
const dummyPatients = [
  {
    id: '1',
    serialNo: 1,
    name: 'John Doe',
    mobile: '+1 234-567-8901',
    email: 'john.doe@example.com',
    gender: 'Male',
    dob: '1990-05-15',
    documents: ['id-proof.pdf', 'medical-history.pdf'],
    totalAttendedCalls: 12,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: '2',
    serialNo: 2,
    name: 'Jane Smith',
    mobile: '+1 234-567-8902',
    email: 'jane.smith@example.com',
    gender: 'Female',
    dob: '1985-08-22',
    documents: ['id-proof.pdf'],
    totalAttendedCalls: 8,
    createdAt: '2024-01-12T10:30:00Z',
  },
  {
    id: '3',
    serialNo: 3,
    name: 'Robert Brown',
    mobile: '+1 234-567-8903',
    email: 'robert.brown@example.com',
    gender: 'Male',
    dob: '1992-11-30',
    documents: ['id-proof.pdf', 'medical-history.pdf', 'insurance.pdf'],
    totalAttendedCalls: 15,
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '4',
    serialNo: 4,
    name: 'Maria Garcia',
    mobile: '+1 234-567-8904',
    email: 'maria.garcia@example.com',
    gender: 'Female',
    dob: '1988-03-18',
    documents: ['id-proof.pdf'],
    totalAttendedCalls: 5,
    createdAt: '2024-01-16T09:15:00Z',
  },
  {
    id: '5',
    serialNo: 5,
    name: 'David Lee',
    mobile: '+1 234-567-8905',
    email: 'david.lee@example.com',
    gender: 'Male',
    dob: '1995-07-25',
    documents: ['id-proof.pdf', 'medical-history.pdf'],
    totalAttendedCalls: 20,
    createdAt: '2024-01-18T11:45:00Z',
  },
];

const initialState = {
  patients: dummyPatients,
  loading: false,
  error: null,
};

// Placeholder async thunks for future API integration
export const fetchPatients = createAsyncThunk(
  'patients/fetchAll',
  async () => {
    // TODO: Replace with actual API call
    return dummyPatients;
  }
);

export const updatePatient = createAsyncThunk(
  'patients/update',
  async (patient) => {
    // TODO: Replace with actual API call
    return patient;
  }
);

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    updatePatientLocal: (state, action) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const index = state.patients.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
      });
  },
});

export const { updatePatientLocal } = patientsSlice.actions;
export default patientsSlice.reducer;

