import Budget from '../models/Budget.js';
import { calculateBudgetProgress } from '../services/budgetService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).populate('categoryId', 'name icon color');
    successResponse(res, 200, 'Budgets retrieved', budgets);
  } catch (error) {
    next(error);
  }
};

export const getBudgetById = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.id }).populate('categoryId', 'name icon color');
    if (!budget) return errorResponse(res, 404, 'Budget not found');
    successResponse(res, 200, 'Budget retrieved', budget);
  } catch (error) {
    next(error);
  }
};

export const createBudget = async (req, res, next) => {
  try {
    let budget = await Budget.create({ ...req.body, userId: req.user.id });
    budget = await calculateBudgetProgress(budget);
    successResponse(res, 201, 'Budget created', budget);
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findOne({ _id: req.params.id, userId: req.user.id });
    if (!budget) return errorResponse(res, 404, 'Budget not found');

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    budget = await calculateBudgetProgress(budget);
    
    successResponse(res, 200, 'Budget updated', budget);
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!budget) return errorResponse(res, 404, 'Budget not found');
    successResponse(res, 200, 'Budget deleted');
  } catch (error) {
    next(error);
  }
};

export const getBudgetProgress = async (req, res, next) => {
  try {
    let budget = await Budget.findOne({ _id: req.params.id, userId: req.user.id });
    if (!budget) return errorResponse(res, 404, 'Budget not found');
    
    budget = await calculateBudgetProgress(budget);
    const progressPercentage = budget.limitAmount > 0 ? (budget.spentAmount / budget.limitAmount) * 100 : 0;
    
    successResponse(res, 200, 'Budget progress retrieved', {
      budget,
      progressPercentage: Math.min(progressPercentage, 100),
      isExceeded: budget.spentAmount > budget.limitAmount
    });
  } catch (error) {
    next(error);
  }
};
