import axios from 'axios';
import { User } from '@/types';

const API_URL = '/api/auth/';

export const register = async (userData: { name: string; email: string; password: string; role?: string }): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}register`, userData);
    if (response.data) {
      const user: User = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role || 'SHOPPER',
        token: response.data.token
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const login = async (credentials: { email: string; password: string }): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}login`, credentials);
    if (response.data) {
      const user: User = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role || 'SHOPPER',
        token: response.data.token
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const getCurrentUserId = (): string | null => {
  const user = getCurrentUser();
  return user ? user.id : null;
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getCurrentUserId,
  getToken,
  isAuthenticated,
};

export default authService;
