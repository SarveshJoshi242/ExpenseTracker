import { api } from './api';
import { Expense, ExpenseFilters, DashboardStats, ApiResponse } from '../types';

export const expenseService = {
  getExpenses: async (filters?: ExpenseFilters): Promise<ApiResponse<Expense[]>> => {
    const { data } = await api.get('/expenses', { params: filters });
    return data;
  },

  createExpense: async (expense: Partial<Expense>): Promise<ApiResponse<Expense>> => {
    const { data } = await api.post('/expenses', expense);
    return data;
  },

  updateExpense: async (id: string, expense: Partial<Expense>): Promise<ApiResponse<Expense>> => {
    const { data } = await api.put(`/expenses/${id}`, expense);
    return data;
  },

  deleteExpense: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/expenses/${id}`);
    return data;
  },

  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const { data } = await api.get('/expenses/stats');
    return data;
  }
};
