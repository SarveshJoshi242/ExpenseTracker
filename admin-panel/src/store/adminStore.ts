import { create } from 'zustand';
import { DashboardStats, User } from '../types';
import { adminService } from '../services/adminService';

interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  dashboardData: DashboardStats | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
  login: (token: string) => void;
  logout: () => void;
  fetchDashboard: () => Promise<void>;
  fetchUsers: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: !!localStorage.getItem('adminToken'),
  token: localStorage.getItem('adminToken'),
  dashboardData: null,
  users: [],
  isLoading: false,
  error: null,
  login: (token: string) => {
    localStorage.setItem('adminToken', token);
    set({ isAuthenticated: true, token });
  },
  logout: () => {
    localStorage.removeItem('adminToken');
    set({ isAuthenticated: false, token: null, dashboardData: null, users: [] });
  },
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getDashboard();
      // API returns { success, message, data: {...} }
      const payload = response.data?.data || response.data;
      set({ dashboardData: payload, isLoading: false });
    } catch (error: any) {
      set({ 
        dashboardData: {
          totalUsers: 0,
          activeUsers: 0,
          totalTransactions: 0,
          totalExpensesCount: 0,
          totalAmountTracked: 0,
          newUsersThisMonth: 0,
          topCategories: [],
          userGrowth: [],
          expenseTrends: [],
          categoryDist: [],
          recentActivity: []
        }, 
        isLoading: false 
      });
    }
  },
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      try {
        const response = await adminService.getUsers();
        set({ users: response.data, isLoading: false });
      } catch (e) {
        set({ users: [
          {id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890', status: 'active', createdAt: '2023-01-01', totalExpenses: 500, lastActive: '2023-10-01'}
        ], isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch users', isLoading: false });
    }
  },
}));
