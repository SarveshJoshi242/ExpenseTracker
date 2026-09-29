import { formatCurrency } from '../utils/formatter.js';

export const expenseReportTemplate = (userName, totalExpenses, categories) => {
  let message = `📊 *Expense Report for ${userName}*\n\n`;
  message += `*Total Expenses:* ${formatCurrency(totalExpenses)}\n\n`;
  message += `*Breakdown by Category:*\n`;
  
  if (categories && categories.length > 0) {
    categories.forEach(cat => {
      message += `- ${cat.name}: ${formatCurrency(cat.amount)}\n`;
    });
  } else {
    message += `_No expenses recorded yet._\n`;
  }
  
  message += `\nKeep tracking! 💰`;
  return message;
};
