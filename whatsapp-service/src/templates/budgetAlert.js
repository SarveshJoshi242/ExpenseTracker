import { formatCurrency } from '../utils/formatter.js';

export const budgetAlertTemplate = (category, limit, spent) => {
  const percentage = Math.round((spent / limit) * 100);
  return `⚠️ *Budget Alert!*\n\nYou have spent ${percentage}% of your budget for *${category}*.\n\n*Limit:* ${formatCurrency(limit)}\n*Spent:* ${formatCurrency(spent)}\n\nPlease review your expenses.`;
};
