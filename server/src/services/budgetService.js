import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import Notification from '../models/Notification.js';

export const calculateBudgetProgress = async (budget) => {
  const expenses = await Expense.aggregate([
    {
      $match: {
        userId: budget.userId,
        categoryId: budget.categoryId,
        type: 'expense',
        date: { $gte: budget.startDate, $lte: budget.endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: '$amount' }
      }
    }
  ]);

  const spentAmount = expenses.length > 0 ? expenses[0].totalSpent : 0;
  budget.spentAmount = spentAmount;
  await budget.save();

  // Alert check
  if (spentAmount >= budget.limitAmount) {
    await Notification.create({
      userId: budget.userId,
      title: 'Budget Exceeded',
      body: `You have exceeded your budget for category ID: ${budget.categoryId}`,
      type: 'budget_alert'
    });
  } else if (spentAmount >= budget.limitAmount * 0.8) {
    await Notification.create({
      userId: budget.userId,
      title: 'Budget Warning',
      body: `You have reached 80% of your budget for category ID: ${budget.categoryId}`,
      type: 'budget_alert'
    });
  }

  return budget;
};

export const updateCategoryBudgets = async (userId, categoryId, date) => {
  const budgets = await Budget.find({
    userId,
    categoryId,
    startDate: { $lte: date },
    endDate: { $gte: date },
    isActive: true
  });

  for (const budget of budgets) {
    await calculateBudgetProgress(budget);
  }
};
