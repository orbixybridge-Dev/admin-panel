import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Dummy data
const dummyDoctors = [
  {
    id: '1',
    serialNo: 1,
    name: 'Dr. Sarah Johnson',
    mobile: '+1 234-567-8901',
    registrationNumber: 'REG-2024-001',
    email: 'sarah.johnson@example.com',
    gender: 'Female',
    documents: ['license.pdf', 'certificate.pdf', 'id-proof.pdf'],
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    serialNo: 2,
    name: 'Dr. Michael Chen',
    mobile: '+1 234-567-8902',
    registrationNumber: 'REG-2024-002',
    email: 'michael.chen@example.com',
    gender: 'Male',
    documents: ['license.pdf', 'certificate.pdf'],
    status: 'pending',
    createdAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    serialNo: 3,
    name: 'Dr. Emily Rodriguez',
    mobile: '+1 234-567-8903',
    registrationNumber: 'REG-2024-003',
    email: 'emily.rodriguez@example.com',
    gender: 'Female',
    documents: ['license.pdf', 'certificate.pdf', 'id-proof.pdf', 'resume.pdf'],
    status: 'pending',
    createdAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    serialNo: 4,
    name: 'Dr. James Wilson',
    mobile: '+1 234-567-8904',
    registrationNumber: 'REG-2024-004',
    email: 'james.wilson@example.com',
    gender: 'Male',
    documents: ['license.pdf', 'certificate.pdf'],
    status: 'pending',
    createdAt: '2024-01-18T11:45:00Z',
  },
];

const initialState = {
  doctors: dummyDoctors,
  loading: false,
  error: null,
};

// Placeholder async thunks for future API integration
export const fetchDoctorActivations = createAsyncThunk(
  'doctorActivation/fetchAll',
  async () => {
    // TODO: Replace with actual API call
    return dummyDoctors;
  }
);

export const approveDoctor = createAsyncThunk(
  'doctorActivation/approve',
  async (doctorId) => {
    // TODO: Replace with actual API call
    return doctorId;
  }
);

export const rejectDoctor = createAsyncThunk(
  'doctorActivation/reject',
  async (doctorId) => {
    // TODO: Replace with actual API call
    return doctorId;
  }
);

const doctorActivationSlice = createSlice({
  name: 'doctorActivation',
  initialState,
  reducers: {
    approveDoctorLocal: (state, action) => {
      const doctor = state.doctors.find(d => d.id === action.payload);
      if (doctor) {
        doctor.status = 'approved';
      }
    },
    rejectDoctorLocal: (state, action) => {
      const doctor = state.doctors.find(d => d.id === action.payload);
      if (doctor) {
        doctor.status = 'rejected';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorActivations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorActivations.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctorActivations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctors';
      })
      .addCase(approveDoctor.fulfilled, (state, action) => {
        const doctor = state.doctors.find(d => d.id === action.payload);
        if (doctor) {
          doctor.status = 'approved';
        }
      })
      .addCase(rejectDoctor.fulfilled, (state, action) => {
        const doctor = state.doctors.find(d => d.id === action.payload);
        if (doctor) {
          doctor.status = 'rejected';
        }
      });
  },
});

export const { approveDoctorLocal, rejectDoctorLocal } = doctorActivationSlice.actions;
export default doctorActivationSlice.reducer;

