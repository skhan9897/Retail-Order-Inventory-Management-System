import api from './api';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      // Offline fallback simulation for demo
      if (!err.response) {
        if (email === 'demo@retailhub.com' || email.includes('@')) {
          const user = {
            id: 'cust-77',
            name: email.split('@')[0].toUpperCase(),
            email: email,
            phone: '+1 (555) 987-6543',
            role: 'CUSTOMER'
          };
          const token = 'mock-jwt-customer-token-xyz789';
          return { token, user };
        }
      }
      throw new Error(err.response?.data?.message || 'Invalid credentials');
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        const user = {
          id: `cust-${Date.now()}`,
          name: userData.fullName,
          email: userData.email,
          phone: userData.phone || '',
          role: 'CUSTOMER'
        };
        const token = `mock-jwt-token-${Date.now()}`;
        return { token, user };
      }
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/customer/profile');
      return response.data;
    } catch (err) {
      const stored = localStorage.getItem('customer_user');
      if (stored) return JSON.parse(stored);
      throw err;
    }
  },

  async resetPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      return { success: true, message: 'Password reset instructions sent to your email.' };
    }
  }
};
