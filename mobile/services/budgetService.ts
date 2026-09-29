import { api } from './api';
import { Budget, ApiResponse } from '../types';

export const budgetService = {
  getBudgets: async (): Promise<ApiResponse<Budget[]>> => {
    const { data } = await api.get('/budgets');
    return data;
  },

  createBudget: async (budget: Partial<Budget>): Promise<ApiResponse<Budget>> => {
    const { data } = await api.post('/budgets', budget);
    return data;
  },

  updateBudget: async (id: string, budget: Partial<Budget>): Promise<ApiResponse<Budget>> => {
    const { data } = await api.put(`/budgets/${id}`, budget);
    return data;
  },

  deleteBudget: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/budgets/${id}`);
    return data;
  }
};
