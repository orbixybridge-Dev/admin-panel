import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Dummy data
const dummyCalls = [
  { id: '1', patientName: 'John Doe', date: '2024-01-20', duration: '30 min', amount: 150 },
  { id: '2', patientName: 'Jane Smith', date: '2024-01-21', duration: '45 min', amount: 225 },
  { id: '3', patientName: 'Robert Brown', date: '2024-01-22', duration: '20 min', amount: 100 },
];

const dummyDoctors = [
  {
    id: '1',
    serialNo: 1,
    name: 'Dr. Sarah Johnson',
    mobile: '+1 234-567-8901',
    email: 'sarah.johnson@example.com',
    status: 'Online',
    totalAttendedCalls: 45,
    billGenerated: 12,
    documents: ['license.pdf', 'certificate.pdf'],
    attendedCalls: dummyCalls,
    createdAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '2',
    serialNo: 2,
    name: 'Dr. Michael Chen',
    mobile: '+1 234-567-8902',
    email: 'michael.chen@example.com',
    status: 'Busy',
    totalAttendedCalls: 38,
    billGenerated: 10,
    documents: ['license.pdf', 'certificate.pdf'],
    attendedCalls: dummyCalls,
    createdAt: '2024-01-02T09:00:00Z',
  },
  {
    id: '3',
    serialNo: 3,
    name: 'Dr. Emily Rodriguez',
    mobile: '+1 234-567-8903',
    email: 'emily.rodriguez@example.com',
    status: 'Offline',
    totalAttendedCalls: 52,
    billGenerated: 15,
    documents: ['license.pdf', 'certificate.pdf', 'id-proof.pdf'],
    attendedCalls: dummyCalls,
    createdAt: '2024-01-03T10:00:00Z',
  },
  {
    id: '4',
    serialNo: 4,
    name: 'Dr. James Wilson',
    mobile: '+1 234-567-8904',
    email: 'james.wilson@example.com',
    status: 'Online',
    totalAttendedCalls: 30,
    billGenerated: 8,
    documents: ['license.pdf', 'certificate.pdf'],
    attendedCalls: dummyCalls,
    createdAt: '2024-01-04T11:00:00Z',
  },
];

const initialState = {
  doctors: dummyDoctors,
  loading: false,
  error: null,
};

// Placeholder async thunks for future API integration
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchAll',
  async () => {
    // TODO: Replace with actual API call
    return dummyDoctors;
  }
);

export const updateDoctorStatus = createAsyncThunk(
  'doctors/updateStatus',
  async ({ doctorId, status }) => {
    // TODO: Replace with actual API call
    return { doctorId, status };
  }
);

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    updateStatusLocal: (state, action) => {
      const doctor = state.doctors.find(d => d.id === action.payload.doctorId);
      if (doctor) {
        doctor.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctors';
      })
      .addCase(updateDoctorStatus.fulfilled, (state, action) => {
        const doctor = state.doctors.find(d => d.id === action.payload.doctorId);
        if (doctor) {
          doctor.status = action.payload.status;
        }
      });
  },
});

export const { updateStatusLocal } = doctorsSlice.actions;
export default doctorsSlice.reducer;

