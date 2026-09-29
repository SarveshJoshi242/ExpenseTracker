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
      // Mocking dashboard data for now if API fails
      try {
        const response = await adminService.getDashboard();
        set({ dashboardData: response.data, isLoading: false });
      } catch (e) {
        set({ dashboardData: {
          totalUsers: 1542,
          activeUsers: 1200,
          totalTransactions: 45231,
          totalAmountTracked: 1250000,
          userGrowth: [{date: '2023-01', users: 100}, {date: '2023-02', users: 300}, {date: '2023-03', users: 800}],
          expenseTrends: [{date: '2023-01', amount: 5000, count: 100}],
          categoryDist: [{name: 'Food', value: 400}],
          recentActivity: [{id: '1', type: 'signup', description: 'New user joined', time: '10 min ago'}]
        }, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch dashboard', isLoading: false });
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
