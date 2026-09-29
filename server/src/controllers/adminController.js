import User from '../models/User.js';
import Expense from '../models/Expense.js';
import AuditLog from '../models/AuditLog.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import mongoose from 'mongoose';

export const getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalExpensesCount = await Expense.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const newUsersThisMonth = await User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } });
    
    const totalAmountAggr = await Expense.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalAmountTracked = totalAmountAggr[0] ? totalAmountAggr[0].total : 0;

    const topCategories = await Expense.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { _id: 0, name: '$category.name', total: 1 } }
    ]);

    successResponse(res, 200, 'Admin Dashboard Data', {
      totalUsers,
      totalExpensesCount,
      totalAmountTracked,
      newUsersThisMonth,
      topCategories
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { role: 'user' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-passwordHash')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
      
    const total = await User.countDocuments(query);

    successResponse(res, 200, 'Users retrieved', {
      users,
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

export const getUserDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return errorResponse(res, 404, 'User not found');

    const totalExpense = await Expense.aggregate([
      { $match: { userId: user._id, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    successResponse(res, 200, 'User details retrieved', {
      user,
      expenseSummary: totalExpense[0] ? totalExpense[0].total : 0
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found');

    user.isActive = !user.isActive;
    await user.save();
    
    await AuditLog.create({
      adminId: req.user.id,
      action: user.isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      targetModel: 'User',
      targetId: user._id,
      ipAddress: req.ip
    });

    successResponse(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, user);
  } catch (error) {
    next(error);
  }
};

export const getDbStats = async (req, res, next) => {
  try {
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    successResponse(res, 200, 'DB Stats retrieved', {
      collections: stats.collections,
      objects: stats.objects,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const logs = await AuditLog.find()
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
      
    const total = await AuditLog.countDocuments();
    
    successResponse(res, 200, 'Audit logs retrieved', {
      logs,
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

export const sendWhatsAppMessage = async (req, res, next) => {
  try {
    const { userId, message } = req.body;
    
    await Notification.create({
      userId,
      title: 'WhatsApp Message Placeholder',
      body: message,
      type: 'system',
      metadata: { channel: 'whatsapp' }
    });

    successResponse(res, 200, 'WhatsApp message simulated successfully');
  } catch (error) {
    next(error);
  }
};

export const broadcastMessage = async (req, res, next) => {
  try {
    const { title, message } = req.body;
    const activeUsers = await User.find({ role: 'user', isActive: true }).select('_id');
    
    const notifications = activeUsers.map(u => ({
      userId: u._id,
      title,
      body: message,
      type: 'system'
    }));

    await Notification.insertMany(notifications);
    successResponse(res, 200, 'Broadcast message sent to all active users');
  } catch (error) {
    next(error);
  }
};
