/**
 * API Placeholder Functions
 * 
 * This file contains placeholder functions for future API integration.
 * Replace these with actual API calls when backend is ready.
 */

// Doctor Activation API
export const doctorActivationAPI = {
  fetchAll: async () => {
    // TODO: Replace with actual API call
    // return await fetch('/api/doctor-activation').then(res => res.json());
  },
  approve: async (doctorId) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/doctor-activation/${doctorId}/approve`, { method: 'POST' });
  },
  reject: async (doctorId) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/doctor-activation/${doctorId}/reject`, { method: 'POST' });
  },
};

// Patients API
export const patientsAPI = {
  fetchAll: async () => {
    // TODO: Replace with actual API call
    // return await fetch('/api/patients').then(res => res.json());
  },
  getById: async (patientId) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/patients/${patientId}`).then(res => res.json());
  },
  update: async (patientId, data) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/patients/${patientId}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(data),
    //   headers: { 'Content-Type': 'application/json' },
    // });
  },
};

// Doctors API
export const doctorsAPI = {
  fetchAll: async () => {
    // TODO: Replace with actual API call
    // return await fetch('/api/doctors').then(res => res.json());
  },
  getById: async (doctorId) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/doctors/${doctorId}`).then(res => res.json());
  },
  updateStatus: async (doctorId, status) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/doctors/${doctorId}/status`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status }),
    //   headers: { 'Content-Type': 'application/json' },
    // });
  },
};

// Payments API
export const paymentsAPI = {
  fetchAll: async () => {
    // TODO: Replace with actual API call
    // return await fetch('/api/payments').then(res => res.json());
  },
  approve: async (paymentId) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/payments/${paymentId}/approve`, { method: 'POST' });
  },
  pay: async (paymentId) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/payments/${paymentId}/pay`, { method: 'POST' });
  },
};

// Notifications API
export const notificationsAPI = {
  fetchAll: async () => {
    // TODO: Replace with actual API call
    // return await fetch('/api/notifications').then(res => res.json());
  },
  markAsRead: async (notificationId) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
  },
  markAllAsRead: async () => {
    // TODO: Replace with actual API call
    // return await fetch('/api/notifications/read-all', { method: 'POST' });
  },
};

