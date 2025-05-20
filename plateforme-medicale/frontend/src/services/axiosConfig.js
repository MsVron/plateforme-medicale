import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set default base URL
axios.defaults.baseURL = API_URL;

// Add request interceptor to automatically add auth token
axios.interceptors.request.use(
  config => {
    // Don't add token for public endpoints
    if (config.url.includes('/public')) {
      return config;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
axios.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error('Authentication error');
      // Only redirect to login if not already on the login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // window.location.href = '/login'; // Uncomment to enable auto-redirect
      }
    }
    return Promise.reject(error);
  }
);

export default axios; 