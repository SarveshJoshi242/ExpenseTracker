import axios from 'axios';
import { storage } from '../utils/storage';
import { CONFIG } from '../constants/config';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: CONFIG.API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    // Handle logout
    useAuthStore.getState().logout();
  }
  return Promise.reject(error);
});
