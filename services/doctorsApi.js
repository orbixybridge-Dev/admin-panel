import api from './api';

/**
 * Get all pending verification doctors (ADMIN only)
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 10)
 */
export const getPendingVerificationDoctors = async (page = 0, size = 10) => {
  const response = await api.get('/doctor/pending-verification', {
    params: { page, size },
  });
  return response;
};

/**
 * Get all verified doctors (ADMIN only)
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 10)
 */
export const getAllVerifiedDoctors = async (page = 0, size = 10) => {
  const response = await api.get('/doctor/admin/all-verified', {
    params: { page, size },
  });
  return response;
};

/**
 * Approve/verify a doctor (ADMIN only)
 */
export const approveDoctor = async (doctorId) => {
  const response = await api.put(`/doctor/${doctorId}/approve`);
  return response;
};

/**
 * Reject doctor application (ADMIN only) - for unverified doctors
 */
export const rejectDoctorApplication = async (doctorId) => {
  const response = await api.put(`/doctor/${doctorId}/reject`);
  return response;
};

/**
 * Block verified doctor (ADMIN only) - for verified doctors
 */
export const blockDoctor = async (doctorId) => {
  const response = await api.put(`/doctor/${doctorId}/block`);
  return response;
};
