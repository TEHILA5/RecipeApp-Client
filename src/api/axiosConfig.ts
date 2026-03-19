/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://localhost:7244/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const url = err.config?.url || '';
    const isAuthRoute = url.includes('/login') || url.includes('/register') || url.includes('/reset-password');

    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;

export const handleApiError = (error: any): string => {
  if (error.response) {
    const { data } = error.response;
    if (data.errors) return Object.values(data.errors).flat().join(', ') as string;
    if (data.message) return data.message as string;
    return 'Server error. Please try again later.';
  }
  if (error.request) return 'Failed to connect to the server. Please check your internet connection.';
  return error.message || 'Unknown error occurred.';
};