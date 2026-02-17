import api from './api';

/**
 * Admin login
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise} Login response with token
 */
export const adminLogin = async (email, password) => {
  const response = await api.post('/auth/admin-login', {
    email,
    password,
  });
  return response;
};

/**
 * Validate token
 * @returns {Promise} Validation response with { valid: true/false }
 */
export const validateToken = async () => {
  const response = await api.post('/auth/validate');
  return response;
};

/**
 * Logout
 * @returns {Promise} Logout response
 */
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response;
};
