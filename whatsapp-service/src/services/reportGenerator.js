import mongoose from 'mongoose';
import { expenseReportTemplate } from '../templates/expenseReport.js';
import logger from '../utils/logger.js';

// Define minimal schema just for lookup
const ExpenseSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  category: String,
  type: String
}, { collection: 'expenses' });

let Expense;
try {
  Expense = mongoose.model('Expense');
} catch (e) {
  Expense = mongoose.model('Expense', ExpenseSchema);
}

export const generateExpenseReport = async (userId) => {
  try {
    const expenses = await Expense.find({ userId, type: 'expense' });
    
    let total = 0;
    const categoryMap = {};

    expenses.forEach(exp => {
      total += exp.amount;
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    });

    const categories = Object.keys(categoryMap).map(name => ({
      name,
      amount: categoryMap[name]
    })).sort((a, b) => b.amount - a.amount); // Sort by highest

    return expenseReportTemplate('User', total, categories);
  } catch (error) {
    logger.error('Error generating report:', error);
    return 'Sorry, there was an error generating your report.';
  }
};
