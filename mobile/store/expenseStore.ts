import { create } from 'zustand';
import { Expense, DashboardStats, ExpenseFilters } from '../types';
import { expenseService } from '../services/expenseService';

interface ExpenseState {
  expenses: Expense[];
  stats: DashboardStats | null;
  isLoading: boolean;
  filters: ExpenseFilters;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Partial<Expense>) => Promise<void>;
  editExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: ExpenseFilters) => void;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  stats: null,
  isLoading: false,
  filters: {},

  fetchExpenses: async () => {
    set({ isLoading: true });
    try {
      const response = await expenseService.getExpenses(get().filters);
      if (response.success && response.data) {
        set({ expenses: response.data });
      }
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addExpense: async (expense) => {
    const response = await expenseService.createExpense(expense);
    if (response.success && response.data) {
      set((state) => ({ expenses: [response.data!, ...state.expenses] }));
      get().fetchStats();
    }
  },

  editExpense: async (id, expense) => {
    const response = await expenseService.updateExpense(id, expense);
    if (response.success && response.data) {
      set((state) => ({
        expenses: state.expenses.map((e) => e.id === id ? response.data! : e)
      }));
      get().fetchStats();
    }
  },

  removeExpense: async (id) => {
    const response = await expenseService.deleteExpense(id);
    if (response.success) {
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id)
      }));
      get().fetchStats();
    }
  },

  fetchStats: async () => {
    try {
      const response = await expenseService.getStats();
      if (response.success && response.data) {
        set({ stats: response.data });
      }
    } catch (error) {
      console.error(error);
    }
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
    get().fetchExpenses();
  }
}));
