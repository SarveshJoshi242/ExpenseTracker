import { useState, useEffect, useCallback } from 'react';
import { Budget } from '../types';
import { budgetService } from '../services/budgetService';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await budgetService.getBudgets();
      if (response.success && response.data) {
        setBudgets(response.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = async (budget: Partial<Budget>) => {
    const res = await budgetService.createBudget(budget);
    if (res.success) fetchBudgets();
  };

  const updateBudget = async (id: string, budget: Partial<Budget>) => {
    const res = await budgetService.updateBudget(id, budget);
    if (res.success) fetchBudgets();
  };

  const removeBudget = async (id: string) => {
    const res = await budgetService.deleteBudget(id);
    if (res.success) fetchBudgets();
  };

  return {
    budgets,
    isLoading,
    refresh: fetchBudgets,
    addBudget,
    updateBudget,
    removeBudget
  };
};
