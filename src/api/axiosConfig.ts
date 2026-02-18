/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// ⭐ כתובת ה-API מקובץ .env
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://localhost:7244/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 שניות timeout
});

// ===============================================
// Request Interceptor - הוספת Token
// ===============================================
axiosInstance.interceptors.request.use(
  (config) => {
    // קבלת Token מ-localStorage
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ===============================================
// Response Interceptor - טיפול בשגיאות
// ===============================================
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // אם Token לא תקף - התנתק
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

// ===============================================
// Helper Function לטיפול בשגיאות
// ===============================================
export const handleApiError = (error: any): string => {
  if (error.response) {
    const { data } = error.response;
    
    // אם יש הודעות Validation
    if (data.errors) {
      const errorMessages = Object.values(data.errors)
        .flat()
        .join(', ');
      return errorMessages as string;
    }
    
    // אם יש הודעת שגיאה כללית
    if (data.message) {
      return data.message as string;
    }
    
    return 'Server error. Please try again later.';
  }
  
  if (error.request) {
    return 'Failed to connect to the server. Please check your internet connection.';
  }
  
  return error.message || 'Unknown error occurred.';
};