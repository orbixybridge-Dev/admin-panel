import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import doctorActivationReducer from './slices/doctorActivationSlice';
import patientsReducer from './slices/patientsSlice';
import doctorsReducer from './slices/doctorsSlice';
import paymentsReducer from './slices/paymentsSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctorActivation: doctorActivationReducer,
    patients: patientsReducer,
    doctors: doctorsReducer,
    payments: paymentsReducer,
    notifications: notificationsReducer,
  },
});

