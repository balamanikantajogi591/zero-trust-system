import axios from 'axios';

const API_URL = '/api/auth';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) return null;
    return { token, role };
  }
};
