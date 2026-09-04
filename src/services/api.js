import axios from 'axios';

// In development, Vite proxy handles /api -> localhost:5000
// In production, use the deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auto-attach JWT Token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('myn_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('myn_token');
    localStorage.removeItem('myn_user');
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default api;
