import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  register: (role, data) => api.post(`/auth/register/${role}`, data),
  resetPassword: (email, newPassword) => api.post('/auth/reset-password', { email, newPassword })
};
