import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Dummy data
const dummyNotifications = [
  {
    id: '1',
    notificationId: 'NOTIF-2024-001',
    type: 'Payment Request',
    message: 'Dr. Sarah Johnson requested payment of $5000',
    status: 'Unread',
    time: '2 hours ago',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    notificationId: 'NOTIF-2024-002',
    type: 'Doctor Activation',
    message: 'New doctor registration: Dr. Emily Rodriguez',
    status: 'Unread',
    time: '5 hours ago',
    createdAt: '2024-01-20T07:00:00Z',
  },
  {
    id: '3',
    notificationId: 'NOTIF-2024-003',
    type: 'Payment Request',
    message: 'Dr. Michael Chen requested payment of $3800',
    status: 'Read',
    time: '1 day ago',
    createdAt: '2024-01-19T11:30:00Z',
  },
  {
    id: '4',
    notificationId: 'NOTIF-2024-004',
    type: 'Patient Registration',
    message: 'New patient registered: Maria Garcia',
    status: 'Unread',
    time: '2 days ago',
    createdAt: '2024-01-18T09:15:00Z',
  },
  {
    id: '5',
    notificationId: 'NOTIF-2024-005',
    type: 'System',
    message: 'System maintenance scheduled for tonight',
    status: 'Read',
    time: '3 days ago',
    createdAt: '2024-01-17T14:20:00Z',
  },
];

const initialState = {
  notifications: dummyNotifications,
  loading: false,
  error: null,
};

// Placeholder async thunks for future API integration
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async () => {
    // TODO: Replace with actual API call
    return dummyNotifications;
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId) => {
    // TODO: Replace with actual API call
    return notificationId;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsReadLocal: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.status = 'Read';
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.status = 'Read';
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification) {
          notification.status = 'Read';
        }
      });
  },
});

export const { markAsReadLocal, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;

