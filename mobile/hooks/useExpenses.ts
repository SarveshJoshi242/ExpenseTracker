import { useEffect } from 'react';
import { useExpenseStore } from '../store/expenseStore';

export const useExpenses = () => {
  const { expenses, stats, isLoading, filters, fetchExpenses, addExpense, editExpense, removeExpense, fetchStats, setFilters } = useExpenseStore();

  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, [fetchExpenses, fetchStats]);

  return {
    expenses,
    stats,
    isLoading,
    filters,
    addExpense,
    editExpense,
    removeExpense,
    setFilters,
    refresh: () => {
      fetchExpenses();
      fetchStats();
    }
  };
};
