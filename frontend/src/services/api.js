import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080/api/v1' 
  : '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/authenticate', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const userApi = {
  getAllUsers: () => api.get('/users'),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

export const threatApi = {
  getThreats: () => api.get('/events?severity=CRITICAL'),
  resolveThreat: (id) => api.post(`/events/${id}/resolve`),
};

export const eventApi = {
  getEvents: () => api.get('/events'),
  resolveEvent: (id) => api.post(`/events/${id}/resolve`),
};

export default api;
