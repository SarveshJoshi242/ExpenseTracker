import { create } from 'zustand';
import { storage } from '../utils/storage';
import { User, AuthState } from '../types';

interface AuthStore extends AuthState {
  login: (user: User, token: string) => Promise<void>;
  register: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  updateProfile: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (user, token) => {
    await storage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  register: async (user, token) => {
    await storage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await storage.deleteItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadToken: async () => {
    try {
      const token = await storage.getItem('token');
      if (token) {
        set({ token, isAuthenticated: true });
      }
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: (updatedUser) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null
    }));
  }
}));
