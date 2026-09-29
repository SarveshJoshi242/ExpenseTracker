import Expense from '../models/Expense.js';
import { updateCategoryBudgets } from '../services/budgetService.js';
import { getExpenseStats, getCategoryBreakdown } from '../services/expenseService.js';
import { exportToCSV, exportToPDF } from '../services/reportService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, categoryId, startDate, endDate, paymentMethod } = req.query;
    const query = { userId: req.user.id };

    if (type) query.type = type;
    if (categoryId) query.categoryId = categoryId;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(query)
      .populate('categoryId', 'name icon color')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Expense.countDocuments(query);

    successResponse(res, 200, 'Expenses retrieved', {
      expenses,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('categoryId', 'name icon color');
      
    if (!expense) return errorResponse(res, 404, 'Expense not found');
    
    successResponse(res, 200, 'Expense retrieved', expense);
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({ ...req.body, userId: req.user.id });
    
    if (expense.type === 'expense') {
      await updateCategoryBudgets(req.user.id, expense.categoryId, expense.date);
    }
    
    successResponse(res, 201, 'Expense created', expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) return errorResponse(res, 404, 'Expense not found');

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (expense.type === 'expense') {
      await updateCategoryBudgets(req.user.id, expense.categoryId, expense.date);
    }
    
    successResponse(res, 200, 'Expense updated', expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) return errorResponse(res, 404, 'Expense not found');

    const { categoryId, date, type } = expense;
    await Expense.findByIdAndDelete(req.params.id);
    
    if (type === 'expense') {
      await updateCategoryBudgets(req.user.id, categoryId, date);
    }
    
    successResponse(res, 200, 'Expense deleted');
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await getExpenseStats(req.user.id, startDate, endDate);
    const categoryBreakdown = await getCategoryBreakdown(req.user.id, startDate, endDate);
    
    successResponse(res, 200, 'Stats retrieved', { stats, categoryBreakdown });
  } catch (error) {
    next(error);
  }
};

export const exportExpenses = async (req, res, next) => {
  try {
    const { format = 'csv', startDate, endDate } = req.query;
    const query = { userId: req.user.id };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(query).populate('categoryId', 'name').sort({ date: -1 });

    if (format === 'csv') {
      const csv = exportToCSV(expenses);
      res.header('Content-Type', 'text/csv');
      res.attachment('expenses.csv');
      return res.send(csv);
    } else if (format === 'pdf') {
      const stats = await getExpenseStats(req.user.id, startDate, endDate);
      const pdfBuffer = await exportToPDF(expenses, stats);
      res.header('Content-Type', 'application/pdf');
      res.attachment('expenses.pdf');
      return res.send(pdfBuffer);
    } else {
      return errorResponse(res, 400, 'Unsupported format');
    }
  } catch (error) {
    next(error);
  }
};
