import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Ensure baseURL ends with /api
if (!baseURL.endsWith('/api')) {
  // Remove trailing slash if present before appending /api
  baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  baseURL += '/api';
}

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
