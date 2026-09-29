import Expense from '../models/Expense.js';

export const getExpenseStats = async (userId, startDate, endDate) => {
  const matchStage = {
    userId,
    ...(startDate && endDate ? { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {})
  };

  const stats = await Expense.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpense: 1,
        balance: { $subtract: ['$totalIncome', '$totalExpense'] }
      }
    }
  ]);

  return stats[0] || { totalIncome: 0, totalExpense: 0, balance: 0 };
};

export const getCategoryBreakdown = async (userId, startDate, endDate) => {
  const matchStage = {
    userId,
    type: 'expense',
    ...(startDate && endDate ? { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {})
  };

  return await Expense.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$categoryId',
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        _id: 0,
        categoryId: '$_id',
        name: '$category.name',
        color: '$category.color',
        totalAmount: 1
      }
    }
  ]);
};
