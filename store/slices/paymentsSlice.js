import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Dummy data
const dummyPayments = [
  {
    id: '1',
    requestId: 'PAY-2024-001',
    doctorName: 'Dr. Sarah Johnson',
    doctorId: '1',
    amount: 5000,
    requestDate: '2024-01-20',
    status: 'Pending',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    requestId: 'PAY-2024-002',
    doctorName: 'Dr. Michael Chen',
    doctorId: '2',
    amount: 3800,
    requestDate: '2024-01-21',
    status: 'Pending',
    createdAt: '2024-01-21T11:30:00Z',
  },
  {
    id: '3',
    requestId: 'PAY-2024-003',
    doctorName: 'Dr. Emily Rodriguez',
    doctorId: '3',
    amount: 6500,
    requestDate: '2024-01-19',
    status: 'Approved',
    createdAt: '2024-01-19T09:15:00Z',
  },
  {
    id: '4',
    requestId: 'PAY-2024-004',
    doctorName: 'Dr. James Wilson',
    doctorId: '4',
    amount: 4200,
    requestDate: '2024-01-18',
    status: 'Paid',
    createdAt: '2024-01-18T14:20:00Z',
  },
];

const initialState = {
  payments: dummyPayments,
  loading: false,
  error: null,
};

// Placeholder async thunks for future API integration
export const fetchPayments = createAsyncThunk(
  'payments/fetchAll',
  async () => {
    // TODO: Replace with actual API call
    return dummyPayments;
  }
);

export const approvePayment = createAsyncThunk(
  'payments/approve',
  async (paymentId) => {
    // TODO: Replace with actual API call
    return paymentId;
  }
);

export const payPayment = createAsyncThunk(
  'payments/pay',
  async (paymentId) => {
    // TODO: Replace with actual API call
    return paymentId;
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    approvePaymentLocal: (state, action) => {
      const payment = state.payments.find(p => p.id === action.payload);
      if (payment) {
        payment.status = 'Approved';
      }
    },
    payPaymentLocal: (state, action) => {
      const payment = state.payments.find(p => p.id === action.payload);
      if (payment) {
        payment.status = 'Paid';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch payments';
      })
      .addCase(approvePayment.fulfilled, (state, action) => {
        const payment = state.payments.find(p => p.id === action.payload);
        if (payment) {
          payment.status = 'Approved';
        }
      })
      .addCase(payPayment.fulfilled, (state, action) => {
        const payment = state.payments.find(p => p.id === action.payload);
        if (payment) {
          payment.status = 'Paid';
        }
      });
  },
});

export const { approvePaymentLocal, payPaymentLocal } = paymentsSlice.actions;
export default paymentsSlice.reducer;

