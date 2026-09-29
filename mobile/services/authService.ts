import { api } from './api';
import { User, ApiResponse } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    // Mock for now or make actual request
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  
  register: async (userData: any): Promise<ApiResponse<{ user: User; token: string }>> => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const { data } = await api.get('/auth/profile');
    return data;
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const { data } = await api.put('/auth/profile', userData);
    return data;
  },

  changePassword: async (passwords: any): Promise<ApiResponse<void>> => {
    const { data } = await api.post('/auth/change-password', passwords);
    return data;
  }
};
