import api from './api';

/**
 * Get all active departments (Public)
 */
export const getActiveDepartments = async () => {
  const response = await api.get('/doctor/departments');
  return response;
};

/**
 * Get all departments including inactive (ADMIN only)
 */
export const getAllDepartments = async () => {
  const response = await api.get('/doctor/departments/all');
  return response;
};

/**
 * Get department by ID (Public)
 */
export const getDepartmentById = async (departmentId) => {
  const response = await api.get(`/doctor/departments/${departmentId}`);
  return response;
};

/**
 * Create new department (ADMIN only)
 */
export const createDepartment = async (departmentData) => {
  const response = await api.post('/doctor/departments', departmentData);
  return response;
};

/**
 * Update department (ADMIN only)
 */
export const updateDepartment = async (departmentId, departmentData) => {
  const response = await api.put(`/doctor/departments/${departmentId}`, departmentData);
  return response;
};

/**
 * Toggle department active/inactive status (ADMIN only)
 */
export const toggleDepartmentStatus = async (departmentId) => {
  const response = await api.patch(`/doctor/departments/${departmentId}/toggle-status`);
  return response;
};

/**
 * Delete department (ADMIN only)
 */
export const deleteDepartment = async (departmentId) => {
  const response = await api.delete(`/doctor/departments/${departmentId}`);
  return response;
};
