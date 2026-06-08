import axios, { type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // ✅ CRITICAL: Send cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor - add CSRF token to requests
api.interceptors.request.use(
  (config) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      config.headers['X-CSRF-Token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle CSRF token errors
api.interceptors.response.use(
  (response) => {
    // Update CSRF token if provided in response headers
    const newToken = response.headers['x-csrf-token'];
    if (newToken) {
      let metaTag = document.querySelector('meta[name="csrf-token"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'csrf-token');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', newToken);
    }
    return response;
  },
  (error) => {
    // Handle 419 Unprocessable Entity (CSRF token expired)
    if (error.response?.status === 419) {
      console.warn('⚠️ CSRF token expired or invalid');
      window.location.href = '/login';
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized - please login again');
    }
    
    return Promise.reject(error);
  }
);

export default api;
